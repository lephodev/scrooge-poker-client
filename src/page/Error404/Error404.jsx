import React from "react";
import { Link } from "react-router-dom";
import error from "../../assets/images/error/404.svg";
import oops from "../../assets/images/error/Oops.svg";

import "./Error404.css";

function Error404() {
  return (
    <div className="error-page">
      <div className="requestNotFound">
        <img src={error} alt="error" />
        <img src={oops} alt="oops!" />
        <div className="errors-text">
          <div className="errorMssg">
            We can’t seem to find the page you’re looking for.
          </div>
          <div className="home-box wow animate__animated animate__fadeInUp">
            <Link className="play-btn" to="/">
              <span>Back to home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Error404;
