import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import { API_BASE_URL } from "../config/apiConfig";
import '../css/ServiceRequest.css'; // Import the CSS file

const ViewAllServiceRequests = () => {
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
      `${API_BASE_URL}/service/request/fetch/all`
    );
    return response.data;
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

  return (
    <div className="mt-3">
      <div className="card form-card ms-2 me-2 mb-5 shadow-lg">
        <div className="card-header custom-bg-text text-center bg-color">
          <h2>My Services</h2>
        </div>
        <div className="card-body">
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
                {serviceRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <img
                        src={
                          `${API_BASE_URL}/service/` + request.service.image1
                        }
                        className="img-fluid"
                        alt="service_pic"
                        style={{ maxWidth: "90px" }}
                      />
                    </td>
                    <td><b>{request.service.name}</b></td>
                    <td><b>{request.customer.firstName + " " + request.customer.lastName}</b></td>
                    <td><b>{request.customer.phoneNo}</b></td>
                    <td><b>{request.requirement_description}</b></td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => downloadRequirement(request)}
                       
                      >
                        Download
                      </Button>
                    </td>
                    <td><b>{request.status}</b></td>
                    <td>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => viewResponse(request.serviceNegotiations)}
                      >
                        View Response
                      </Button>
                    </td>
                  </tr>
                ))}
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
          <Modal.Title>View Service Response</Modal.Title>
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
                    <th scope="col">Customer Message</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceNegotiations.map((negotiation) => (
                    <tr key={negotiation.id}>
                      <td><b>{negotiation.plan}</b></td>
                      <td><b>{negotiation.estimatedTime}</b></td>
                      <td><b>{negotiation.price}</b></td>
                      <td><b>{negotiation.message}</b></td>
                      <td><b>{negotiation.status}</b></td>
                    </tr>
                  ))}
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

export default ViewAllServiceRequests;
