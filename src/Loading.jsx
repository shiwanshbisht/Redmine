import React from "react";
import logo from "./koders.png";
function Loading() {
    return (
        <div
            style={{
                width: "350px",
                height: "350px",
                borderRadius: "200px",
                background: "#61dafb",
            }}>
            <img
                style={{ marginTop: "40px", width: "120px" }}
                src={logo}
                alt="logo"
            />
            <h1> Koders</h1>
            <h4>Your Vision, Our Kreation</h4>
        </div>
    );
}

export default Loading;
