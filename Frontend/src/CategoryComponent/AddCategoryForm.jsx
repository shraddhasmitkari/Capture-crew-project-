import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";
import { motion } from "framer-motion";
import ".././css/AddCategory.css"

const AddCategoryForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");
  let navigate = useNavigate();

  const saveCategory = async (e) => {
    e.preventDefault();

    let data = { name, description };

    try {
      const response = await fetch(`${API_BASE_URL}/category/add`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();

      if (res.success) {
        toast.success(res.responseMessage, {
          position: "top-right", autoClose: 1000,
      });
        setTimeout(() => navigate("/home"), 2000);
      } else {
        toast.error(res.responseMessage, {
          position: "top-right", autoClose: 1000,
        });
        setTimeout(() => window.location.reload(true), 2000);
      }
    } catch (error) {
      console.error(error);
      toast.error("It seems server is down", {
        position: "top-right",autoClose: 1000,
      });
      setTimeout(() => window.location.reload(true), 1000);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <motion.div className="form-card border-color" style={{ width: "100%", maxWidth: "600px" }}
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
      >
        <div className="container-fluid">
          <div className="card-header bg-color custom-bg-text mt-2 d-flex justify-content-center align-items-center">
            <h5 className="card-title">Add Category</h5>
          </div>
          <div className="card-body text-color mt-3">
            <form onSubmit={saveCategory}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  <b>Category Title</b>
                </label>
                <input type="text" className="form-control" id="title" placeholder="Enter title here"  onChange={(e) => setName(e.target.value)}
                  value={name}  
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  <b>Category Description</b>
                </label>
                <textarea className="form-control" id="description"  rows="3"  placeholder="Enter description.."  onChange={(e) => setDescription(e.target.value)}
                  value={description}  
                />
              </div>

              <div className="d-flex justify-content-center mb-2">
                <button type="submit"  className="btn bg-color custom-bg-text"
                >
                  Add Category
                </button>
              </div>

              <ToastContainer />
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddCategoryForm;
