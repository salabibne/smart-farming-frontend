"use client";

import { useState } from "react";
import { cropHealthService } from "./service";
import Image from "next/image";

export default function CropHealthPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const data = await cropHealthService.predictDisease(formData);
      setResult(data);
    } catch (err) {
      console.error("Error predicting disease:", err);
      setError("Failed to analyze image. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">Crop Health Detection</h1>
        <p className="text-gray-600">Upload a photo of your crop to detect potential diseases</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className={`grid gap-8 ${result ? 'lg:grid-cols-2 lg:items-start' : 'max-w-md mx-auto flex flex-col items-center'}`}>
          
          {/* Left Side: Image Upload/Preview */}
          <div className="space-y-6">
            <div className="w-full">
              <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden">
                {previewUrl ? (
                  <div className="relative w-full h-full">
                    <Image 
                      src={previewUrl} 
                      alt="Preview" 
                      fill 
                      className="object-contain rounded-lg p-2"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>

            {/* Action Button and Loading */}
            <div className="space-y-4">
              <button
                onClick={handleSubmit}
                disabled={!selectedImage || loading}
                className={`btn btn-primary w-full text-white font-bold py-3 text-lg ${loading ? 'loading' : ''}`}
              >
                {loading ? "Detecting Disease..." : "Analyze Crop"}
              </button>

              {loading && (
                <div className="text-center space-y-2 animate-pulse">
                  <p className="text-primary font-medium text-lg">Analyzing crop health...</p>
                  <p className="text-sm text-gray-500">Please wait while our AI examines the image</p>
                </div>
              )}

              {error && (
                <div className="alert alert-error">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Result Display */}
          {result && !loading && (
            <div className="card w-full bg-base-100 shadow-xl border border-green-100">
              <div className="card-body">
                <h2 className="card-title text-2xl text-gray-800 self-center">Analysis Report</h2>
                <div className="divider my-0"></div>
                
                <div className="stats shadow w-full">
                  <div className="stat place-items-center">
                    <div className="stat-title text-gray-600">Detected Disease</div>
                    <div className="stat-value text-primary text-xl whitespace-normal text-center break-words mt-1">
                      {result.disease.replace(/___/g, " - ").replace(/_/g, " ")}
                    </div>
                  </div>
                </div>

                <div className="stats shadow w-full mt-4">
                   <div className="stat place-items-center">
                    <div className="stat-title text-gray-600">Confidence Score</div>
                    <div className="stat-value text-secondary text-xl">{(result.confidence * 100).toFixed(1)}%</div>
                    <div className="stat-desc">AI Certainty Level</div>
                  </div>
                </div>

                {result.prescription && (
                  <div className="w-full mt-6 text-left bg-green-50 p-5 rounded-lg border border-green-200">
                    <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.05.147m14.428 0a2 2 0 01.445.08l1.387.347a2 2 0 011.277 1.277l.347 1.387a2 2 0 01-.08.445m-14.428 0a2 2 0 00-.445-.08l-1.387-.347a2 2 0 00-1.277-1.277l-.347-1.387a2 2 0 00.08-.445m14.428 0A10.97 10.97 0 0112 18a10.97 10.97 0 01-7.428-2.572M15 11h.01M9 11h.01M12 11h.01M12 11h.01M12 11h.01M12 11h.01M12 12h.01M12 12h.01M12 10h.01" />
                       </svg>
                       Prescription
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Ingredient</p>
                        <p className="text-gray-700 font-medium">{result.prescription.active_ingredient}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Standard Dosage</p>
                        <p className="text-gray-700 font-medium">{result.prescription.standard_dosage}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="card-actions justify-center mt-6">
                   <button 
                    className="btn btn-outline btn-sm px-8"
                    onClick={() => {
                        setSelectedImage(null);
                        setPreviewUrl(null);
                        setResult(null);
                    }}
                   >
                    Clear Analysis
                   </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
