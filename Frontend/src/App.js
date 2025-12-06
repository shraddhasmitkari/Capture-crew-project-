import { Routes, Route } from "react-router-dom";
import Header from "./NavbarComponent/Header";
import AdminRegisterForm from "./UserComponent/AdminRegisterForm";
import UserLoginForm from "./UserComponent/UserLoginForm";
import UserRegister from "./UserComponent/UserRegister";
import HomePage from "./PageComponent/HomePage";
import ViewAllCustomers from "./UserComponent/ViewAllCustomers";
import ViewAllTechGuides from "./UserComponent/ViewAllTechGuides";
import AddCategoryForm from "./CategoryComponent/AddCategoryForm";
import ViewAllCategories from "./CategoryComponent/ViewAllCategories";
import UpdateCategoryForm from "./CategoryComponent/UpdateCategoryForm";
import MyWallet from "./UserComponent/MyWallet";
import UserProfilePage from "./UserComponent/UserProfilePage";
import AddServiceForm from "./ServiceComponent/AddServiceForm";
import ServiceDetailPage from "./ServiceComponent/ServiceDetailPage";
import ViewExpertServices from "./ServiceComponent/ViewExpertServices";
import ViewCustomerServiceRequests from "./ServiceComponent/ViewCustomerServiceRequests";
import ViewExpertServiceRequests from "./ServiceComponent/ViewExpertServiceRequests";
import ViewAllServices from "./ServiceComponent/ViewAllServices";
import ViewAllServiceRequests from "./ServiceComponent/ViewAllServiceRequests";
import Footer from "./NavbarComponent/Footer";
function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route 
          path="/" 
          element={<HomePage />} />
        <Route 
          path="/home" 
          element={<HomePage />} />
        <Route 
          path="/user/admin/register" 
          element={<AdminRegisterForm />} />
        <Route 
          path="/user/login" 
          element={<UserLoginForm />} />
        <Route 
          path="/user/customer/register" 
          element={<UserRegister />} />
        <Route 
          path="/user/tech-expert/register" 
          element={<UserRegister />} />
        <Route 
          path="/admin/customer/all" 
          element={<ViewAllCustomers />} />
        <Route 
          path="/admin/tech-expert/all" 
          element={<ViewAllTechGuides />} />
        <Route 
          path="/admin/category/add" 
          element={<AddCategoryForm />} />
        <Route 
          path="/admin/category/all" 
          element={<ViewAllCategories />} />
        <Route 
          path="/admin/category/update" 
          element={<UpdateCategoryForm />} />
        <Route 
          path="/customer/wallet" 
          element={<MyWallet />} />
        <Route
          path="/user/:userId/profile/detail"
          element={<UserProfilePage />}
        />
        <Route
          path="/tech-expert/service/expert"
          element={<AddServiceForm />}
        />
        <Route
          path="/service/:serviceId/detail"
          element={<ServiceDetailPage />}
        />
        <Route
          path="/tech-expert/service/all"
          element={<ViewExpertServices />}
        />
        <Route
          path="/customer/service/request/all"
          element={<ViewCustomerServiceRequests />}
        />
        <Route
          path="/tech-expert/service/request/all"
          element={<ViewExpertServiceRequests />}
        />
        <Route path="/admin/service/all" element={<ViewAllServices />} />

        <Route
          path="/admin/service/request/all"
          element={<ViewAllServiceRequests />}
        />
      </Routes>
    <Footer/>
    </div>
  );
}

export default App;
