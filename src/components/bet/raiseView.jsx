import React from "react";

const RaiseView = ({
  currentPlayer,
  setRaise,
  raiseAction,
  allinAction,
  roomData,
  players,
  playersPot,
}) => {
  return (
    <div className="bet-view">
      {((roomData?.pot + playersPot) * 25) / 100 <= currentPlayer?.wallet &&
        ((roomData?.pot + playersPot) * 25) / 100 >= roomData.raiseAmount && (
          <span
            onClick={() => {
              raiseAction(
                Math.round(((roomData?.pot || playersPot) * 25) / 100)
              );
              setRaise(false);
            }}
          >
            25%
          </span>
        )}
      {((roomData?.pot + playersPot) * 33) / 100 <= currentPlayer?.wallet &&
        ((roomData?.pot + playersPot) * 33) / 100 >= roomData.raiseAmount && (
          <span
            onClick={() => {
              raiseAction(
                Math.round(((roomData?.pot || playersPot) * 33) / 100)
              );
              setRaise(false);
            }}
          >
            33%
          </span>
        )}
      {((roomData?.pot + playersPot) * 50) / 100 <= currentPlayer?.wallet &&
        ((roomData?.pot + playersPot) * 50) / 100 >= roomData.raiseAmount && (
          <span
            onClick={() => {
              raiseAction(
                Math.round(((roomData?.pot || playersPot) * 50) / 100)
              );
              setRaise(false);
            }}
          >
            50%
          </span>
        )}
      {((roomData?.pot + playersPot) * 67) / 100 <= currentPlayer?.wallet &&
        ((roomData?.pot + playersPot) * 67) / 100 >= roomData.raiseAmount && (
          <span
            onClick={() => {
              raiseAction(
                Math.round(((roomData?.pot || playersPot) * 67) / 100)
              );
              setRaise(false);
            }}
          >
            67%
          </span>
        )}
      {((roomData?.pot + playersPot) * 75) / 100 <= currentPlayer?.wallet &&
        ((roomData?.pot + playersPot) * 75) / 100 >= roomData.raiseAmount && (
          <span
            onClick={() => {
              raiseAction(
                Math.round(((roomData?.pot || playersPot) * 75) / 100)
              );
              setRaise(false);
            }}
          >
            75%
          </span>
        )}
      <span
        onClick={() => {
          allinAction();
          setRaise(false);
        }}
      >
        All in
      </span>
      <div
        className="close-bet"
        role="presentation"
        onClick={() => setRaise(false)}
      >
        x
      </div>
    </div>
  );
};

export default RaiseView;
