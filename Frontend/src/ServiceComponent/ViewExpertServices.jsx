import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../config/apiConfig";

const ViewExpertServices = () => {
  const expert = JSON.parse(sessionStorage.getItem("active-expert"));

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const getAllServices = async () => {
      try {
        const allServices = await retrieveAllServices();
        if (allServices) {
          setServices(allServices.services);
        } else {
          setError("No services found.");
        }
      } catch (err) {
        setError("Failed to load services. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getAllServices();
  }, []);

  const retrieveAllServices = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/service/fetch/tech-expert-wise?techExpertId=` + expert.id
      );
      return response.data;
    } catch (error) {
      setError("Failed to retrieve services.");
      throw error;
    }
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    const formattedDate = date.toLocaleString(); // Adjust the format as needed
    return formattedDate;
  };

  const deleteExpertService = (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return; // Exit if user cancels the deletion
    }

    fetch(`${API_BASE_URL}/service/delete?serviceId=` + serviceId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        //   Authorization: "Bearer " + expert_jwtToken,
      },
    })
      .then((result) => {
        result.json().then((res) => {
          if (res.success) {
            toast.success(res.responseMessage, {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });

            setTimeout(() => {
              window.location.reload(true);
            }, 1000);
          } else {
            toast.error(res.responseMessage || "Failed to delete service.", {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setTimeout(() => {
              window.location.reload(true);
            }, 1000);
          }
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("Server is down, please try again later.", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          window.location.reload(true);
        }, 1000);
      });
  };

  return (
    <div className="mt-3">
      <div
        className="card form-card ms-2 me-2 mb-5 shadow-lg"
        style={{
          height: "45rem",
        }}
      >
        <div
          className="card-header custom-bg-text text-center bg-color"
          style={{
            borderRadius: "1em",
            height: "50px",
          }}
        >
          <h2>My Services</h2>
        </div>
        <div
          className="card-body"
          style={{
            overflowY: "auto",
          }}
        >
          {loading && <p>Loading services...</p>}
          {error && <p className="text-danger">{error}</p>}
          {!loading && !error && (
            <p>No services available.</p>
          )}
          {!loading && !error > 0 && (
            <div className="table-responsive">
              <table className="table table-hover text-color text-center">
                <thead className="table-bordered border-color bg-color custom-bg-text">
                  <tr>
                    <th scope="col">Image</th>
                    <th scope="col">Service Package Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Category</th>
                    <th scope="col">Sub-Category</th>
                    <th scope="col">Delivery Time</th>
                    <th scope="col">Min. Price</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id}>
                      <td>
                        <img
                          src={`${API_BASE_URL}/service/` + service.image1}
                          className="img-fluid"
                          alt="service_pic"
                          style={{
                            maxWidth: "90px",
                          }}
                        />
                      </td>
                      <td>
                        <b>{service.name}</b>
                      </td>
                      <td>
                        <b>{service.description}</b>
                      </td>
                      <td>
                        <b>{service.category}</b>
                      </td>
                      <td>
                        <b>
                          {service.subCategory ? service.subCategory.name : "-"}
                        </b>
                      </td>
                      <td>
                        <b>{service.deliveryTime}</b>
                      </td>
                      <td>
                        <b>{service.minPrice}</b>
                      </td>
                      <td>
                        <b>{service.status}</b>
                      </td>
                      <td>
                        {service.status === "Active" && (
                          <button
                            onClick={() => deleteExpertService(service.id)}
                            className="btn btn-sm bg-color custom-bg-text ms-2"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewExpertServices;
