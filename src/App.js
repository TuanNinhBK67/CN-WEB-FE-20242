import logo from './logo.svg';
import './App.scss';
import {Routes, Route} from "react-router-dom";
import Login from "./pages/Login.jsx"
import HomePage from "./pages/HomePage.jsx"
import Register from './pages/Register.jsx';
import SettingLayout from './pages/Setting.jsx';
import SettingWelcome from './pages/setting/SettingWelcom.jsx';
import Updateprofile from './pages/setting/UpdateProfile.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/setting" element={<SettingLayout />}>
        <Route index element={<SettingWelcome />} />
        <Route path="updateProfile" element={<Updateprofile />} />
        {/* <Route path="password" element={<ChangePassword />} /> */}
      </Route>
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
