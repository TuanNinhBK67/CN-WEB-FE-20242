import "./App.scss";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/user/Login.jsx";
import HomePage from "./pages/HomePage.jsx";
import Register from "./pages/user/Register.jsx";
import SettingLayout from "./pages/user/Setting.jsx";
import SettingWelcome from "./pages/setting/SettingWelcom.jsx";
import Updateprofile from "./pages/setting/UpdateProfile.jsx";
import GetProfile from "./pages/setting/Profile.jsx";
import DashboardUser from "./pages/setting/ManageUser.jsx";
import Changepassword from "./pages/setting/ChangePassword.jsx";
import RequireGuest from "./components/RequireGuest.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import ForgotPassword from "./pages/user/ForgotPassword.jsx";
import ResetPassword from "./pages/user/ResetPassword.jsx";
import ProductResults from "./pages/ProductResults";
import ManageProduct from "./pages/setting/ManageProduct.jsx";
import AddProduct from "./pages/setting/addProduct.jsx";
import ProductCategory from "./pages/setting/ProductCategory.jsx";
import ChangeProductInfo from "./pages/setting/ChangeProductInfo.jsx";
import OrderManagement from "./pages/order/OrderManagement.jsx";
import AddCategory from "./pages/setting/AddCategory.jsx";
import AddBrands from "./pages/setting/AddBrands.jsx";
import Checkout from "./pages/Checkout.jsx";
import PaymentSuccess from "./pages/payment/PaymentSuccess.jsx";
import PaymentFailed from "./pages/payment/PaymentFailed.jsx";
import PaymentHistory from "./pages/setting/PaymentHistory.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/login"
        element={
          <RequireGuest>
            <Login />
          </RequireGuest>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <RequireGuest>
            <ForgotPassword />
          </RequireGuest>
        }
      />
      <Route
        path="/reset-password"
        element={
          <RequireGuest>
            <ResetPassword />
          </RequireGuest>
        }
      />
      <Route
        path="/register"
        element={
          <RequireGuest>
            <Register />
          </RequireGuest>
        }
      />
      <Route
        path="/setting"
        element={
          <RequireAuth>
            <SettingLayout />
          </RequireAuth>
        }
      >
        <Route index element={<SettingWelcome />} />
        <Route path="updateProfile" element={<Updateprofile />} />
        <Route path="profile" element={<GetProfile />} />
        <Route path="dashboard/user" element={<DashboardUser />} />
        <Route path="password" element={<Changepassword />} />
        <Route path="payments" element={<PaymentHistory />} />
        <Route path="dashboard/product" element={<ManageProduct />} />
        <Route path="addProduct" element={<AddProduct />} />
        <Route path="add-category" element={<AddCategory />} />
        <Route path="add-brand" element={<AddBrands />} />
        <Route path="product-category/:id" element={<ProductCategory />} />
        <Route path="change-product/:id" element={<ChangeProductInfo />} />
        <Route path="dashboard/orders" element={<OrderManagement />} />
      </Route>
      <Route path="/checkout/:orderId?" element={<Checkout />} />
      <Route path="/payment/success/:orderId" element={<PaymentSuccess />} />
      <Route path="/payment/failed/:orderId" element={<PaymentFailed />} />
      <Route path="/product/:id" element={<ProductResults key={window.location.pathname} />} />
      <Route path="/search" element={<ProductResults />} />
      <Route path="/category/:categoryId" element={<ProductResults />} />
      <Route path="/products/branch/:branchId" element={<ProductResults />} />
      <Route path="/addProduct" element={<AddProduct />} />
      <Route path="/setting/change-product/:id" element={<ChangeProductInfo />} />
    </Routes>
  );
}

export default App;