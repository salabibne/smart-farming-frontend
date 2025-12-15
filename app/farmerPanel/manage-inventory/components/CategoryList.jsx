"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/axios";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "ACTIVE",
  });
  const [editingId, setEditingId] = useState(null);

  // keep baseURL (as requested)
  const baseURL = api.defaults.baseURL;

  // ================= FETCH CATEGORIES =================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(
          `${baseURL}/inventory-category/get-all`
        );

        setCategories(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [baseURL]);

  // ================= CREATE CATEGORY =================
  const handleCreateCategory = async () => {
    try {
      const response = await api.post(
        `${baseURL}/inventory-category/create`,
        formData
      );

      if (response.status === 201) {
        const res = await api.get(
          `${baseURL}/inventory-category/get-all`
        );
        setCategories(res.data.data);

        setFormData({ name: "", description: "", status: "ACTIVE" });
        setIsModalOpen(false);
        alert("Category Created");
      }
    } catch (error) {
      console.error("Failed to create category", error);
      alert("Failed to create category");
    }
  };

  // ================= UPDATE CATEGORY =================
  const handleUpdateCategory = async (id) => {
    console.log("id",id)
    try {
      const response = await api.patch(
        `${baseURL}/inventory-category/update/${id}`,
        formData
      );
      console.log(response);

      if (response.status === 200) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editingId ? { ...cat, ...formData } : cat
          )
        );

        setEditingId(null);
        setFormData({ name: "", description: "", status: "ACTIVE" });
        setIsModalOpen(false);
        alert("Category Updated");
      }
    } catch (error) {
      console.error("Failed to update category", error);
      alert("Failed to update category");
    }
  };

  // ================= DELETE CATEGORY =================
  const handleRemove = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.delete(
        `${baseURL}/inventory-category/delete/${id}`
      );
      console.log(response)
      if(response.data.status ===400){
        setError(response.data.message)
        return
      }
      if (response.status === 200) {
        setCategories((prev) =>
          prev.filter((cat) => cat.id !== id)
        );
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  // ================= FORM SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      handleUpdateCategory(editingId);
    } else {
      handleCreateCategory();
    }
  };

  // ================= UI HELPERS =================
  const handleCreateClick = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", status: "ACTIVE" });
    setIsModalOpen(true);
  };

  const handleEditClick = (cat) => {
    console.log(cat)
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      description: cat.description,
      status: cat.status,
    });
    setIsModalOpen(true);
  };

  // ================= UI =================
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Categories</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={handleCreateClick}
        >
          + Add Category
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="bg-base-200">
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="font-bold">{cat.name}</td>
                <td>{cat.description}</td>
                <td>
                  <span
                    className={`badge ${
                      cat.status === "ACTIVE"
                        ? "badge-success text-white"
                        : "badge-ghost"
                    }`}
                  >
                    {cat.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() =>  handleEditClick(cat)}
                    className="btn btn-ghost btn-xs text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemove(cat.id)}
                    className="btn btn-ghost btn-xs text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {editingId ? "Edit Category" : "Add New Category"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="label">Name</label>
                <input
                  className="input input-bordered w-full"
                  value={formData.name}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="mb-4">
                <label className="label">Description</label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-4">
                <label className="label">Status</label>
                <select
                  className="select select-bordered w-full"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
