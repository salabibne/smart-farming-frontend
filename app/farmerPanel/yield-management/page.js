"use client";
import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import axios from 'axios';
import { 
  CloudArrowUpIcon, 
  MapIcon, 
  BeakerIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  PhotoIcon,
  TicketIcon,
  ScaleIcon,
  CircleStackIcon,
  BeakerIcon as BeakerIconOutline,
  CalendarIcon,
  ClockIcon,
  InboxStackIcon,
  ListBulletIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const initialFormData = {
    name: '',
    location: '',
    size_Square_Meter: '',
    N: '',
    P: '',
    K: '',
    pH: '',
    temperature: '',
    humidity: '',
    rainfall: ''
  };

export default function YieldManagement() {
  const [formData, setFormData] = useState(initialFormData);
  const [recommendations, setRecommendations] = useState(null);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [processedData, setProcessedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [seedPlan, setSeedPlan] = useState(null);
  const [loadingSeedPlan, setLoadingSeedPlan] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('rice');
  const [fertilizerPlan, setFertilizerPlan] = useState(null);
  const [loadingFertilizerPlan, setLoadingFertilizerPlan] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [fields, setFields] = useState([]);
  const [loadingFields, setLoadingFields] = useState(false);

  // Fetch registered fields
  const fetchFields = async () => {
    setLoadingFields(true);
    try {
      const response = await api.get('/field');
      setFields(response.data.data);
    } catch (error) {
      console.error("Failed to fetch fields:", error);
    } finally {
      setLoadingFields(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setProcessedData(null);
      
      analyzeField(file);
    }
  };

  const analyzeField = async (file) => {
    setAnalyzing(true);
    try {
      const boundaryFormData = new FormData();
      boundaryFormData.append("file", file);

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await axios.post('http://localhost:8002/field-boundary', boundaryFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      const data = response.data;
      setProcessedData(data);
      
      if (data.area_m2) {
        setFormData(prev => ({
          ...prev,
          size_Square_Meter: data.area_m2.toFixed(2)
        }));
      }

    } catch (error) {
      console.error("Field analysis failed:", error);
      const errorMsg = error.response?.data?.detail || error.message;
      setMessage({ 
        type: 'error', 
        text: `Analysis failed: ${errorMsg}. Is the backend running on port 8002?` 
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!imageFile) throw new Error("Please select an image.");

      const imageFormData = new FormData();
      imageFormData.append("image", imageFile);
      
      const imgbbResponse = await axios.post(`https://api.imgbb.com/1/upload?key=8cae85977e698c7c3ce9cf56055032cb`, imageFormData);

      const imgbbData = imgbbResponse.data;
      if (!imgbbData.success) throw new Error("Failed to upload image to ImageBB.");

      const imageUrl = imgbbData.data.url;

      const payload = {
        name: formData.name,
        location: formData.location,
        size_Square_Meter: parseFloat(formData.size_Square_Meter),
        imageURL: imageUrl,
        N: parseFloat(formData.N),
        P: parseFloat(formData.P),
        K: parseFloat(formData.K),
        pH: parseFloat(formData.pH)
      };

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      await api.post('/field', payload);

      setMessage({ type: 'success', text: "Field added successfully!" });
      setFormData(initialFormData);
      fetchFields(); // Refresh the list
      setImageFile(null);
      setPreviewUrl(null);
      setProcessedData(null);

    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || error.message;
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleGetRecommendation = async () => {
    setMessage(null);
    setLoadingRecommendation(true);
    try {
      // Validate inputs
      const requiredFields = ['N', 'P', 'K', 'temperature', 'humidity', 'pH', 'rainfall'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all fields: ${missingFields.join(', ')}`);
      }

      const payload = [
        parseFloat(formData.N),
        parseFloat(formData.P),
        parseFloat(formData.K),
        parseFloat(formData.temperature),
        parseFloat(formData.humidity),
        parseFloat(formData.pH),
        parseFloat(formData.rainfall)
      ];

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await axios.post('http://localhost:8006/predict', payload, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      setRecommendations(response.data.top_3_recommendations);
      
    } catch (error) {
      console.error("Recommendation failed:", error);
      const errorMsg = error.response?.data?.detail || error.message;
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoadingRecommendation(false);
    }
  };

  const handleCalculateSeedPlan = async () => {
    if (!formData.size_Square_Meter) {
      setMessage({ type: 'error', text: "Please analyze field boundary first to get area." });
      return;
    }

    setLoadingSeedPlan(true);
    setSeedPlan(null);
    try {
      const payload = {
        area_sq_m: parseFloat(formData.size_Square_Meter),
        crop_name: selectedCrop
      };

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await axios.post('http://127.0.0.1:8007/api/seed-planner', payload, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      setSeedPlan(response.data);
    } catch (error) {
      console.error("Seed planning failed:", error);
      const errorMsg = error.response?.data?.detail || error.message;
      setMessage({ type: 'error', text: `Seed planning failed: ${errorMsg}` });
    } finally {
      setLoadingSeedPlan(false);
    }
  };

  const handleCalculateFertilizerPlan = async () => {
    if (!formData.size_Square_Meter) {
      setMessage({ type: 'error', text: "Please analyze field boundary first to get area." });
      return;
    }

    setLoadingFertilizerPlan(true);
    setFertilizerPlan(null);
    try {
      const payload = {
        crop_name: selectedCrop,
        area_sq_m: parseFloat(formData.size_Square_Meter),
        num_plants: 0,
        soil_inputs: {
          N: formData.N ? parseFloat(formData.N) : undefined,
          P: formData.P ? parseFloat(formData.P) : undefined,
          K: formData.K ? parseFloat(formData.K) : undefined
        }
      };

      // Filter out undefined soil inputs if they are not provided
      if (payload.soil_inputs.N === undefined) delete payload.soil_inputs.N;
      if (payload.soil_inputs.P === undefined) delete payload.soil_inputs.P;
      if (payload.soil_inputs.K === undefined) delete payload.soil_inputs.K;

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await axios.post('http://localhost:8008/fertilizer/by-crop', payload, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      setFertilizerPlan(response.data);
    } catch (error) {
      console.error("Fertilizer planning failed:", error);
      const errorMsg = error.response?.data?.detail || error.message;
      setMessage({ type: 'error', text: `Fertilizer planning failed: ${errorMsg}` });
    } finally {
      setLoadingFertilizerPlan(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Yield Management</h1>
            <p className="text-sm text-gray-500 mt-1">Register new fields and analyze soil composition</p>
          </div>
          {message && (
             <div className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium ${
               message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
             }`}>
               {message.type === 'success' ? <CheckCircleIcon className="w-5 h-5"/> : <ExclamationCircleIcon className="w-5 h-5"/>}
               {message.text}
             </div>
          )}
        </div>

        {/* Multi-Step Progress Tracker */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex items-center justify-between max-w-4xl mx-auto relative">
            {/* Connection Lines */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 -z-0"></div>
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-green-500 -translate-y-1/2 transition-all duration-500 -z-0"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>

            {[
              { id: 1, label: "Field Setup", icon: MapIcon },
              { id: 2, label: "Soil & Crop", icon: BeakerIcon },
              { id: 3, label: "Planning", icon: CalendarIcon }
            ].map((step, idx) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-4 
                    ${currentStep >= step.id 
                      ? 'bg-green-600 border-green-100 text-white' 
                      : 'bg-white border-gray-50 text-gray-400'}`}
                >
                  <step.icon className="w-5 h-5"/>
                </div>
                <span className={"text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 " + 
                  (currentStep >= step.id ? 'text-green-700' : 'text-gray-400')}>
                  {step.label}
                </span>
                {currentStep > step.id && (
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5 shadow-sm">
                    <CheckCircleIcon className="w-3 h-3"/>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Registered Fields Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-gray-800">
              <InboxStackIcon className="w-5 h-5 text-blue-600"/>
              <h2 className="font-semibold text-lg">Registered Fields</h2>
            </div>
            <button 
              type="button" 
              onClick={fetchFields}
              disabled={loadingFields}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              {loadingFields ? (
                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              )}
              Sync Fields
            </button>
          </div>

          {loadingFields && fields.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-50 rounded-xl border border-gray-100"></div>
              ))}
            </div>
          ) : fields.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map((field) => (
                <div key={field.id} className="group relative bg-gray-50/50 rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:bg-white transition-all shadow-sm hover:shadow-md cursor-pointer" 
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      name: field.name || '',
                      location: field.location || '',
                      size_Square_Meter: field.size_Square_Meter?.toString() || '',
                      N: field.N?.toString() || '',
                      P: field.P?.toString() || '',
                      K: field.K?.toString() || '',
                      pH: field.pH?.toString() || '',
                      temperature: field.temperature?.toString() || '',
                      humidity: field.humidity?.toString() || '',
                      rainfall: field.rainfall?.toString() || ''
                    }));
                    setPreviewUrl(field.imageURL || null);
                    setProcessedData(null);
                    setCurrentStep(1);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight text-sm">{field.name}</h3>
                      <div className="flex items-center gap-1 text-gray-500 text-[10px] font-medium uppercase tracking-wider">
                        <MapIcon className="w-3 h-3"/>
                        {field.location}
                      </div>
                    </div>
                    <div className="bg-white px-2 py-1 rounded-md border border-gray-100 shadow-xs flex flex-col items-center">
                      <span className="text-[10px] font-bold text-blue-600 leading-tight">{field.size_Square_Meter}</span>
                      <span className="text-[8px] text-gray-400 uppercase leading-none font-bold">m²</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-4 gap-2 border-t border-gray-100 pt-3">
                    <div className="text-center">
                      <p className="text-[8px] text-gray-400 uppercase font-black tracking-widest">N</p>
                      <p className="text-xs font-bold text-gray-700">{field.N || '-'}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] text-gray-400 uppercase font-black tracking-widest">P</p>
                      <p className="text-xs font-bold text-gray-700">{field.P || '-'}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] text-gray-400 uppercase font-black tracking-widest">K</p>
                      <p className="text-xs font-bold text-gray-700">{field.K || '-'}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] text-gray-400 uppercase font-black tracking-widest">pH</p>
                      <p className="text-xs font-bold text-gray-700">{field.pH || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="p-1 bg-blue-100 text-blue-600 rounded">
                      <ArrowRightIcon className="w-3 h-3"/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
               <MapIcon className="w-10 h-10 text-gray-300 mx-auto mb-3"/>
               <p className="text-gray-500 font-medium">No registered fields found</p>
               <p className="text-xs text-gray-400 mt-1">Add your first field below to start analyzing</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Form Section - Left Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Step 1: Field Setup */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Field Identity Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-6 text-gray-800">
                    <MapIcon className="w-5 h-5 text-green-600"/>
                    <h2 className="font-semibold text-lg">Field Details</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Field Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name || ""} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                        placeholder="e.g. North Sector A"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location / Coordinates</label>
                      <input 
                        type="text" 
                        name="location" 
                        value={formData.location || ""} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                        placeholder="e.g. 23.456, 90.123"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Total Area (m²)
                        {analyzing && <span className="ml-2 text-blue-500 text-[10px] animate-pulse">Calculating from image...</span>}
                      </label>
                      <div className="relative">
                        <input 
                          type="number" 
                          name="size_Square_Meter" 
                          value={formData.size_Square_Meter || ""} 
                          readOnly
                          className="w-full pl-4 pr-12 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none cursor-not-allowed font-medium text-gray-500"
                          placeholder="Auto-calculated"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">m²</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Calculated automatically from field boundary analysis</p>
                    </div>
                  </div>
                </div>

                {/* Visual Analysis Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-gray-800">
                      <PhotoIcon className="w-5 h-5 text-green-600"/>
                      <h2 className="font-semibold text-lg">Visual Analysis</h2>
                    </div>
                    {analyzing && (
                      <span className="flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                        Processing Boundary
                      </span>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Upload Zone */}
                    {!previewUrl ? (
                      <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 transition-colors hover:border-green-400 hover:bg-green-50/30 group text-center cursor-pointer">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleFileChange}
                          required
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-3 bg-green-100 text-green-600 rounded-full group-hover:bg-green-200 transition-colors">
                            <CloudArrowUpIcon className="w-6 h-6"/>
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium">Click or drag field image here</p>
                            <p className="text-sm text-gray-500">Supports JPG, PNG (Max 10MB)</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Original Image */}
                        <div className="group relative rounded-xl overflow-hidden border border-gray-200">
                          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded">Original</div>
                          <button 
                            type="button"
                            onClick={() => {
                              setPreviewUrl(null);
                              setProcessedData(null);
                              setImageFile(null);
                              setFormData(prev => ({ ...prev, size_Square_Meter: '' }));
                            }}
                            className="absolute top-3 right-3 p-1 bg-white/90 text-gray-600 rounded-md shadow-sm hover:text-red-500 transition-colors"
                          >
                            <span className="sr-only">Remove</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                          <img src={previewUrl} alt="Original" className="w-full h-64 object-cover"/>
                        </div>

                        {/* Processed Result */}
                        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center min-h-[16rem]">
                          {processedData ? (
                            <>
                              <div className="absolute top-3 left-3 bg-green-600/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded shadow-sm">Analysis Result</div>
                              <img src={`data:image/png;base64,${processedData.overlay_image_base64}`} alt="Processed" className="w-full h-64 object-cover"/>
                              {/* Stats Overlay */}
                              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                                <div className="flex justify-between items-end text-white">
                                  <div>
                                    <p className="text-xs text-white/80">Detected Area</p>
                                    <p className="text-lg font-bold">{processedData.area_m2.toFixed(1)} m²</p>
                                  </div>
                                  <span className="text-xs bg-white/20 px-2 py-1 rounded border border-white/30">High Confidence</span>
                                </div>
                              </div>
                            </>
                          ) : previewUrl && !analyzing ? (
                            <div className="flex flex-col items-center text-gray-400 gap-2 p-6 text-center">
                              <div className="p-4 bg-green-100 rounded-full text-green-600 mb-2">
                                <CheckCircleIcon className="w-10 h-10"/>
                              </div>
                              <span className="text-sm font-bold text-gray-700">Analysis Verified</span>
                              <p className="text-xs text-gray-500 max-w-[200px]">This field has already been analyzed and is ready for planning tools.</p>
                              <div className="mt-4 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Saved Area</p>
                                <p className="text-xl font-black text-green-600">{formData.size_Square_Meter} m²</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center text-gray-400 gap-2">
                              {analyzing ? (
                                <>
                                  <svg className="animate-spin h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                                  <span className="text-sm font-medium text-gray-500">Processing image...</span>
                                </>
                              ) : (
                                <>
                                  <ExclamationCircleIcon className="w-12 h-12 opacity-50 text-red-400"/>
                                  <span className="text-sm text-red-500">Analysis Failed</span>
                                  <button 
                                    type="button" 
                                    onClick={() => imageFile && analyzeField(imageFile)}
                                    className="text-xs text-green-600 hover:underline mt-1"
                                  >
                                    Retry Analysis
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Soil & Crop Confirmation */}
            {currentStep === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center" id="step2-success">
                  <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircleIcon className="w-10 h-10"/>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Field Details Captured!</h3>
                  <div className="mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-100 inline-block text-left min-w-[300px]">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Field Name</span>
                      <span className="font-bold text-gray-900">{formData.name || 'Untitled'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Detected Area</span>
                      <span className="text-xl font-black text-green-600">{formData.size_Square_Meter || '0'} m²</span>
                    </div>
                  </div>
                  <p className="text-gray-500 mt-8 max-w-md mx-auto leading-relaxed">
                    Now, use the <strong>Soil Composition</strong> sidebar on the right to input your laboratory soil analysis results and get personalized crop recommendations.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Planning Tools */}
            {currentStep === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                
                {/* Seed Planner Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-gray-800">
                      <TicketIcon className="w-5 h-5 text-indigo-600"/>
                      <h2 className="font-semibold text-lg">Seed Planner</h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Target Crop</label>
                        <select 
                          value={selectedCrop}
                          onChange={(e) => setSelectedCrop(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900"
                        >
                          <option value="rice">Rice</option>
                          <option value="maize">Maize</option>
                          <option value="wheat">Wheat</option>
                          <option value="chickpea">Chickpea</option>
                          <option value="mungbean">Mungbean</option>
                          <option value="blackgram">Blackgram</option>
                          <option value="lentil">Lentil</option>
                          <option value="mustard">Mustard</option>
                          <option value="jute">Jute</option>
                          <option value="cotton">Cotton</option>
                          <option value="potato">Potato</option>
                          <option value="tomato">Tomato</option>
                          <option value="onion">Onion</option>
                          <option value="chilli">Chilli</option>
                          <option value="marigold">Marigold</option>
                          <option value="watermelon">Watermelon</option>
                          <option value="banana">Banana</option>
                          <option value="guava">Guava</option>
                          <option value="dragon fruit">Dragon Fruit</option>
                          <option value="tea">Tea</option>
                          <option value="mango">Mango</option>
                          <option value="orange">Orange</option>
                          <option value="papaya">Papaya</option>
                          <option value="coconut">Coconut</option>
                        </select>
                      </div>

                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-2">
                        <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm">
                          <ScaleIcon className="w-4 h-4"/>
                          Current Area Selection
                        </div>
                        <p className="text-2xl font-bold text-blue-900">
                          {formData.size_Square_Meter ? `${formData.size_Square_Meter} m²` : '---'}
                        </p>
                        <p className="text-xs text-blue-600">Plan is based on detected area from image analysis</p>
                      </div>

                      <button 
                        type="button"
                        onClick={handleCalculateSeedPlan}
                        disabled={loadingSeedPlan}
                        className={`w-full py-3 px-4 rounded-xl text-white font-semibold shadow-lg shadow-indigo-200 transition-all transform active:scale-95 flex justify-center items-center gap-2
                          ${loadingSeedPlan ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                      >
                        {loadingSeedPlan ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                            Calculating...
                          </>
                        ) : (
                          <>
                            <CircleStackIcon className="w-5 h-5"/>
                            Calculate Seed Plan
                          </>
                        )}
                      </button>
                    </div>

                    <div className="min-h-[200px] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-center">
                      {seedPlan ? (
                        <div className="w-full space-y-4">
                          <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-sm font-medium text-gray-500">Crop Type</span>
                            <span className="font-bold text-gray-900 capitalize">{seedPlan.crop} ({seedPlan.type})</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-left">
                            <div className="p-3 bg-white rounded-lg border border-gray-100">
                              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Seed Weight</p>
                              <p className="text-xl font-black text-indigo-600">{seedPlan.estimated_seed_weight_kg} <span className="text-sm font-normal text-gray-500">kg</span></p>
                            </div>
                            <div className="p-3 bg-white rounded-lg border border-gray-100">
                              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Sowing Depth</p>
                              <p className="text-xl font-black text-green-600">{seedPlan.sowing_depth}</p>
                            </div>
                          </div>
                          <div className="space-y-3 pt-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Total Plant Count</span>
                              <span className="font-bold text-gray-900">{seedPlan.total_plant_count.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Area in Hectares</span>
                              <span className="font-bold text-gray-900">{seedPlan.area_ha} ha</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="p-3 bg-indigo-50 text-indigo-400 rounded-full inline-block">
                            <CircleStackIcon className="w-8 h-8"/>
                          </div>
                          <div>
                            <p className="text-gray-900 font-semibold">Ready to Calculate</p>
                            <p className="text-sm text-gray-500">Select crop and click calculate to see the detailed seed plan for your field</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fertilizer Planning Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-gray-800">
                      <BeakerIconOutline className="w-5 h-5 text-emerald-600"/>
                      <h2 className="font-semibold text-lg">Fertilizer Planning</h2>
                    </div>
                    {!fertilizerPlan && (
                      <button 
                        type="button"
                        onClick={handleCalculateFertilizerPlan}
                        disabled={loadingFertilizerPlan}
                        className={`px-6 py-2 rounded-lg text-white font-medium text-sm transition-all flex items-center gap-2
                          ${loadingFertilizerPlan ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-100'}`}
                      >
                        {loadingFertilizerPlan ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                            Calculating...
                          </>
                        ) : (
                          <>
                            <BeakerIconOutline className="w-4 h-4"/>
                            Calculate Fertilizer Plan
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {fertilizerPlan ? (
                    <div className="space-y-8">
                      {/* Total Inventory Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {Object.entries(fertilizerPlan.total_inventory).map(([fName, fAmount]) => (
                          <div key={fName} className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-center">
                            <p className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider mb-1">{fName.replace('_', ' ')}</p>
                            <p className="text-xl font-black text-emerald-900">{fAmount.split(' ')[0]} <span className="text-sm font-normal text-emerald-600">{fAmount.split(' ')[1]}</span></p>
                          </div>
                        ))}
                      </div>

                      {/* Timeline Visualization */}
                      <div className="relative">
                        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-100 hidden md:block"></div>
                        <div className="space-y-6">
                          {fertilizerPlan.timeline.map((item, index) => (
                            <div key={index} className="relative flex flex-col md:flex-row gap-6">
                              {/* Timeline Dot */}
                              <div className="hidden md:flex absolute left-0 items-center justify-center w-10 h-10">
                                <div className="w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-50 border-2 border-white z-10"></div>
                              </div>

                              {/* Content Card */}
                              <div className="flex-1 md:ml-12 bg-gray-50/50 rounded-xl border border-gray-100 p-5 hover:border-emerald-200 transition-colors">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                                  <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase">Stage {index + 1}: {item.stage}</span>
                                    <div className="flex items-center gap-1.5 text-gray-500 font-medium text-sm">
                                      <ClockIcon className="w-4 h-4"/>
                                      {item.timing}
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                      <InboxStackIcon className="w-3.5 h-3.5"/>
                                      Dosages
                                    </h4>
                                    <div className="space-y-2">
                                      {Object.entries(item.dosages).map(([fName, fAmount]) => (
                                        <div key={fName} className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-gray-100 shadow-sm">
                                          <span className="text-sm font-medium text-gray-600 capitalize">{fName.replace('_', ' ')}</span>
                                          <span className="text-sm font-bold text-gray-900">{fAmount}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                      <ListBulletIcon className="w-3.5 h-3.5"/>
                                      Application Method
                                    </h4>
                                    <p className="text-sm text-gray-600 leading-relaxed bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                      {item.method}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button 
                          type="button"
                          onClick={() => setFertilizerPlan(null)}
                          className="text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors"
                        >
                          Clear and Re-calculate
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="min-h-[200px] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center">
                      <div className="p-4 bg-emerald-50 text-emerald-400 rounded-full mb-4">
                        <BeakerIconOutline className="w-10 h-10"/>
                      </div>
                      <h3 className="text-gray-900 font-semibold text-lg">Personalized Fertilizer Plan</h3>
                      <p className="text-gray-500 max-w-sm mt-2">
                        Get precise nutrient recommendations based on your crop, field area, and current soil composition.
                      </p>
                      {!loadingFertilizerPlan && (
                        <button 
                          type="button"
                          onClick={handleCalculateFertilizerPlan}
                          className="mt-6 px-8 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all transform active:scale-95"
                        >
                          Generate Plan Now
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-8 border-t border-gray-100 mt-8">
              <button
                type="button"
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2
                  ${currentStep === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                Previous Stage
              </button>
              
              <div className="flex gap-4">
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => Math.min(3, prev + 1))}
                    disabled={currentStep === 1 && !formData.size_Square_Meter}
                    className={`px-8 py-2.5 rounded-xl text-white font-bold shadow-lg transition-all transform active:scale-95 flex items-center gap-2
                      ${(currentStep === 1 && !formData.size_Square_Meter) ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-green-600 hover:bg-green-700 shadow-green-100'}`}
                  >
                    Next Step: {currentStep === 1 ? "Soil & Crop" : "Farm Planning"}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(1);
                      setFertilizerPlan(null);
                      setSeedPlan(null);
                    }}
                    className="px-6 py-2 text-red-600 font-semibold hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                  >
                    Reset All Stages
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Soil Composition Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-6 text-gray-800">
                <BeakerIcon className="w-5 h-5 text-purple-600"/>
                <h2 className="font-semibold text-lg">Soil Composition</h2>
              </div>

              <div className="space-y-5 flex-1">
                {[
                  { label: "Nitrogen (N)", name: "N", color: "bg-blue-100 text-blue-700" },
                  { label: "Phosphorus (P)", name: "P", color: "bg-orange-100 text-orange-700" },
                  { label: "Potassium (K)", name: "K", color: "bg-purple-100 text-purple-700" },
                  { label: "pH Level", name: "pH", color: "bg-teal-100 text-teal-700", max: 14 },
                  { label: "Temperature (°C)", name: "temperature", color: "bg-red-100 text-red-700" },
                  { label: "Humidity (%)", name: "humidity", color: "bg-cyan-100 text-cyan-700" },
                  { label: "Rainfall (mm)", name: "rainfall", color: "bg-indigo-100 text-indigo-700" }
                ].map((item) => (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <label className="font-medium text-gray-600">{item.label}</label>
                      <span className="text-gray-400 text-xs">{item.name === 'pH' ? '' : item.name === 'temperature' ? '°C' : item.name === 'humidity' ? '%' : item.name === 'rainfall' ? 'mm' : 'mg/kg'}</span>
                    </div>
                    <div className="relative">
                      <input 
                        type="number" 
                        name={item.name}
                        value={formData[item.name] || ""} 
                        onChange={handleChange} 
                        required 
                        step="0.01"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-semibold text-gray-900"
                        placeholder="0.0"
                      />
                      <div className={`absolute right-2 top-2 bottom-2 w-1.5 rounded-full ${item.color.split(' ')[0]}`}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommendations Section */}
              {recommendations && (
                <div className="mt-6 mb-2 p-4 bg-green-50 rounded-lg border border-green-100">
                  <h3 className="text-sm font-bold text-green-800 mb-3 border-b border-green-200 pb-2">Recommended Crops</h3>
                  <div className="space-y-3">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 flex items-center justify-center bg-green-200 text-green-800 text-xs font-bold rounded-full">{index + 1}</span>
                          <span className="font-medium text-gray-800 capitalize">{rec.crop}</span>
                        </div>
                        <span className="text-sm font-bold text-green-600">{rec.confidence_percent.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                <button 
                  type="button"
                  onClick={handleGetRecommendation}
                  disabled={loadingRecommendation}
                  className={`w-full py-2.5 px-4 rounded-xl text-white font-semibold shadow-md shadow-purple-200 transition-all transform active:scale-95 flex justify-center items-center gap-2
                    ${loadingRecommendation ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-purple-600 hover:bg-purple-700'}`}
                >
                  {loadingRecommendation ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <span className="text-sm">Get Crop Recommendation</span>
                    </>
                  )}
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full py-3.5 px-4 rounded-xl text-white font-semibold shadow-xl shadow-green-200 transition-all transform active:scale-95 flex justify-center items-center gap-2
                    ${loading ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span>Save Field Data</span>
                      <svg className="w-5 h-5 text-green-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
