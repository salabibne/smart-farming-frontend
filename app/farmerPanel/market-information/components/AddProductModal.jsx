"use client";

import { useState } from "react";
import { marketService } from "../service";

export default function AddProductModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name.trim()) {
      alert("Please enter a product name");
      setLoading(false);
      return;
    }

    try {
      await marketService.addProduct(formData);
      alert("Product added successfully!");
      setFormData({ name: "", description: "" }); // Reset form
      onSuccess();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Add New Product</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-control w-full mb-4">
            <label className="label"><span className="label-text">Product Name</span></label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className="input input-bordered w-full" 
              placeholder="e.g. Rice" 
              required 
            />
          </div>

          <div className="form-control w-full mb-4">
            <label className="label"><span className="label-text">Description (Optional)</span></label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              className="textarea textarea-bordered h-24" 
              placeholder="Product details..."
            ></textarea>
          </div>

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button 
              type="submit" 
              className="btn btn-primary text-white"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
