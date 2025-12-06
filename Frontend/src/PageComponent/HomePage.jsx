import React, { useState, useEffect } from "react";
import axios from "axios";
import Carousel from "./Carousel";

import ServiceCard from "../ServiceComponent/ServiceCard";
import ".././css/HomePage.css";
import { API_BASE_URL } from "../config/apiConfig";

const HomePage = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [tempCategory, setTempCategory] = useState("");
  const [tempSubCategoryId, setTempSubCategoryId] = useState("");
  const [services, setServices] = useState([]);

  useEffect(() => {
    const getAllServices = async () => {
      const allServices = await retrieveAllServices();
      if (allServices) {
        setServices(allServices.services);
      }
    };

    const getSearchedServices = async () => {
      const allServices = await searchServices();
      if (allServices) {
        setServices(allServices.services);
      }
    };

    const getAllCategories = async () => {
      const res = await retrieveAllCategories();
      if (res) {
        setSubCategories(res.categories);
      }
    };

    if (category !== "" || subCategoryId !== "") {
      getSearchedServices();
    } else {
      getAllServices();
    }

    getAllCategories();
  }, [category, subCategoryId]);

  const retrieveAllServices = async () => {
    const response = await axios.get(`${API_BASE_URL}/service/fetch/all`);
    return response.data;
  };

  const retrieveAllCategories = async () => {
    const response = await axios.get(`${API_BASE_URL}/category/fetch/all`);
    return response.data;
  };

  const searchServices = async () => {
    if (category !== "") {
      const response = await axios.get(
        `${API_BASE_URL}/service/fetch/category-wise?category=${category}`
      );
      return response.data;
    } else if (subCategoryId !== "" || subCategoryId !== "0") {
      const response = await axios.get(
        `${API_BASE_URL}/service/fetch/sub-category-wise?subCategoryId=${subCategoryId}`
      );
      return response.data;
    }
  };

  const searchServicesByCategory = (e) => {
    e.preventDefault();
    setCategory(tempCategory);
    setTempCategory("");
    setSubCategoryId("");
  };

  const searchServicesBySubCategory = (e) => {
    e.preventDefault();
    setSubCategoryId(tempSubCategoryId);
    setCategory("");
    setTempCategory("");
    setTempSubCategoryId("");
  };

  return (
    <div className="container-fluid mb-4">
      <Carousel />
      <h5 className="text-color-second text-center mt-5 mb-4 animated-text">
        Select the Services which you want here
      </h5>

      <div className="d-flex aligns-items-center justify-content-center">
        <div className="row g-3 aligns-items-center justify-content-center">
          <div className="col-md-12 col-lg-8 mb-3">
            <form className="row g-3 animated-form">
              <div className="col-auto">
                <select
                  name="tempCategory"
                  onChange={(e) => setTempCategory(e.target.value)}
                  className="form-control"
                  required
                >
                  <option value="">Select type of service Category from here</option>
                  <option value="Photo Shoot">Photo Shoot</option>
                  <option value="Service">Photo / Video Editing</option>
                </select>
              </div>
              <div className="col-auto">
                <button
                  type="submit"
                  className="btn bg-color custom-bg-text mb-3"
                  onClick={searchServicesByCategory}
                >
                  Search
                </button>
              </div>
            </form>
          </div>
          <div className="col-md-12 col-lg-8 mb-3">
            <form className="row g-3 animated-form">
              <div className="col-auto">
                <select
                  name="tempSubCategoryId"
                  onChange={(e) => setTempSubCategoryId(e.target.value)}
                  className="form-control"
                  required
                >
                  <option value="">Select type of Photo Shoot Category Here</option>
                  {subCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-auto">
                <button
                  type="submit"
                  className="btn bg-color custom-bg-text mb-3"
                  onClick={searchServicesBySubCategory}
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-5 mb-5 mx-4">
        {services.map((service) => (
          <ServiceCard item={service} key={service.id} />
        ))}
      </div>

      <hr />
      
    </div>
  );
};

export default HomePage;
