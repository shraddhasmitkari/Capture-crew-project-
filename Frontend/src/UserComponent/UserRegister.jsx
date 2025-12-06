import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";


const UserRegister = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    shopName: "",
    emailId: "",
    password: "",
    phoneNo: "",
    street: "",
    city: "",
    pincode: "",
    role: "",
  });

  useEffect(() => {
    if (document.URL.indexOf("customer") !== -1) {
      setUser((prevState) => ({ ...prevState, role: "Customer" }));
    } else if (document.URL.indexOf("tech-expert") !== -1) {
      setUser((prevState) => ({ ...prevState, role: "Tech Expert" }));
    }
  }, []);

  const handleUserInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { firstName, lastName, emailId, password, phoneNo, street, city, pincode, role } = user;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[1-9]{10}$/;
    const pincodeRegex = /^[0-9]{6}$/;

    if (!firstName || !lastName || !emailId || !password || !phoneNo || !street || !city || !pincode || !role) {
      toast.error("All fields are required", {
        position: "top-right",
        autoClose: 1000,
      });
      return false;
    }
    if (!emailRegex.test(emailId)) {
      toast.error("Invalid email address", {
        position: "top-right",
        autoClose: 1000,
      });
      return false;
    }
    if (!phoneRegex.test(phoneNo)) {
      toast.error("Phone number must be valid 10 digits number", {
        position: "top-right",
        autoClose: 1000,
      });
      return false;
    }
    if (!pincodeRegex.test(pincode)) {
      toast.error("Pincode must be 6 digits", {
        position: "top-right",
        autoClose: 1000,
      });
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long", {
        position: "top-right",
        autoClose: 1000,
      });
      return false;
    }
    return true;
  };

  const saveUser = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    fetch(`${API_BASE_URL}/user/register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((result) => result.json())
      .then((res) => {
        if (res.success) {
          toast.success(res.responseMessage, {
            position: "top-right",
            autoClose: 1000,
          });

          setTimeout(() => {
            navigate("/user/login");
          }, 1000);
        } else {
          toast.error(res.responseMessage || "Registration failed", {
            position: "top-right",
            autoClose: 1000,
          });

          setTimeout(() => {
            window.location.reload(true);
          }, 1000);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("It seems server is down", {
          position: "top-right",
          autoClose: 1000,
        });

        setTimeout(() => {
          window.location.reload(true);
        }, 1000);
      });
  };

  return (
    <div className="register-container d-flex justify-content-center align-items-center min-vh-100">
      <div className="form-card border-color text-color animated fadeInUp">
        <div className="container-fluid">
          <div className="card-header bg-color custom-bg-text mt-2 d-flex justify-content-center align-items-center animated bounceInDown">
            <h5 className="card-title">
              Register{" "}
              {document.URL.indexOf("tech-expert") !== -1
                ? "Photo Studio tech-expert"
                : "Customer"}{" "}
              Here!
            </h5>
          </div>
          <div className="card-body mt-3 animated fadeIn">
            <form className="row g-3" onSubmit={saveUser}>
              <div className="col-md-6 mb-3 text-color">
                <label htmlFor="title" className="form-label">
                  <b>First Name</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  onChange={handleUserInput}
                  value={user.firstName}
                  required
                />
              </div>

              <div className="col-md-6 mb-3 text-color">
                <label htmlFor="title" className="form-label">
                  <b>Last Name</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  onChange={handleUserInput}
                  value={user.lastName}
                  required
                />
              </div>

              {document.URL.indexOf("tech-expert") !== -1 && (
                <div className="col-md-6 mb-3 text-color">
                  <label htmlFor="shopName" className="form-label">
                    <b>Shop Name</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="shopName"
                    name="shopName"
                    onChange={handleUserInput}
                    value={user.shopName}
                    required
                  />
                </div>
              )}

              <div className="col-md-6 mb-3 text-color">
                <b>
                  <label htmlFor="emailId" className="form-label">
                    Email Id
                  </label>
                </b>
                <input
                  type="email"
                  className="form-control"
                  id="emailId"
                  name="emailId"
                  onChange={handleUserInput}
                  value={user.emailId}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="password" className="form-label">
                  <b>Password</b>
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  onChange={handleUserInput}
                  value={user.password}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="phoneNo" className="form-label">
                  <b>Contact No</b>
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="phoneNo"
                  name="phoneNo"
                  onChange={handleUserInput}
                  value={user.phoneNo}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="street" className="form-label">
                  <b>Street</b>
                </label>
                <textarea
                  className="form-control"
                  id="street"
                  name="street"
                  rows="3"
                  onChange={handleUserInput}
                  value={user.street}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="city" className="form-label">
                  <b>City</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  name="city"
                  onChange={handleUserInput}
                  value={user.city}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="pincode" className="form-label">
                  <b>Pincode</b>
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="pincode"
                  name="pincode"
                  onChange={handleUserInput}
                  value={user.pincode}
                  required
                />
              </div>

              <div className="d-flex justify-content-center mt-4">
                <button
                  type="submit"
                  className="btn bg-color custom-bg-text animated pulse infinite"
                >
                  Register User
                </button>
              </div>
              <ToastContainer />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
