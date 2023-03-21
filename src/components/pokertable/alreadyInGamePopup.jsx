import axios from "axios";
import React from "react";
import { Button, Modal } from "react-bootstrap";

const AlreadyInGamePopup = ({ userInAnyGame, setUserInAnyGame }) => {

  const leaveTable = async () => {
    try {
      await axios({
        method: "get",
        url: `${userInAnyGame?.leaveTable}`,
      });
      setUserInAnyGame({ ...userInAnyGame, inGame: false })
    } catch (err) {
      console.log("Error in leave APi Call")
    }

  }
  const joinGame = () => {
    window.location.href = userInAnyGame.reJoinUrl
  }
  return (
    <Modal
      show={userInAnyGame?.inGame}
      centered
      className="friends-popup leave-confirm"
    >
      <Modal.Body>
        <div className="block">
          <p>You are already in a game!</p>
          <div className="sub-btn text-center d-flex justify-content-center">
            <Button
                className="grey-btn"
              onClick={() =>
                leaveTable()
              }
            >
              Leave
            </Button>
            <Button onClick={() => joinGame()}>Rejoin</Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default AlreadyInGamePopup;
