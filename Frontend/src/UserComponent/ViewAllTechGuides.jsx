import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "animate.css";
import { API_BASE_URL } from "../config/apiConfig";

const ViewAllTechGuides = () => {
  const [allUser, setAllUser] = useState([]);
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  useEffect(() => {
    const getAllUsers = async () => {
      const allUsers = await retrieveAllUser();
      if (allUsers) {
        setAllUser(allUsers.users);
      }
    };

    getAllUsers();
  }, []);

  const retrieveAllUser = async () => {
    const response = await axios.get(
      `${API_BASE_URL}/user/fetch/role-wise?role=Tech Expert`,
      {
        headers: {
          //   Authorization: "Bearer " + admin_jwtToken,
        },
      }
    );
    console.log(response.data);
    return response.data;
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    const formattedDate = date.toLocaleString();
    return formattedDate;
  };

  const deleteExpert = (expertId, e) => {
    fetch(
      `${API_BASE_URL}/user/delete/tech-expert?techExpertId=` + expertId,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + admin_jwtToken,
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
            }, 1000);
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
            }, 1000);
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
        setTimeout(() => {
          window.location.reload(true);
        }, 1000);
      });
  };

  return (
    <div className="mt-3">
      <div
        className="card form-card ms-2 me-2 mb-5 shadow-lg animate__animated animate__fadeIn"
        style={{
          height: "45rem",
          backgroundColor: "#f8f9fa",
          borderRadius: "1em",
        }}
      >
        <div
          className="card-header custom-bg-text text-center"
          style={{
            borderRadius: "1em",
            height: "50px",
            backgroundColor: "#6a0dad", 
            color: "white",
          }}
        >
          <h2>All Tech Experts</h2>
        </div>
        <div
          className="card-body"
          style={{
            overflowY: "auto",
          }}
        >
          <div className="table-responsive">
            <table className="table table-hover text-color text-center">
              <thead
                className="table-bordered border-color"
                style={{
                  backgroundColor: "#6a0dad",
                  color: "white",
                }}
              >
                <tr>
                  <th scope="col">First Name</th>
                  <th scope="col">Last Name</th>
                  <th scope="col">Email Id</th>
                  <th scope="col">Phone No</th>
                  <th scope="col">Address</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {allUser.map((user) => (
                  <tr
                    key={user.id}
                    className="animate__animated animate__fadeInUp"
                  >
                    <td>
                      <b>{user.firstName}</b>
                    </td>
                    <td>
                      <b>{user.lastName}</b>
                    </td>
                    <td>
                      <b>{user.emailId}</b>
                    </td>
                    <td>
                      <b>{user.phoneNo}</b>
                    </td>
                    <td>
                      <b>
                        {user.address.street +
                          ", " +
                          user.address.city +
                          ", " +
                          user.address.pincode}
                      </b>
                    </td>
                    <td>
                      <button
                        onClick={() => deleteExpert(user.id)}
                        className="btn btn-sm bg-color custom-bg-text ms-2"
                        style={{
                          backgroundColor: "#6a0dad",
                          color: "white",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ViewAllTechGuides;