import React from "react";
import { Button, Modal } from "react-bootstrap";

const NewBuyInPopup = ({
  setBuyinPopup,
  buyinPopup,
  setModalShow,
  leaveTable,
}) => {
  return (
    <Modal show={buyinPopup} centered className="friends-popup leave-confirm">
      <Modal.Header></Modal.Header>
      <Modal.Body>
        <div className="block">
          <p>
            Your wallet balance is 0 <br /> Please add coin to play.
          </p>
          <div className="sub-btn text-center">
            <Button
              onClick={() => {
                leaveTable();
              }}
            >
              Leave Table
            </Button>
            <Button
              onClick={() => {
                setBuyinPopup(false);
                setModalShow(true);
              }}
            >
              Buy In
            </Button>

          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default NewBuyInPopup;
