import React from "react";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

const BetConfirmPopup = ({
    confirmPopup,
    setConfirmPopup,
  confirmBet,
  cancelBet,
  betAmount
}) => {
  const [clicked, setClicked] = useState(false);
  return (
    <Modal
      show={confirmPopup}
      onHide={() => {
        setConfirmPopup(false);
      }}
      centered
      className="friends-popup leave-confirm"
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="block">
          <p>Are sure you want to make bet with {betAmount} amount?</p>
          <div className="sub-btn text-center">
            <Button
              onClick={() => {
                confirmBet();
                setClicked(true);
              }}
              disabled={clicked}
            >
              Confirm
            </Button>
              <Button onClick={() => cancelBet()}>Cancel</Button>
           
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default BetConfirmPopup;
