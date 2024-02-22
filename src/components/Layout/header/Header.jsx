import React, { useState, useEffect } from "react";
import './Header.css';

const Header = () => {
    const [time, setTime] = useState(new Date);

    useEffect(() => {
        const intervall = setInterval(() => {
            setTime(new Date());
        }, 1000); // update time once per second

        return () => clearInterval(intervall);
    },[])

    return (
        <div className="header">
            <h1> Todoify </h1>
            <div> {time.getHours()}:{time.getMinutes()}:{time.getSeconds()} </div>
        </div>
    );
}

export default Header; 