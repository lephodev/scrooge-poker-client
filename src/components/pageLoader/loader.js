import React from "react";
import poker from "../../assets/Loader.png";
import "./loader.css";

function Loader() {
  return (
    <div className='page-loader'>
      <div className='pageImgContainer'>
        <img src={poker} alt='game' className='imageAnimation' />
      </div>
    </div>
  );
}
export default Loader;
