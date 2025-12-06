import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { API_BASE_URL } from "../config/apiConfig";
import "bootstrap/dist/css/bootstrap.min.css";

const ViewAllCustomers = () => {
  const [allEmployee, setAllEmployee] = useState([]);

  useEffect(() => {
    const getAllUsers = async () => {
      const allUsers = await retrieveAllUser();
      if (allUsers) {
        setAllEmployee(allUsers.users);
      }
    };

    getAllUsers();
  }, []);

  const retrieveAllUser = async () => {
    const response = await axios.get(
      `${API_BASE_URL}/user/fetch/role-wise?role=Customer`,
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
    const formattedDate = date.toLocaleString(); // Adjust the format as needed

    return formattedDate;
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
            backgroundColor: "#6a0dad", // Purple background for the navbar and heading
            color: "white",
          }}
        >
          <h2>All Customers</h2>
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
                </tr>
              </thead>
              <tbody>
                {allEmployee.map((employee) => {
                  return (
                    <tr key={employee.id} className="animate__animated animate__fadeInUp">
                      <td>
                        <b>{employee.firstName}</b>
                      </td>
                      <td>
                        <b>{employee.lastName}</b>
                      </td>
                      <td>
                        <b>{employee.emailId}</b>
                      </td>
                      <td>
                        <b>{employee.phoneNo}</b>
                      </td>
                      <td>
                        <b>
                          {employee.address.street +
                            ", " +
                            employee.address.city +
                            ", " +
                            employee.address.pincode}
                        </b>
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

export default ViewAllCustomers;
