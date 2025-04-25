import './App.scss';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import HomePage from './pages/HomePage.jsx';
import Register from './pages/Register.jsx';
import SettingLayout from './pages/Setting.jsx';
import SettingWelcom from './pages/setting/SettingWelcom.jsx';
import UpdateProfile from './pages/setting/UpdateProfile.jsx';
import GetProfile from './pages/setting/Profile.jsx';
import DashboardUser from './pages/setting/ManageUser.jsx';
import ChangePassword from './pages/setting/ChangePassword.jsx';
import Checkout from './pages/Checkout.jsx';
import PaymentSuccess from './pages/payment/PaymentSuccess.jsx';
import PaymentFailed from './pages/payment/PaymentFailed.jsx';
import PaymentHistory from './pages/setting/PaymentHistory.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/setting" element={<SettingLayout />}>
        <Route index element={<SettingWelcom />} />
        <Route path="updateProfile" element={<UpdateProfile />} />
        <Route path="profile" element={<GetProfile />} />
        <Route path="dashboard/user" element={<DashboardUser />} />
        <Route path="password" element={<ChangePassword />} />
        <Route path="payments" element={<PaymentHistory />} />
      </Route>
      <Route path="/checkout/:orderId?" element={<Checkout />} />
      <Route path="/payment/success/:orderId" element={<PaymentSuccess />} />
      <Route path="/payment/failed/:orderId" element={<PaymentFailed />} />
    </Routes>
  );
}

export default App;