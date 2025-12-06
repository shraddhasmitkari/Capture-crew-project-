import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";
import "animate.css";
import "../css/UserProfile.css";

const UserProfilePage = () => {
  const { userId } = useParams();

  const [user, setUser] = useState({
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
  });

  useEffect(() => {
    const getUser = async () => {
      const userRes = await retrieveUser();
      if (userRes) {
        setUser(userRes.users[0]);
      }
    };

    getUser();
  }, [userId]);

  const retrieveUser = async () => {
    const response = await axios.get(
      `${API_BASE_URL}/user/fetch/user-id?userId=` + userId
    );
    return response.data;
  };

  return (
    <div className="container-fluid mb-2">
      <div className="d-flex flex-column align-items-center mt-5 mb-3">
        <div
          className="card shadow-lg animate__animated animate__fadeIn animate__delay-1s"
          style={{
            width: "90%",
            maxWidth: "800px",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#E6E6FA",
            border: "2px solid #6a0dad",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="card-body">
            <div className="text-center text-color mb-4">
              <h3 className="mt-3" style={{ color: "#6a0dad" }}>
                My Profile
              </h3>
            </div>

            {user.role === "Tech Expert" && (
              <div className="text-color text-center mb-4">
                <h4>Shop Name: {user.shopName}</h4>
              </div>
            )}

            <div className="d-flex flex-column">
              <div className="d-flex justify-content-between mb-3">
                <p className="mb-2 flex-grow-1">
                  <b>First Name:</b> {user.firstName}
                </p>
                <p className="mb-2 flex-grow-1">
                  <b>Last Name:</b> {user.lastName}
                </p>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <p className="mb-2 flex-grow-1">
                  <b>Email Id:</b> {user.emailId}
                </p>
                <p className="mb-2 flex-grow-1">
                  <b>Contact:</b> {user.phoneNo}
                </p>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <p className="mb-2 flex-grow-1">
                  <b>Address:</b> {user.address.street}, {user.address.city}, {user.address.pincode}
                </p>
                <p className="mb-2 flex-grow-1">
                  <b>Wallet Amount:</b> &#8377; {user.walletAmount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
