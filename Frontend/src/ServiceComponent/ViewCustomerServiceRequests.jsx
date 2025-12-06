import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";
import { API_BASE_URL } from "../config/apiConfig";

const ViewCustomerServiceRequests = () => {
  const customer_jwtToken = sessionStorage.getItem("customer-jwtToken");
  const customer = JSON.parse(sessionStorage.getItem("active-customer"));

  const [showModalViewResponse, setShowModalViewResponse] = useState(false);

  const handleCloseViewResponse = () => setShowModalViewResponse(false);
  const handleShowViewResponse = () => setShowModalViewResponse(true);

  const [serviceNegotiations, setServiceNegotiations] = useState([]);

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
      `${API_BASE_URL}/service/request/fetch/customer-wise?customerId=` +
        customer.id
    );
    return response.data;
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    const formattedDate = date.toLocaleString(); // Adjust the format as needed

    return formattedDate;
  };

  const [addResponse, setAddResponse] = useState({
    negotiationId: 0,
    status: "",
    customerMessage: "",
  });

  const handleInput = (e) => {
    setAddResponse({ ...addResponse, [e.target.name]: e.target.value });
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
      link.remove();
    } catch (error) {
      console.error("Error downloading requirement:", error);
      // Handle error as needed
    }
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
            // setTimeout(() => {
            //   window.location.reload(true);
            // }, 1000); // Redirect after 3 seconds
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
        // setTimeout(() => {
        //   window.location.reload(true);
        // }, 1000); // Redirect after 3 seconds
      });
  };

  const updateNegotiationMessage = (negotiationId, e) => {
    e.preventDefault();
    addResponse.negotiationId = negotiationId;

    fetch(
      `${API_BASE_URL}/service/request/negotiation/customer/update`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          //   Authorization: "Bearer " + customer_jwtToken,
        },
        body: JSON.stringify(addResponse),
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
            // setTimeout(() => {
            //   window.location.reload(true);
            // }, 1000); // Redirect after 3 seconds
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
        // setTimeout(() => {
        //   window.location.reload(true);
        // }, 1000); // Redirect after 3 seconds
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
                  <th scope="col">Category</th>
                  <th scope="col">Sub-Category</th>
                  <th scope="col">Shop Name</th>
                  <th scope="col">Tech Expert</th>
                  <th scope="col">Requirement</th>
                  <th scope="col">Requirement File</th>
                  <th scope="col">Status</th>
                  <th scope="col">Expert Response</th>
                </tr>
              </thead>
              <tbody>
                {serviceRequests.map((request) => {
                  return (
                    <tr>
                      <td>
                        <img
                          src={
                            `${API_BASE_URL}/service/` +
                            request.service.image1
                          }
                          class="img-fluid"
                          alt="service_pic"
                          style={{
                            maxWidth: "90px",
                          }}
                        />
                      </td>
                      <td>
                        <b>{request.service.name}</b>
                      </td>

                      <td>
                        <b>{request.service.category}</b>
                      </td>
                      <td>
                        <b>
                          {request.service.subCategory
                            ? request.service.subCategory.name
                            : "-"}
                        </b>
                      </td>
                      <td>
                        <b>{request.service.techExpert.shopName}</b>
                      </td>
                      <td>
                        <b>
                          {request.service.techExpert.firstName +
                            " " +
                            request.service.techExpert.lastName}
                        </b>
                      </td>
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
                      <td>
                        <b>{request.status}</b>
                      </td>
                      <td>
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

      <Modal
        show={showModalViewResponse}
        onHide={handleCloseViewResponse}
        size="xl"
      >
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title
            style={{
              borderRadius: "1em",
            }}
          >
            View Service Response
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="ms-3 mt-3 mb-3 me-3">
            <div className="table-responsive">
              <table className="table table-hover text-color text-center">
                <thead className="table-bordered border-color bg-color custom-bg-text">
                  <tr>
                    <th scope="col">Plan</th>
                    <th scope="col">Estimated Time</th>
                    <th scope="col">Price (&#8377;)</th>
                    <th scope="col">Message</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceNegotiations.map((negotiation) => {
                    return (
                      <tr>
                        <td>
                          <b>{negotiation.plan}</b>
                        </td>

                        <td>
                          <b>{negotiation.estimatedTime}</b>
                        </td>
                        <td>
                          <b>{negotiation.price}</b>
                        </td>
                        <td>
                          <b>{negotiation.message}</b>
                        </td>
                        <td>
                          <b>{negotiation.status}</b>
                        </td>
                        <td>
                          {(() => {
                            if (negotiation.status === "Pending") {
                              return (
                                <div>
                                  <form class="row g-3">
                                    <div class="col-auto">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="city"
                                        name="customerMessage"
                                        onChange={handleInput}
                                        value={addResponse.customerMessage}
                                        placeholder="drop message here..."
                                      />
                                    </div>
                                    <div class="col-auto">
                                      <select
                                        name="status"
                                        onChange={handleInput}
                                        className="form-control"
                                        required
                                      >
                                        <option value="">Select Status</option>
                                        <option value="Approved">
                                          Approved
                                        </option>
                                        <option value="Deny">Deny</option>
                                      </select>
                                    </div>

                                    <div class="col-auto">
                                      <button
                                        type="submit"
                                        class="btn bg-color custom-bg-text mb-3"
                                        onClick={(e) =>
                                          updateNegotiationMessage(
                                            negotiation.id,
                                            e
                                          )
                                        }
                                      >
                                        Update
                                      </button>
                                    </div>
                                  </form>
                                </div>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseViewResponse}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewCustomerServiceRequests;
