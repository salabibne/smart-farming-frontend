"use client";

import { useEffect, useState } from "react";
import StockOperationModal from "./StockOperationModal";
import api from "@/app/lib/axios";

export default function InventoryList() {
  const baseURL = api.defaults.baseURL;

  const [items, setItems] = useState([]);
  const [categoryName, setCategoryName] = useState([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  const [stockModal, setStockModal] = useState({
    isOpen: false,
    type: "IN",
    item: null,
  });

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    minimum_stock_level_alert: 0,
    unit: "KG",
    cost_per_unit: 0,
    supplier_name: "",
    supplier_contact: "",
    status: "ACTIVE", // 
  });

  /* ================= FETCH ITEMS ================= */
  useEffect(() => {
    const fetchItems = async () => {
      const res = await api.get(`${baseURL}/inventory-management`);
      setItems(res.data.data);
    };
    fetchItems();
  }, []);

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await api.get(
        `${baseURL}/inventory-category/get-active-categories`
      );
      setCategoryName(res.data.data);
    };
    fetchCategories();
  }, []);

  /* ================= RESET FORM ================= */
  const resetForm = () => {
    setFormData({
      name: "",
      categoryId: "",
      minimum_stock_level_alert: 0,
      unit: "KG",
      cost_per_unit: 0,
      supplier_name: "",
      supplier_contact: "",
      status: "ACTIVE",
    });
  };

  /* ================= CREATE ================= */
  const handleCreate = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      minimum_stock_level_alert: Number(formData.minimum_stock_level_alert),
      cost_per_unit: Number(formData.cost_per_unit),
      status: "ACTIVE", // force ACTIVE on create
    };

    const res = await api.post(`${baseURL}/inventory-management`, payload);

    setItems([res.data.data, ...items]);
    setIsCreateModalOpen(false);
    resetForm();
    alert("Item created successfully");
  };

  /* ================= EDIT ================= */
  const openEditModal = (item) => {
    setEditingItemId(item.id);
    setFormData({
      name: item.name,
      categoryId: item.categoryId,
      minimum_stock_level_alert: item.minimum_stock_level_alert,
      unit: item.unit,
      cost_per_unit: item.cost_per_unit,
      supplier_name: item.supplier_name || "",
      supplier_contact: item.supplier_contact || "",
      status: item.status, // 
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      minimum_stock_level_alert: Number(formData.minimum_stock_level_alert),
      cost_per_unit: Number(formData.cost_per_unit),
      status: formData.status, // ✅ 
    };

    const res = await api.patch(
      `${baseURL}/inventory-management/update/${editingItemId}`,
      payload
    );

    setItems(
      items.map((item) =>
        item.id === editingItemId ? res.data.data : item
      )
    );

    setIsEditModalOpen(false);
    setEditingItemId(null);
    resetForm();
    alert("Item updated successfully");
  };

  /* ================= STOCK ================= */
  const openStockModal = (item, type) => {
    setStockModal({ isOpen: true, type, item });
  };

  const handleStockSuccess = () => {
    setStockModal({ ...stockModal, isOpen: false });
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Inventory Items</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setIsCreateModalOpen(true)}
        >
          + Add Item
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="bg-base-200">
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Unit</th>
              <th>Cost</th>
              <th>Status</th>
              <th>MSL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="font-bold">{item.name}</td>
                <td>
                  <span className="badge badge-ghost">
                    {item.category?.name}
                  </span>
                </td>
                <td
                  className={`font-bold ${
                    item.transactions?.[0]?.stock <=
                    item.minimum_stock_level_alert
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  {item.transactions?.[0]?.stock ?? 0}
                </td>
                <td>{item.unit}</td>
                <td>৳{item.cost_per_unit}</td>
                <td>
                  <span
                    className={`badge ${
                      item.status === "ACTIVE"
                        ? "badge-success text-white"
                        : "badge-ghost"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td>{item.minimum_stock_level_alert}</td>
                <td>
                  <div className="join">
                    <button
                      className="btn btn-xs btn-success join-item text-white"
                      onClick={() => openStockModal(item, "IN")}
                      disabled={item.status === "INACTIVE"}
                    >
                      + In
                    </button>
                    <button
                      className="btn btn-xs btn-warning join-item text-white"
                      onClick={() => openStockModal(item, "OUT")}
                      disabled={item.status === "INACTIVE"}
                    >
                      - Out
                    </button>
                    <button
                      className="btn btn-xs btn-ghost join-item"
                      onClick={() => openEditModal(item)}
                    >
                      ✎
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <InventoryModal
          title="Create Inventory Item"
          onSubmit={handleCreate}
          onClose={() => setIsCreateModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
          categories={categoryName}
          submitLabel="Create Item"
        />
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <InventoryModal
          title="Edit Inventory Item"
          onSubmit={handleUpdate}
          onClose={() => setIsEditModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
          categories={categoryName}
          submitLabel="Update Item"
        />
      )}

      {/* STOCK MODAL */}
      <StockOperationModal
        isOpen={stockModal.isOpen}
        type={stockModal.type}
        inventoryItem={stockModal.item}
        onClose={() => setStockModal({ ...stockModal, isOpen: false })}
        onSuccess={handleStockSuccess}
      />
    </div>
  );
}

/* ================= MODAL + ORIGINAL FORM UI ================= */

function InventoryModal({
  title,
  onSubmit,
  onClose,
  formData,
  setFormData,
  categories,
  submitLabel,
}) {
  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-3xl">
        <h3 className="font-bold text-lg mb-4">{title}</h3>

        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NAME */}
            <div className="flex flex-col gap-2">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* CATEGORY */}
            <div className="flex flex-col gap-2">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                className="select select-bordered"
                required
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* UNIT */}
            <div className="flex flex-col gap-2">
              <label className="label">
                <span className="label-text">Unit</span>
              </label>
              <select
                className="select select-bordered"
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
              >
                {["KG", "Liters", "Bags", "Pieces", "Tons"].map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            {/* STATUS – EDIT ONLY */}
            {submitLabel === "Update Item" && (
              <div className="flex flex-col gap-2">
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select
                  className="select select-bordered"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            )}

            {/* MSL */}
            <div className="flex flex-col gap-2">
              <label className="label">
                <span className="label-text">Min Stock Alert</span>
              </label>
              <input
                type="number"
                className="input input-bordered"
                value={formData.minimum_stock_level_alert}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minimum_stock_level_alert: e.target.value,
                  })
                }
              />
            </div>

            {/* COST */}
            <div className="flex flex-col gap-2">
              <label className="label">
                <span className="label-text">Cost Per Unit</span>
              </label>
              <input
                type="number"
                className="input input-bordered"
                value={formData.cost_per_unit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cost_per_unit: e.target.value,
                  })
                }
              />
            </div>
           

            {/* SUPPLIER */}
            <div className="flex flex-col gap-2">
              <label className="label">
                <span className="label-text">Supplier Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={formData.supplier_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    supplier_name: e.target.value,
                  })
                }
              />
            </div>

            {/* CONTACT */}
            <div className="flex flex-col gap-2">
              <label className="label">
                <span className="label-text">Supplier Contact</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={formData.supplier_contact}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    supplier_contact: e.target.value,
                  })
                }
              />
            </div>
          </div>
         

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
