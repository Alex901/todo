import React, { useState, useEffect } from "react";
import "./Header.css";
import LoginModal from "./HeaderModals/LoginModal";
import RegisterModal from "./HeaderModals/RegisterModal";
import { useUserContext } from "../../../contexts/UserContext";
import logo from "../../../assets/Anvil_logo_v1.png";
import { toast } from "react-toastify";

const Header = () => {
  const [time, setTime] = useState(new Date());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { isLoggedIn, loggedInUser, logout } = useUserContext();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
        setTime(new Date());
    }, 1000); // update time every second

    // cleanup function
    return () => {
        clearInterval(timer);
    };
}, []);


  const openLoginModal = (event) => {
    // console.log(isLoggedIn);
    event.preventDefault();
    setIsLoginModalOpen(true);
  }

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    // console.log(isLoggedIn)
    setIsLoginModalOpen(false);
  }

  const openRegisterModal = (event) => {
    event.preventDefault();
    setIsRegisterModalOpen(true);
  }

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  }

  const handleLogout = () => {
    logout();
    toast.success("Bye, see you soon!");
    //console.log("Logging out");
  }

  return (
    <div className="mdl-layout" style={{ overflow: 'hidden' }}>
      <header className="mdl-layout__header header_layout">
        <div className="mdl-layout__header-row nav-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Left section */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Logo" style={{ marginRight: '12px', width: '5%', height: 'auto', position: 'relative', top: '-3px' }} />
            <span className="mdl-layout-title" style={{ fontSize: '32px', color: "white" }}>TaskForge</span>

          </div>

          {/* Middle section */}
          <nav className="mdl-navigation">
            {/* Add navigation links/icons here */}
          </nav>

          {/* Right section */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <a href="#" className="mdl-navigation__link login-link" onClick={isLoggedIn ? handleLogout : openLoginModal}>{isLoggedIn ? 'Logout' : 'Login'} </a>
            {!isLoggedIn && <button className="todoButton" onClick={openRegisterModal}>Register</button>}
          </div>
        </div>
      </header>
      <LoginModal isOpen={isLoginModalOpen} onRequestClose={closeLoginModal} />
      <RegisterModal isOpen={isRegisterModalOpen} onRequestClose={closeRegisterModal} />
      <div className="mdl-layout" style={{ overflow: 'hidden' }}>
    
      </div>
    </div>
  );
};

export default Header;
