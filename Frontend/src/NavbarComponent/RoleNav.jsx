import AdminHeader from "./AdminHeader";
import HeaderCustomer from "./HeaderCustomer";
import NormalHeader from "./NormalHeader";
import TechExpertHeader from "./TechExpertHeader";

const RoleNav = () => {
  const customer = JSON.parse(sessionStorage.getItem("active-customer"));
  const admin = JSON.parse(sessionStorage.getItem("active-admin"));
  const expert = JSON.parse(sessionStorage.getItem("active-expert"));

  if (customer != null) {
    return <HeaderCustomer />;
  } else if (admin != null) {
    return <AdminHeader />;
  } else if (expert != null) {
    return <TechExpertHeader />;
  } else {
    return <NormalHeader />;
  }
};

export default RoleNav;
