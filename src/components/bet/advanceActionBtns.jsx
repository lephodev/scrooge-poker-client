import React from "react";
import { Form, Button } from "react-bootstrap";
// import RaiseView from "./raiseView";
// import RaiseSlider from "./raiseSlider";
import "./bet.css";

const AdvanceActionBtns = () => {
  return (
    <div className="advaceActionBtn-container">
      <div className="footer-btn ">
        <Button>
          <Form.Check
            name="bet"
            type="radio"
            label="Check/Fold"
            id="checkNfold"
          />
        </Button>
      </div>
      <div className="footer-btn ">
        <Button>
          <Form.Check name="bet" type="radio" label="Call any" id="call" />
        </Button>
      </div>
      <div className="footer-btn ">
        {/* {raise && ( */}
        {/* <div className="raiseBet-container">
            <RaiseSlider />
            <RaiseView
              // currentPlayer={currentPlayer}
              // setRaise={setRaise}
              // raiseAction={raiseAction}
              // allinAction={allinAction}
            />
          </div> */}
        {/* )} */}
        <Button
        //   onClick={() => {
        //     setBet(false);
        //     setRaise(true);
        //   }}
        >
          <Form.Check name="bet" type="radio" label="Raise" id="Raise" />
        </Button>
      </div>
    </div>
  );
};

export default AdvanceActionBtns;
