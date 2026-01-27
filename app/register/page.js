"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  MapPinIcon,
  ArrowRightIcon,
  HomeIcon,
  BuildingOfficeIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import api from '../lib/axios';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: {
      district: '',
      sub_district: '',
      thana: ''
    }
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/register', formData);
      console.log("Registration success:", response.data);
      alert("Registration successful! Please login.");
      window.location.href = '/login';
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4 md:p-8">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-6xl w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-10">
            {/* Sidebar Info (60%) */}
            <div className="lg:col-span-6 min-h-[400px] relative group overflow-hidden">
               {/* Background Image */}
               <img 
                 src="/HomeImages/empoweringbangladesh_agriculture.jpg" 
                 alt="Empowering Bangladesh Agriculture"
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
               {/* Overlay */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-green-600/30"></div>
               
               <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-between text-white">
                 <div>
                   <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl mb-8 border border-white/30">
                     <UserIcon className="w-7 h-7" />
                   </div>
                   <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight drop-shadow-lg">
                     Empowering <br/>
                     <span className="text-green-400">Bangladesh</span> <br/>
                     Agriculture
                   </h2>
                   <p className="mt-6 text-xl text-gray-100/90 font-medium max-w-md leading-relaxed">
                     Start optimizing your farm yields with precision analytics and real-time management tools.
                   </p>
                 </div>
                 
                 <div className="mt-12 space-y-6">
                   <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                     <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                     </div>
                     <span className="text-sm font-bold tracking-widest uppercase">Precision Tracking</span>
                   </div>
                   <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                     <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                     </div>
                     <span className="text-sm font-bold tracking-widest uppercase">Inventory Control</span>
                   </div>
                   <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                     <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                     </div>
                     <span className="text-sm font-bold tracking-widest uppercase">Market Analytics</span>
                   </div>
                 </div>

                 <div className="mt-12 pt-8 border-t border-white/20">
                   <p className="text-xs font-black text-green-300 uppercase tracking-[0.2em]">Smart Farming Platform</p>
                 </div>
               </div>
            </div>

            {/* Form Section (40%) */}
            <div className="lg:col-span-4 p-8 md:p-12 bg-white/50">
              <div className="mb-10 text-center lg:text-left">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create Account</h1>
                <p className="text-gray-500 mt-2 font-medium">Fill in the fields to get started</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Full Name"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-medium text-gray-900"
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
                      <EnvelopeIcon className="w-5 h-5" />
                    </div>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Email Address"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-medium text-gray-900"
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
                      <LockClosedIcon className="w-5 h-5" />
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Password"
                      className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-medium text-gray-900"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Address Section */}
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-3 ml-1 text-gray-700 font-bold text-sm">
                    <MapPinIcon className="w-4 h-4 text-green-600" />
                    Address Information
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
                        <HomeIcon className="w-4 h-4" />
                      </div>
                      <input 
                        type="text" 
                        name="address.district"
                        value={formData.address.district}
                        onChange={handleChange}
                        required
                        placeholder="District"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-medium text-gray-900 text-sm"
                      />
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
                        <BuildingOfficeIcon className="w-4 h-4" />
                      </div>
                      <input 
                        type="text" 
                        name="address.sub_district"
                        value={formData.address.sub_district}
                        onChange={handleChange}
                        required
                        placeholder="Sub-District"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-medium text-gray-900 text-sm"
                      />
                    </div>
                    <div className="relative group sm:col-span-2">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
                        <MapPinIcon className="w-4 h-4" />
                      </div>
                      <input 
                        type="text" 
                        name="address.thana"
                        value={formData.address.thana}
                        onChange={handleChange}
                        required
                        placeholder="Thana (e.g. Gulshan-1)"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-medium text-gray-900 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-black shadow-lg shadow-green-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-md"></span>
                    ) : (
                      <>
                        Sign Up Now
                        <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-gray-500 font-medium text-sm">
                    Already have an account? {' '}
                    <Link href="/login" className="text-green-600 font-bold hover:underline">
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
