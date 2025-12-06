import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";
import { API_BASE_URL } from "../config/apiConfig";

const ViewExpertServiceRequests = () => {
  const expert = JSON.parse(sessionStorage.getItem("active-expert"));

  const [showModalAddResponse, setShowModalAddResponse] = useState(false);

  const handleCloseAddResponse = () => {
    setShowModalAddResponse(false);
    setErrors({});
  };
  const handleShowAddResponse = () => setShowModalAddResponse(true);

  const [showModalViewResponse, setShowModalViewResponse] = useState(false);

  const handleCloseViewResponse = () => setShowModalViewResponse(false);
  const handleShowViewResponse = () => setShowModalViewResponse(true);

  const [serviceRequestId, setServiceRequestId] = useState(0);
  const [serviceNegotiations, setServiceNegotiations] = useState([]);
  const [addResponse, setAddResponse] = useState({
    userId: expert.id,
    serviceRequestId: 0,
    plan: "",
    price: "",
    estimatedTime: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let validationErrors = {};

    if (!addResponse.plan.trim()) {
      validationErrors.plan = "Plan is required.";
    }
    if (!addResponse.price || isNaN(addResponse.price) || addResponse.price <= 0) {
      validationErrors.price = "Please enter a valid price (greater than 0).";
    }
    if (!addResponse.estimatedTime || isNaN(addResponse.estimatedTime) || addResponse.estimatedTime < 1) {
      validationErrors.estimatedTime = "Please enter a valid estimated time (at least 1 day).";
    }

    setErrors(validationErrors);
   
  };

  const handleInput = (e) => {
    setAddResponse({ ...addResponse, [e.target.name]: e.target.value });
  };

  const expertAddResponse = (requestId) => {
    setServiceRequestId(requestId);
    handleShowAddResponse();
  };

  const viewResponse = (serviceNegotiations) => {
    setServiceNegotiations(serviceNegotiations);
    handleShowViewResponse();
  };

  const [serviceRequests, setServiceRequests] = useState([
    {
      service: {
        name: "",
        image1: "",
        category: "",
        subCategory: {
          name: "",
        },
        techExpert: {
          shopName: "",
          firstName: "",
          lastName: "",
          phoneNo: "",
        },
      },
      customer: {
        firstName: "",
        lastName: "",
        phoneNo: "",
      },
    },
  ]);

  useEffect(() => {
    const getAllServiceRequests = async () => {
      const allServiceRequests = await retrieveAllServiceRequests();
      if (allServiceRequests) {
        setServiceRequests(allServiceRequests.serviceRequests);
      }
    };

    getAllServiceRequests();
  }, []);

  const retrieveAllServiceRequests = async () => {
    const response = await axios.get(
      `${API_BASE_URL}/service/request/fetch/tech-expert-wise?techExpertId=` +
      expert.id
    );
    return response.data;
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    const formattedDate = date.toLocaleString(); // Adjust the format as needed

    return formattedDate;
  };

  const downloadRequirement = async (request) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/service/request/requirement/${request.requirement_filename}/download`,
        {
          responseType: "blob", // Important to handle binary data
        }
      );

      // Create a Blob from the response data
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      // Create a download link and trigger the download
      const link = document.createElement("a");

      link.href = window.URL.createObjectURL(blob);
      link.download = request.requirement_filename;
      link.click();
      console.log(link);
      link.remove();
    } catch (error) {
      console.error("Error downloading requirement:", error);
      // Handle error as needed
    }
  };

  const addExpertResponseForRequest = (e) => {
    e.preventDefault();

    // if (!validate()) {
    //   return;
    // }

    addResponse.serviceRequestId = serviceRequestId;

    fetch(`${API_BASE_URL}/service/request/negotiation/add`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        //   Authorization: "Bearer " + expert_jwtToken,
      },
      body: JSON.stringify(addResponse),
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
          }
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("It seems the server is down", {
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

  const cancelServiceRequest = (serviceRequestId) => {
    fetch(
      `${API_BASE_URL}/service/request/close?serviceRequestId=` +
      serviceRequestId,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          //   Authorization: "Bearer " + expert_jwtToken,
        },
      }
    )
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
          }
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("It seems the server is down", {
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
          <div className="table-responsive">
            <table className="table table-hover text-color text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                <th scope="col">Image</th>
                  <th scope="col">Service Package Name</th>
                  <th scope="col">Customer Name</th>
                  <th scope="col">Customer Contact</th>
                  <th scope="col">Requirement</th>
                  <th scope="col">Requirement File</th>
                  <th scope="col">Status</th>
                  <th scope="col">Expert Response</th>
                </tr>
              </thead>
              <tbody>
                {serviceRequests.map((request) => {
                  return (
                    <tr key={request.id}>
                      <td>
                        <img
                          src={
                            `${API_BASE_URL}/service/` +
                            request.service.image1
                          }
                          className="img-fluid"
                          alt="service_pic"
                          style={{
                            maxWidth: "12rem",
                            borderRadius: "1em",
                          }}
                        />
                      </td>
                      <td>{request.service.name}</td>
                      <td>
                        {request.customer.firstName} {request.customer.lastName}
                      </td>
                      <td>{request.customer.phoneNo}</td>
                      <td>
                        <b>{request.requirement_description}</b>
                      </td>
                      <td>
                        <input
                          type="submit"
                          className="btn btn-sm bg-color custom-bg-text mb-5"
                          value="Download"
                          onClick={() => downloadRequirement(request)}
                        />
                      </td>
                      <td>{request.status}</td>
                      <td>
                      <button
                          onClick={() => expertAddResponse(request.id)}
                          className="btn btn-sm bg-color custom-bg-text ms-2"
                        >
                          Add Response
                        </button>

                        <button
                          onClick={() =>
                            viewResponse(request.serviceNegotiations)
                          }
                          className="btn btn-sm bg-color custom-bg-text ms-2 mt-2"
                        >
                          View Response
                        </button>

                        {(() => {
                          if (request.status === "Pending") {
                            return (
                              <button
                                onClick={() => cancelServiceRequest(request.id)}
                                className="btn btn-sm bg-color custom-bg-text ms-2 mt-2"
                              >
                                Close
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

      {/* Add Response Modal */}
      <Modal show={showModalAddResponse} onHide={handleCloseAddResponse}>
        <Modal.Header closeButton>
          <Modal.Title>Add Response</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={addExpertResponseForRequest}>
            <div className="mb-3">
              <label htmlFor="plan" className="form-label">
                Plan
              </label>
              <textarea
                id="plan"
                name="plan"
                value={addResponse.plan}
                onChange={handleInput}
                className={`form-control ${errors.plan ? 'is-invalid' : ''}`}
                rows="3"
              ></textarea>
              {errors.plan && <div className="invalid-feedback">{errors.plan}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">
                Price (in USD)
              </label>
              <input
                type="text"
                id="price"
                name="price"
                value={addResponse.price}
                onChange={handleInput}
                className={`form-control ${errors.price ? 'is-invalid' : ''}`}
              />
              {errors.price && <div className="invalid-feedback">{errors.price}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="estimatedTime" className="form-label">
                Estimated Time (in days)
              </label>
              <input
                type="text"
                id="estimatedTime"
                name="estimatedTime"
                value={addResponse.estimatedTime}
                onChange={handleInput}
                className={`form-control ${errors.estimatedTime ? 'is-invalid' : ''}`}
              />
              {errors.estimatedTime && <div className="invalid-feedback">{errors.estimatedTime}</div>}
            </div>
            <div className="text-center">
              <button type="submit" className="btn custom-bg custom-bg-text">
                Add Response
              </button>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddResponse}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Response Modal */}
      <Modal show={showModalViewResponse} onHide={handleCloseViewResponse}>
        <Modal.Header closeButton>
          <Modal.Title>Expert Responses</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className="list-group list-group-flush">
            {serviceNegotiations.map((negotiation, index) => (
              <li className="list-group-item" key={index}>
                <p><strong>Plan:</strong> {negotiation.plan}</p>
                <p><strong>Price:</strong> {negotiation.price}</p>
                <p><strong>Estimated Time:</strong> {negotiation.estimatedTime} days</p>
                <p><strong>Message:</strong> {negotiation.message} </p>
                <p><strong>Status:</strong> {negotiation.status} </p>
                <hr />
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseViewResponse}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default ViewExpertServiceRequests;
