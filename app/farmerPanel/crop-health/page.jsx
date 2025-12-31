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
        <div className="flex flex-col items-center space-y-6">
          
          {/* Image Upload Area */}
          <div className="w-full max-w-md">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
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

          {/* Action Button */}
          <button
            onClick={handleSubmit}
            disabled={!selectedImage || loading}
            className={`btn btn-primary w-full max-w-md text-white font-bold py-3 text-lg ${loading ? 'loading' : ''}`}
          >
            {loading ? "Detecting Disease..." : "Analyze Crop"}
          </button>

          {/* Loading State Overlay */}
          {loading && (
            <div className="text-center space-y-2 animate-pulse">
              <p className="text-primary font-medium text-lg">Analyzing crop health...</p>
              <p className="text-sm text-gray-500">Please wait while our AI examines the image</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="alert alert-error max-w-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}

          {/* Result Display */}
          {result && !loading && (
            <div className="card w-full max-w-md bg-base-100 shadow-xl border border-green-100">
              <div className="card-body items-center text-center">
                <h2 className="card-title text-2xl text-gray-800">Analysis Result</h2>
                <div className="divider my-0"></div>
                
                <div className="stats shadow w-full">
                  <div className="stat place-items-center">
                    <div className="stat-title">Detected Disease</div>
                    <div className="stat-value text-primary text-xl whitespace-normal break-words">{result.disease}</div>
                  </div>
                </div>

                <div className="stats shadow w-full mt-4">
                   <div className="stat place-items-center">
                    <div className="stat-title">Confidence Score</div>
                    <div className="stat-value text-secondary text-xl">{(result.confidence * 100).toFixed(1)}%</div>
                    <div className="stat-desc">AI Certainty Level</div>
                  </div>
                </div>

                <div className="card-actions justify-end mt-6">
                   <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                        setSelectedImage(null);
                        setPreviewUrl(null);
                        setResult(null);
                    }}
                   >
                    Analyze Another
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
