import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import ".././css/MyWallet.css"; 

const MyWallet = () => {
  const user = JSON.parse(sessionStorage.getItem("active-customer"));
  const [walletAmount, setWalletAmount] = useState(user.walletAmount);

  const [walletRequest, setWalletRequest] = useState({
    id: user.id,
    walletAmount: "",
  });

  const [fetchUserWallet, setFetchUserWallet] = useState({});

  const handleInput = (e) => {
    const { name, value } = e.target;
    // Allow only numbers
    if (!isNaN(value) && value >= 0) {
      setWalletRequest({ ...walletRequest, [name]: value });
    } else {
      toast.error("Please enter a valid amount", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  useEffect(() => {
    const getMyWallet = async () => {
      const userResponse = await retrieveMyWallet();
      if (userResponse) {
        setFetchUserWallet(userResponse.users[0]);
        setWalletAmount(userResponse.users[0].walletAmount);
      }
    };
    getMyWallet();
  }, []);

  const retrieveMyWallet = async () => {
    const response = await axios.get(
      `${API_BASE_URL}/user/fetch/user-id?userId=` + user.id
    );
    return response.data;
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const addMoneyInWallet = (e) => {
    e.preventDefault();

    if (!walletRequest.walletAmount || isNaN(walletRequest.walletAmount) || walletRequest.walletAmount <= 0) {
      toast.error("Please enter a valid amount", {
        position: "top-right",
        autoClose: 1000,
      });
      return;
    }

    fetch(`${API_BASE_URL}/user/update/wallet`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(walletRequest),
    })
      .then((result) => {
        result.json().then((res) => {
          if (res.success) {
            var options = res.razorPayRequest;
            options.handler = function (response) {
              response.razorpay_order_id = options.orderId;

              fetch(`${API_BASE_URL}/user/razorpPay/response`, {
                method: "PUT",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(response),
              })
                .then((result) => {
                  result.json().then((res) => {
                    if (res.success) {
                      toast.success(res.responseMessage, {
                        position: "top-right",
                        autoClose: 1000,
                      });
                      setTimeout(() => {
                        window.location.reload(true);
                      }, 1000);
                    } else {
                      toast.error(res.responseMessage || "Payment failed", {
                        position: "top-right",
                        autoClose: 1000,
                      });
                      setTimeout(() => {
                        window.location.reload(true);
                      }, 1000);
                    }
                  });
                })
                .catch((error) => {
                  console.error(error);
                  toast.error("Server error, please try again", {
                    position: "top-right",
                    autoClose: 1000,
                  });
                  setTimeout(() => {
                    window.location.reload(true);
                  }, 1000);
                });
            };

            if (window.Razorpay) {
              const rzp1 = new window.Razorpay(options);
              rzp1.on("payment.failed", function (response) {
                response.razorpay_order_id = options.orderId;

                fetch(`${API_BASE_URL}/user/razorpPay/response`, {
                  method: "PUT",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(response),
                })
                  .then((result) => {
                    result.json().then((res) => {
                      if (res.success) {
                        toast.success(res.responseMessage, {
                          position: "top-right",
                          autoClose: 1000,
                        });
                        setTimeout(() => {
                          window.location.reload(true);
                        }, 1000);
                      } else {
                        toast.error(res.responseMessage || "Payment failed", {
                          position: "top-right",
                          autoClose: 1000,
                        });
                        setTimeout(() => {
                          window.location.reload(true);
                        }, 1000);
                      }
                    });
                  })
                  .catch((error) => {
                    console.error(error);
                    toast.error("Server error, please try again", {
                      position: "top-right",
                      autoClose: 1000,
                    });
                    setTimeout(() => {
                      window.location.reload(true);
                    }, 1000);
                  });
              });
              rzp1.open();
            } else {
              toast.error("Payment Gateway Internal Server Issue", {
                position: "top-right",
                autoClose: 1000,
              });
              setTimeout(() => {
                window.location.reload(true);
              }, 1000);
            }
          } else {
            toast.error(res.responseMessage || "Payment failed", {
              position: "top-right",
              autoClose: 1000,
            });
            setTimeout(() => {
              window.location.reload(true);
            }, 1000);
          }
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("Server error, please try again", {
          position: "top-right",
          autoClose: 1000,
        });
        setTimeout(() => {
          window.location.reload(true);
        }, 1000);
      });
  };

  return (
    <div className="wallet-container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card form-card custom-bg animated fadeInUp" style={{ width: "25rem",marginTop:"-20px" }}>
        <div className="card-header bg-color text-center custom-bg-text mb-3 animated bounceInDown" style={{ borderRadius: "1em", height: "50px" }}>
          <h3>My Wallet</h3>
        </div>
        <h4 className="ms-3 text-color text-center animated fadeIn">Wallet Balance: &#8377; {walletAmount}</h4>

        <hr />

        <div className="card-header bg-color text-center custom-bg-text animated bounceInUp" style={{ borderRadius: "1em", height: "50px" }}>
          <h4 className="card-title">Add Money In Wallet</h4>
        </div>
        <div className="card-body">
          <form onSubmit={addMoneyInWallet}>
            <div className="mb-3 text-color animated fadeIn">
              <label htmlFor="walletAmount" className="form-label">
                <b>Amount</b>
              </label>
              <input
                type="text"
                className="form-control"
                name="walletAmount"
                onChange={handleInput}
                value={walletRequest.walletAmount}
                required
              />
            </div>
            <div className="d-flex align-items-center justify-content-center mb-2">
              <button type="submit" className="btn bg-color custom-bg-text animated pulse infinite">
                Update Wallet
              </button>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default MyWallet;
