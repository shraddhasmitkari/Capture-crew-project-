import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";

const AdminRegisterForm = () => {
  const navigate = useNavigate();
 
  const [registerRequest, setRegisterRequest] = useState({});
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const { emailId, password } = registerRequest;
    const errors = {};

    if (!emailId) {
      errors.emailId = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(emailId)) {
      errors.emailId = "Email address is invalid";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUserInput = (e) => {
    setRegisterRequest({ ...registerRequest, [e.target.name]: e.target.value });
  };

  const registerAdmin = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    fetch(`${API_BASE_URL}/user/admin/register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // Authorization: "Bearer " + admin_jwtToken,
      },
      body: JSON.stringify(registerRequest),
    })
      .then((result) => result.json())
      .then((res) => {
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
            navigate("/home");
          }, 1000);
        } else {
          toast.error(res.responseMessage || "It seems server is down", {
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
      });
  };

  return (
    <div>
      <div className="register-container mt-2 d-flex aligns-items-center justify-content-center" style={{height:"100vh"}}>
        <div className="form-card border-color mb-2" style={{ width: "25rem",height:"400px",margin:"35px" }}>
          <div className="container-fluid">
            <div
              className="card-header bg-color custom-bg-text mt-2 d-flex justify-content-center align-items-center"
              style={{ borderRadius: "1em", height: "38px" }}
            >
              <h4 className="card-title">Admin Register</h4>
            </div>
            <div className="card-body mt-3">
              <form onSubmit={registerAdmin}>
                <div className="mb-3 text-color">
                  <label htmlFor="emailId" className="form-label">
                    <b>Email Id</b>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="emailId"
                    name="emailId"
                    onChange={handleUserInput}
                    value={registerRequest.emailId || ""}
                  />
                  {errors.emailId && (
                    <small className="text-danger">{errors.emailId}</small>
                  )}
                </div>
                <div className="mb-3 text-color">
                  <label htmlFor="password" className="form-label">
                    <b>Password</b>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    onChange={handleUserInput}
                    value={registerRequest.password || ""}
                    autoComplete="on"
                  />
                  {errors.password && (
                    <small className="text-danger">{errors.password}</small>
                  )}
                </div>
                <div className="d-flex aligns-items-center justify-content-center">
                  <button
                    type="submit"
                    className="btn bg-color custom-bg-text mb-2"
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminRegisterForm;