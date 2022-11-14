import React from "react";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

const LeaveConfirmPopup = ({
  setLeaveConfirm,
  leaveConfirmShow,
  leaveTable,
  joinWatcher,
  isWatcher,
  joinGame,
  allowWatcher,
}) => {
  const [clicked, setClicked] = useState(false);
  return (
    <Modal
      show={leaveConfirmShow}
      onHide={() => {
        setLeaveConfirm(false);
      }}
      centered
      className="friends-popup leave-confirm"
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="block">
          <p>Are sure you want to leave the Table ?</p>
          <div className="sub-btn text-center">
            <Button
              onClick={() => {
                leaveTable();
                setClicked(true);
              }}
              disabled={clicked}
            >
              Leave
            </Button>
            {isWatcher ? (
              <Button onClick={() => joinGame()}>Join as Player</Button>
            ) : allowWatcher ? (
              <Button onClick={() => joinWatcher()}>Join as Watcher</Button>
            ) : (
              ""
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default LeaveConfirmPopup;
