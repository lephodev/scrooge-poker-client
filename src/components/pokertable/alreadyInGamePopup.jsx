import axios from "axios";
import React from "react";
import { Button, Modal } from "react-bootstrap";

const AlreadyInGamePopup = ({userInAnyGame}) => {
    const leaveTable=async()=>{
      const leave=  await axios({
            method: "get",
            url: `${userInAnyGame?.leaveTable}`,
          });
       if(leave?.data?.success){
        userInAnyGame.inGame=false
       }   
    }
    const joinGame=()=>{
       window.location.href=userInAnyGame.reJoinUrl
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
