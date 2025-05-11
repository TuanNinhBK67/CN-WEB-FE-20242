import logo from "./logo.svg";
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
import ProductResults from "./pages/ProductResults"; // đường dẫn tùy bạn
import ManageProduct from "./pages/setting/ManageProduct.jsx";

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
        <Route path="dashboard/product" element={<ManageProduct />} />
      </Route>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductResults />} />
      // others routes
    </Routes>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
