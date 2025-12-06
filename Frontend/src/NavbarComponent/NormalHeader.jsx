import { Link } from "react-router-dom";
import ".././css/NormalHeader.css"
import { motion } from "framer-motion";

const NormalHeader = () => {
 
  return (
    <ul class="navbar-nav ms-auto mb-2 mb-lg-0 me-5 logreg">
      <li whileTap={{ scale: 0.9 }} class="nav-item dropdown">
        <a class="nav-link dropdown-toggle text-color" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <b>Create Account</b>
        </a>
        <ul class="dropdown-menu text-center" aria-labelledby="navbarDropdown">
          <li class="nav-item">
            <Link
              to="/user/customer/register"
              class="nav-link active "
              aria-current="page"
            >
              <b className="text-color center"> Customer</b>
            </Link>
          </li>

          <li class="nav-item" >
            <Link
              to="/user/tech-expert/register"
              class="nav-link active"
              aria-current="page"
            >
              <b className="text-color text-center">Photo Studio</b>
            </Link>
          </li>
        </ul>
      </li>

      <motion.li whileTap={{ scale: 0.9 }} class="nav-item">
        <Link to="/user/login" class="nav-link active" aria-current="page">
          <b className="text-color">Login Here</b>
        </Link>
      </motion.li>


    </ul>

  );
};

export default NormalHeader;
