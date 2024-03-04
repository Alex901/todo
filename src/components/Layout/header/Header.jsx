import React, { useState, useEffect } from "react";
import "./Header.css";
import ToggleButton from "../ToggleButton/ToggleButton";

const Header = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervall = setInterval(() => {
      setTime(new Date());
    }, 1000); // update time once per second

    return () => clearInterval(intervall);
  }, []);

  const comingSoon = () => {
    alert("This feature is in development, but coming soon!")
  }

  return (
    <div className="mdl-layout" style={{ overflow: 'hidden'}}>
      <header className="mdl-layout__header header_layout">
        <div className="mdl-layout__header-row top-row" style={{ borderTopRightRadius: '10px', borderTopLeftRadius: '10px'}}>
          {/* First row */}
          <span className="mdl-layout-title" style={{ fontSize: '30px'}}>TaskForge</span>
          <div className="mdl-layout-spacer"></div>
          <div>
            {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
        </div>
        {/* Second row */}
        <div className="mdl-layout__header-row" style={{height: '48px'}}>
          {/* Navigation section */}
          <div className="mdl-layout-spacer"></div>
          <nav className="mdl-navigation">
            {/* Add navigation links/icons here */}
            <a href="#" className="mdl-navigation__link">Login</a>
          </nav>
          <button className="todoButton" onClick={comingSoon}>Register</button>
        </div>
      </header>
    </div>
  );
};

export default Header;
