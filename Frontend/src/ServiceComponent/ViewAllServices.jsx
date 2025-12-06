import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config/apiConfig";

const ViewAllServices = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const getAllServices = async () => {
      const allServices = await retrieveAllServices();
      if (allServices) {
        setServices(allServices.services);
      }
    };

    getAllServices();
  }, []);

  const retrieveAllServices = async () => {
    const response = await axios.get(
      `${API_BASE_URL}/service/fetch/all`
    );
    return response.data;
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    const formattedDate = date.toLocaleString(); // Adjust the format as needed

    return formattedDate;
  };

  const deleteExpertService = (serviceId, e) => {
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
            }, 1000); // Redirect after 3 seconds
          } else if (!res.success) {
            toast.error(res.responseMessage, {
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
            }, 1000); // Redirect after 3 seconds
          }
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("It seems server is down", {
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
        }, 1000); // Redirect after 3 seconds
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
          <h2>My Package Services</h2>
        </div>
        <div
          className="card-body"
          style={{
            overflowY: "auto",
          }}
        >
          <div className="table-responsive">
            <table className="table table-hover text-color text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                  <th scope="col">Image</th>
                  <th scope="col">Service Package Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Shop Name</th>
                  <th scope="col">Tech Expert</th>
                  <th scope="col">Category</th>
                  <th scope="col">Sub-Category</th>
                  <th scope="col">work Time</th>
                  <th scope="col">Min. Price</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => {
                  return (
                    <tr>
                      <td>
                        <img
                          src={
                            `${API_BASE_URL}/service/` +
                            service.image1
                          }
                          class="img-fluid"
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
                        <b>{service.techExpert.shopName}</b>
                      </td>
                      <td>
                        <b>
                          {service.techExpert.firstName +
                            " " +
                            service.techExpert.lastName}
                        </b>
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
                        {(() => {
                          if (service.status === "Active") {
                            return (
                              <button
                                onClick={() => deleteExpertService(service.id)}
                                className="btn btn-sm bg-color custom-bg-text ms-2"
                              >
                                Delete
                              </button>
                            );
                          }
                        })()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllServices;
