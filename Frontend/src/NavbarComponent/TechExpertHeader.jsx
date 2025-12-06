import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TechExpertHeader = () => {
  let navigate = useNavigate();

  const expert = JSON.parse(sessionStorage.getItem("active-expert"));

  const TechLogout = () => {
    toast.success("You have been logged out.", {
      position: "top-right", 
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    sessionStorage.removeItem("active-expert");
    sessionStorage.removeItem("expert-jwtToken");

    setTimeout(() => {
      navigate("/home");
      window.location.reload(true);
    }, 2000); // Redirect after 3 seconds
  };

  const viewProfile = (e) => {
    navigate(`/user/${expert.id}/profile/detail`);
  };

  return (
    <ul class="navbar-nav ms-auto mb-2 mb-lg-0 me-5 logreg">
      <li class="nav-item dropdown">
        <a
          class="nav-link dropdown-toggle text-color"
          href="#"
          id="navbarDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <b>My Services</b>
        </a>
        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
          <li>
            <Link
              to="/tech-expert/service/expert"
              class="nav-link active"
              aria-current="page"
            >
              <b className="text-color">Add Service Package</b>
            </Link>
          </li>
          <li>
            <Link
              to="/tech-expert/service/all"
              class="nav-link active"
              aria-current="page"
            >
              <b className="text-color">View Services Packages</b>
            </Link>
          </li>
        </ul>
      </li>

      <li class="nav-item dropdown">
        <a
          class="nav-link dropdown-toggle text-color"
          href="#"
          id="navbarDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <b>Service Requests</b>
        </a>
        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
          <li>
            <Link
              to="/tech-expert/service/request/all"
              class="nav-link active"
              aria-current="page"
            >
              <b className="text-color">View Requests</b>
            </Link>
          </li>
        </ul>
      </li>

      <li class="nav-item dropdown">
        <a
          class="nav-link dropdown-toggle text-color"
          href="#"
          id="navbarDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <b>Profile</b>
        </a>
        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
          <li class="nav-item">
            <div class="nav-link active" aria-current="page">
              <b className="text-color" onClick={viewProfile}>
                View Profile
              </b>
              <ToastContainer />
            </div>
          </li>
        </ul>
      </li>

      <li class="nav-item">
        <Link
          to=""
          class="nav-link active"
          aria-current="page"
          onClick={TechLogout}
        >
          <b className="text-color">Logout</b>
        </Link>
        <ToastContainer />
      </li>
    </ul>
  );
};

export default TechExpertHeader;
