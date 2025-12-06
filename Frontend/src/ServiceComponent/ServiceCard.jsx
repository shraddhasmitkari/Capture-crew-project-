import { Link } from "react-router-dom";
import "../css/ServiceCard.css"; // Import the CSS file for styles
import { API_BASE_URL } from "../config/apiConfig";

const ServiceCard = ({ item }) => {
  const descriptionToShow = (description, maxLength) => {
    if (description.length <= maxLength) {
      return description;
    } else {
      const truncatedText = description.substring(0, maxLength);
      return truncatedText + "...";
    }
  };

  return (
    <div className="col-12 col-md-6 col-lg-4 mb-4">
      <Link
        to={`/service/${item.id}/detail`}
        className="card job-card rounded-card h-100 shadow-lg"
      >
        <div className="row g-0">
          {/* Card Image */}
          <div className="col-md-4 d-flex align-items-center justify-content-center">
            <img
              src={`${API_BASE_URL}/service/` + item.image1}
              className="card-img-top rounded img-fluid"
              alt="service"
            />
          </div>
          {/* Card Details */}
          <div className="col-md-8">
            <div className="card-body">
              <h3 className="card-title d-flex justify-content-between">
                <div>
                  <b>{item.name}</b>
                </div>
              </h3>
              <p className="card-text">
                {descriptionToShow(item.description, 50)}
              </p>

              <div className="d-flex justify-content-between mt-3">
                <b>
                  <span>Category: </span>
                  <span>{item.category}</span>
                </b>

                {item.subCategory && (
                  <b>
                    <span>Sub Category: </span>
                    <span>{item.subCategory.name}</span>
                  </b>
                )}
              </div>

              <div className="d-flex justify-content-between mt-3" style={{gap:"10px"}}>
                <b>
                  <span>work Time: </span>
                  <span>{item.deliveryTime + " Days"}</span>
                </b>
                <b>
                  <span>Min Price: </span>
                  <span>&#8377;{item.minPrice}</span>
                </b>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ServiceCard;
