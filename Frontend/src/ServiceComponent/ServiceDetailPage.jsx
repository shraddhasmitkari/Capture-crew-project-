import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
// import ServiceCarousel from "./ServiceCarousel";
import { Button, Modal } from "react-bootstrap";
import { API_BASE_URL } from "../config/apiConfig";
import ServiceCarousel from "./ServiceCarousel";

const ServiceDetailPage = () => {
  const { serviceId } = useParams();

  const customer = JSON.parse(sessionStorage.getItem("active-customer"));

  const navigate = useNavigate();

  const [service, setService] = useState({
    id: "",
    name: "",
    description: "",
    category: "",
    subCategory: {
      id: "",
      name: "",
      description: "",
      status: "",
    },
    techExpert: {
      id: "",
      firstName: "",
      lastName: "",
      shopName: "",
      emailId: "",
      phoneNo: "",
      role: "",
      address: {
        id: "",
        street: "",
        city: "",
        pincode: "",
      },
      walletAmount: "",
      status: "",
    },
    addedTime: "",
    minPrice: "",
    deliveryTime: "",
    image1: "",
    image2: "",
    image3: "",
    status: "",
  });

  const [serviceRequest, setServiceRequest] = useState({
    serviceId: serviceId,
    customerId: customer ? customer.id : 0,
    requirement_description: "",
  });

  const handleInput = (e) => {
    setServiceRequest({ ...serviceRequest, [e.target.name]: e.target.value });
  };

  const [selectedImage, setSelectImage] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    const getService = async () => {
      const fetchServiceResponse = await retrieveService();
      if (fetchServiceResponse) {
        setService(fetchServiceResponse.services[0]);
      }
    };
    getService();
  }, []);

  const retrieveService = async () => {
    const response = await axios.get(
      `${API_BASE_URL}/service/fetch/id-wise?serviceId=` + serviceId
    );
    console.log(response.data);
    return response.data;
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    const formattedDate = date.toLocaleString(); // Adjust the format as needed

    return formattedDate;
  };

  const bookServicePage = (e) => {
    e.preventDefault();
    if (customer === null) {
      alert("You need to be a registered customer to get any service");
    } else {
      handleShow();
    }
  };

  const requestForService = (e) => {
    e.preventDefault();
    if (serviceRequest === null) {
      toast.error("Enter valid input", {
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
    formData.append("serviceId", serviceRequest.serviceId);
    formData.append("customerId", serviceRequest.customerId);
    formData.append(
      "requirement_description",
      serviceRequest.requirement_description
    );
    formData.append("requirement_filename", selectedImage);

    axios
      .post(`${API_BASE_URL}/service/request/add`, formData, {
        headers: {
          // Authorization: "Bearer " + guide_jwtToken, // Replace with your actual JWT token
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
          }, 2000); // Redirect after 3 seconds
        } else if (!response.success) {
          toast.error(response.responseMessage, {
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
          // }, 2000); // Redirect after 3 seconds
        } else {
          toast.error("Fill all the required details", {
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
          // }, 2000); // Redirect after 3 seconds
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Fill all the required details", {
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
        // }, 2000); // Redirect after 3 seconds
      });
  };

  return (
    <div className="mb-3">
      <div className="col ml-5 mt-3 ms-5 me-5">
        <div className="card rounded-card h-100 shadow-lg ">
          <h2 className="card-title text-center text-color ms-4">
            Service Pacakge Detail
          </h2>

          <div className="row g-0">
           
            <div className="col-md-6">
              <div className="card-body">
                <div className="row g-0">
                 
                  <div className="col-md-4 d-flex align-items-center justify-content-center">
                    <ServiceCarousel
                      item={{
                        image1: service.image1,
                        image2: service.image2,
                        image3: service.image3,
                      }}
                    />
                    <img src="" alt="" />
                  </div>
                  
                  <div className="col-md-8">
                    <div className="card-body text-color">
                      <h3 className="card-title d-flex justify-content-between text-color-second">
                        <div>
                          <b>{service.name}</b>
                        </div>
                      </h3>
                      <p className="card-text text-dark">
                        {service.description}
                      </p>

                      <b>
                        <span className="text-dark">Tech Expert:</span>
                        <span className="text-color ms-2">
                          {service.techExpert.firstName +
                            " " +
                            service.techExpert.lastName}
                        </span>
                      </b>
                      <br />
                      <br />
                      <b>
                        <span className="text-dark">Shop Name:</span>
                        <span className="text-color ms-2">
                          {service.techExpert.shopName}
                        </span>
                      </b>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          
            <div className="col-md-6 text-dark">
              <div className="card-body">
                

                <div className="row mt-5">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <b>Category:</b>

                      <span className="text-color"> {service.category}</span>
                    </p>
                  </div>

                  {(() => {
                    if (service.subCategory) {
                      return (
                        <div className="col-md-6">
                          <p className="mb-2">
                            <b>Sub Category:</b>
                            <span className="text-color">
                              {" "}
                              {service.subCategory.name}
                            </span>
                          </p>
                        </div>
                      );
                    }
                  })()}
                </div>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <b>Added Time:</b>

                      <span className="text-color">
                        {" "}
                        {formatDateFromEpoch(service.addedTime)}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2">
                      <b>Work Time:</b>
                      <span className="text-color">
                        {" "}
                        {service.deliveryTime + " Days"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <b>Minimum Price:</b>

                      <span className="text-color">
                        {" "}
                        &#8377; {service.minPrice}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2">
                      <b>Shop Address:</b>
                      <span className="text-color">
                        {service.techExpert.address.street +
                          " " +
                          service.techExpert.address.city +
                          " " +
                          service.techExpert.address.pincode}{" "}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {(() => {
            if (service.status === "Active") {
              return (
                <div className="d-flex justify-content-center mt-4">
                  <button
                    type="button"
                    className="btn bg-color custom-bg-text mb-3"
                    onClick={(e) => bookServicePage(e)}
                  >
                    <b>Booking Request</b>
                  </button>
                  <ToastContainer />
                </div>
              );
            }
          })()}
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title
            style={{
              borderRadius: "1em",
            }}
          >
            Service Request
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="ms-3 mt-3 mb-3 me-3">
            <form>
              <div class="mb-3">
                <label for="title" class="form-label">
                  <b>Requirement</b>
                </label>
                <textarea
                  type="text"
                  class="form-control"
                  name="requirement_description"
                  onChange={handleInput}
                  value={serviceRequest.requirement_description}
                  placeholder="Enter your requirement here"
                />
              </div>

              <div className="mb-3">
                <label for="formFile" class="form-label">
                  <b>Select Requirement File</b>
                </label>
                <input
                  class="form-control"
                  type="file"
                  id="formFile"
                  name="image"
                  onChange={(e) => setSelectImage(e.target.files[0])}
                  required
                />
              </div>

              <div className="d-flex aligns-items-center justify-content-center mb-2">
                <button
                  type="submit"
                  onClick={requestForService}
                  class="btn bg-color custom-bg-text"
                >
                  Request
                </button>
                <ToastContainer />
              </div>

              <ToastContainer />
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ServiceDetailPage;
