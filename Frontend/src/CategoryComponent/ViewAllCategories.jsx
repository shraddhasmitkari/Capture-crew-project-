import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config/apiConfig";
import { motion } from "framer-motion";

const ViewAllCategories = () => {
  const [allCategories, setAllCategories] = useState([]);
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");
  let navigate = useNavigate();

  useEffect(() => {
    const getAllCategory = async () => {
      const allCategories = await retrieveAllCategory();
      if (allCategories) {
        setAllCategories(allCategories.categories);
      }
    };

    getAllCategory();
  }, []);

  const retrieveAllCategory = async () => {
    const response = await axios.get(`${API_BASE_URL}/category/fetch/all`);
    console.log(response.data);
    return response.data;
  };

  const deleteCategory = (categoryId, e) => {
    fetch(`${API_BASE_URL}/category/delete?categoryId=` + categoryId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + admin_jwtToken,
      },
    })
      .then((result) => {
        result.json().then((res) => {
          if (res.success) {
            toast.success(res.responseMessage, {
              position: "top-right",autoClose: 3000,  hideProgressBar: false,  closeOnClick: true,  pauseOnHover: true,
              draggable: true,  progress: undefined,
            });

            setTimeout(() => {
              window.location.reload(true);
            }, 1000); // Redirect after 1 second
          } else {
            toast.error(res.responseMessage, {
              position: "top-right",autoClose: 3000,  hideProgressBar: false,  closeOnClick: true,  pauseOnHover: true,
              draggable: true,  progress: undefined,
            });
            setTimeout(() => {
              window.location.reload(true);
            }, 1000); // Redirect after 1 second
          }
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("It seems server is down", {
          position: "top-right",autoClose: 3000,  hideProgressBar: false,  closeOnClick: true,  pauseOnHover: true,
          draggable: true,  progress: undefined,
        });
        setTimeout(() => {
          window.location.reload(true);
        }, 1000); // Redirect after 1 second
      });
  };

  const updateCategory = (category) => {
    navigate("/admin/category/update", { state: category });
  };

  return (
    <div className="container mt-4">
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header text-center bg-color custom-bg-text rounded-top">
          <h2 className="mb-0">All Categories</h2>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover text-color text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                  <th scope="col">Category Id</th>
                  <th scope="col">Category Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {allCategories.map((category) => (
                  <motion.tr  whileHover={{ scale: 1.02 }}  transition={{ type: "spring", stiffness: 300 }}  key={category.id}
                  >
                    <td>
                      <b>{category.id}</b>
                    </td>
                    <td>
                      <b>{category.name}</b>
                    </td>
                    <td>
                      <b>{category.description}</b>
                    </td>
                    <td>
                      <motion.button whileHover={{ scale: 1.05 }} className="btn btn-sm bg-color custom-bg-text ms-2" onClick={() => updateCategory(category)} >
                        Update
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.05 }} className="btn btn-sm bg-color custom-bg-text ms-2" onClick={() => deleteCategory(category.id)}>
                        Delete
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllCategories;
