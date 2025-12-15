"use client";

import api from "@/app/lib/axios";
import { useState } from "react";

export default function StockOperationModal({ isOpen, onClose, inventoryItem, type, onSuccess }) {
  const [quantity, setQuantity] = useState(0);
  const [purpose, setPurpose] = useState(type === "IN" ? "PURCHASE" : "SALE");
  const [notes, setNotes] = useState("");

  if (!isOpen || !inventoryItem) return null;
const baseUrl = api.defaults.baseURL
  const handleSubmit = async(e) => {
    e.preventDefault();
    // Simulate API Call
    const stokData = {
      inventoryId: inventoryItem.id,
      stockType: type,
      purpose,
      transactionQuantity: parseInt(quantity),
      notes
    };
    if(stokData.stockType === "IN") {
      const res = await api.post(`${baseUrl}/inventory-transaction/stock-in`, stokData);
      console.log(res.data);
      if(res.data.status===201){
        alert("Stock In successfully");
        onSuccess();
        onClose();
      }
      else{
        alert(res.data.message);
      }
    }
    else{
      const res = await api.post(`${baseUrl}/inventory-transaction/stock-out`, stokData);
      console.log("resOut",res);
      try{
 if(res.data.status===201){
        alert(res.data.message)
        onSuccess();
        onClose();

      }
      else if(res.data.status===400){
        alert(res.data.message);
      }
      else{
        alert(res.data.message);
      }
      }
      catch(error){
        console.log(error);
        alert(error.response.data.message);
      }
     
      
    }
  };

  const purposes = type === "IN" 
    ? ["PURCHASE", "RETURN", "ADJUSTMENT", "INITIATE_STOCK"] 
    : ["SALE", "DAMAGE", "ADJUSTMENT", "RETURN"];

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">
          Stock {type === "IN" ? "In" : "Out"}: {inventoryItem.name}
        </h3>
        
        {type === "OUT" && (
           <div className="alert alert-info shadow-sm mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Current Stock: {inventoryItem.stock || 0} {inventoryItem.unit}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-control w-full mb-4">
            <label className="label"><span className="label-text">Quantity</span></label>
            <input
              type="number"
              min="1"
              className="input input-bordered w-full"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="form-control w-full mb-4">
            <label className="label"><span className="label-text">Purpose</span></label>
            <select 
              className="select select-bordered" 
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            >
              {purposes.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="form-control w-full mb-4">
            <label className="label"><span className="label-text">Notes</span></label>
            <textarea
              className="textarea textarea-bordered h-20"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes..."
            ></textarea>
          </div>

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className={`btn ${type === "IN" ? "btn-success" : "btn-warning"} text-white`}>
              Confirm Stock {type === "IN" ? "In" : "Out"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
