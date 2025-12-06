import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";

const AddServiceForm = () => {
  const expert = JSON.parse(sessionStorage.getItem("active-expert"));
  const expert_jwtToken = sessionStorage.getItem("expert-jwtToken");

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  let navigate = useNavigate();

  useEffect(() => {
    const getAllCategories = async () => {
      const res = await retrieveAllCategories();
      if (res) {
        setCategories(res.categories);
      }
    };

    getAllCategories();
  }, []);

  const retrieveAllCategories = async () => {
    const response = await axios.get(
      `${API_BASE_URL}/category/fetch/all`
    );
    return response.data;
  };

  const [selectedImage1, setSelectImage1] = useState(null);
  const [selectedImage2, setSelectImage2] = useState(null);
  const [selectedImage3, setSelectImage3] = useState(null);

  const [service, setService] = useState({
    name: "",
    description: "",
    category: "",
    subCategoryId: 0,
    techExpertId: expert.id,
    minPrice: "",
    deliveryTime: "",
  });

  const handleInput = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!service.name) {
      isValid = false;
      formErrors["name"] = "Service name is required.";
    }
    if (!service.description) {
      isValid = false;
      formErrors["description"] = "Service description is required.";
    }
    if (!service.category) {
      isValid = false;
      formErrors["category"] = "Category is required.";
    }
    if (service.category === "Photo Shoot" && !service.subCategoryId) {
      isValid = false;
      formErrors["subCategoryId"] = "Subcategory is required for Photo Shoot.";
    }
    if (!service.deliveryTime) {
      isValid = false;
      formErrors["deliveryTime"] = "Delivery time is required.";
    }
    if (!service.minPrice) {
      isValid = false;
      formErrors["minPrice"] = "Minimum price is required.";
    }
    if (!selectedImage1) {
      isValid = false;
      formErrors["image1"] = "Please select the first image.";
    }
    if (!selectedImage2) {
      isValid = false;
      formErrors["image2"] = "Please select the second image.";
    }
    if (!selectedImage3) {
      isValid = false;
      formErrors["image3"] = "Please select the third image.";
    }

    setErrors(formErrors);
    return isValid;
  };

  const saveService = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", service.name);
    formData.append("description", service.description);
    formData.append("category", service.category);
    formData.append("subCategoryId", service.subCategoryId);
    formData.append("techExpertId", service.techExpertId);
    formData.append("minPrice", service.minPrice);
    formData.append("deliveryTime", service.deliveryTime);
    formData.append("image1", selectedImage1);
    formData.append("image2", selectedImage2);
    formData.append("image3", selectedImage3);

    axios
      .post(`${API_BASE_URL}/service/add`, formData, {
        headers: {
          Authorization: "Bearer " + expert_jwtToken, // Use the expert JWT token
        },
      })
      .then((resp) => {
        let response = resp.data;

        if (response.success) {
          toast.success(response.responseMessage, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          setTimeout(() => {
            navigate("/home");
          }, 2000); // Redirect after 2 seconds
        } else {
          toast.error(response.responseMessage, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("An error occurred. Please try again.", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  return (
    <div>
      <div className="mt-5 d-flex aligns-items-center justify-content-center mb-4 ms-3 me-3">
        <div className="card form-card shadow-lg p-4">
          <div className="container-fluid">
            <div
              className="card-header bg-color custom-bg-text mt-2 text-center"
              style={{
                borderRadius: "1em",
                height: "55px",
              }}
            >
              <h5 className="card-title">
                Enter details about your package services here
              </h5>
            </div>
            <div className="card-body text-color">
              <form className="row g-3" onSubmit={saveService}>
                <div className="col-md-3 mb-3">
                  <label htmlFor="name" className="form-label">
                    <b>Service package Name</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    onChange={handleInput}
                    value={service.name}
                  />
                  {errors.name && (
                    <small className="text-danger">{errors.name}</small>
                  )}
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="description" className="form-label">
                    <b>Service package Description</b>
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="2"
                    placeholder="Enter description about your service."
                    onChange={handleInput}
                    value={service.description}
                  />
                  {errors.description && (
                    <small className="text-danger">{errors.description}</small>
                  )}
                </div>

                <div className="col-md-3 mb-3">
                  <label htmlFor="category" className="form-label">
                    <b>Category</b>
                  </label>
                  <select
                    name="category"
                    onChange={handleInput}
                    className="form-control"
                    style={{ cursor: "pointer" }}
                  >
                    <option value="">Select Category</option>
                    <option value="Photo Shoot">Photo Shoot</option>
                    <option value="Service">Photo / Video Editing</option>
                  </select>
                  {errors.category && (
                    <small className="text-danger">{errors.category}</small>
                  )}
                </div>

                {service.category === "Photo Shoot" && (
                  <div className="col-md-3 mb-3">
                    <label htmlFor="subCategoryId" className="form-label">
                      <b>Photo Shoot Category</b>
                    </label>
                    <select
                      name="subCategoryId"
                      onChange={handleInput}
                      className="form-control"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => {
                        return (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        );
                      })}
                    </select>
                    {errors.subCategoryId && (
                      <small className="text-danger">
                        {errors.subCategoryId}
                      </small>
                    )}
                  </div>
                )}

                <div className="col-md-3 mb-3">
                  <label htmlFor="deliveryTime" className="form-label">
                    <b>Work Time (Days)</b>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="deliveryTime"
                    name="deliveryTime"
                    onChange={handleInput}
                    value={service.deliveryTime}
                  />
                  {errors.deliveryTime && (
                    <small className="text-danger">
                      {errors.deliveryTime}
                    </small>
                  )}
                </div>

                <div className="col-md-3 mb-3">
                  <label htmlFor="minPrice" className="form-label">
                    <b>Minimum Package Price</b>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="minPrice"
                    name="minPrice"
                    onChange={handleInput}
                    value={service.minPrice}
                  />
                  {errors.minPrice && (
                    <small className="text-danger">{errors.minPrice}</small>
                  )}
                </div>

                <div className="col-md-3 mb-3">
                  <label htmlFor="formFile1" className="form-label">
                    <b>Select Image 1</b>
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    id="formFile1"
                    name="image1"
                    onChange={(e) => setSelectImage1(e.target.files[0])}
                    required
                  />
                  {errors.image1 && (
                    <small className="text-danger">{errors.image1}</small>
                  )}
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="formFile2" className="form-label">
                    <b>Select Image 2</b>
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    id="formFile2"
                    name="image2"
                    onChange={(e) => setSelectImage2(e.target.files[0])}
                    required
                  />
                  {errors.image2 && (
                    <small className="text-danger">{errors.image2}</small>
                  )}
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="formFile3" className="form-label">
                    <b>Select Image 3</b>
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    id="formFile3"
                    name="image3"
                    onChange={(e) => setSelectImage3(e.target.files[0])}
                    required
                  />
                  {errors.image3 && (
                    <small className="text-danger">{errors.image3}</small>
                  )}
                </div>

                <div className="d-flex align-items-center justify-content-center mb-2">
                  <button
                    type="submit"
                    className="btn bg-color custom-bg-text"
                    onClick={saveService}
                  >
                    Add Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddServiceForm;
