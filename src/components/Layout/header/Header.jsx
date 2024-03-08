import React, { useState, useEffect } from "react";
import "./Header.css";
import LoginModal from "./HeaderModals/LoginModal";
import RegisterModal from "./HeaderModals/RegisterModal";
import { useUserContext } from "../../../contexts/UserContext";

const Header = () => {
  const [time, setTime] = useState(new Date());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { isLoggedIn, loggedInUser, logout } = useUserContext();

  useEffect(() => {
    const intervall = setInterval(() => {
      setTime(new Date());
    }, 1000); // update time once per second

    return () => clearInterval(intervall);
  }, []);

  const comingSoon = () => {
    alert("This feature is in development, but coming soon!")
  }

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
    //console.log("Logging out");
  }

  return (
    <div className="mdl-layout" style={{ overflow: 'hidden'}}>
      <header className="mdl-layout__header header_layout">
        <div className="mdl-layout__header-row top-row" style={{ borderTopRightRadius: '10px', borderTopLeftRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          {/* First row */}
          <span className="mdl-layout-title" style={{ fontSize: '42px', marginTop: '16px', color: "orange"}}>TaskForge</span>
          <div>
            
            <hr/>
            {isLoggedIn && <div>Welcome back, {loggedInUser.username}</div>}
          </div>
          
        </div>
        {/* Second row */}
        <div className="mdl-layout__header-row nav-row" style={{height: '48px'}}>
          {/* Navigation section */}
          {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          <div className="mdl-layout-spacer"></div>
          <nav className="mdl-navigation">
            {/* Add navigation links/icons here */}
            <a href="#" className="mdl-navigation__link login-link" onClick={isLoggedIn ? handleLogout : openLoginModal}>{isLoggedIn ? 'Logout' : 'Login'} </a>
          </nav>
         {!isLoggedIn && <button className="todoButton" onClick={openRegisterModal}>Register</button>}
        </div>
      </header>
      <LoginModal isOpen={isLoginModalOpen} onRequestClose={closeLoginModal} />
      <RegisterModal isOpen={isRegisterModalOpen} onRequestClose={closeRegisterModal} />
    </div>
  );
};

export default Header;
