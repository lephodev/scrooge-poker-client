import React from "react";

const RaiseView = ({
  currentPlayer,
  setRaise,
  raiseAction,
  allinAction,
  roomData,
  players,
}) => {
  let playersPot;
  switch (roomData?.runninground) {
    case 0:
      playersPot = roomData.players?.reduce((a, b) => a + b.pot, 0);
      break;
    case 1:
      playersPot = roomData.preflopround?.reduce((a, b) => a + b.pot, 0);
      break;
    case 2:
      playersPot = roomData.flopround?.reduce((a, b) => a + b.pot, 0);
      break;
    case 3:
      playersPot = roomData.turnround?.reduce((a, b) => a + b.pot, 0);
      break;
    case 4:
      playersPot = roomData.riverround?.reduce((a, b) => a + b.pot, 0);
      break;
    default:
      playersPot = players?.reduce((a, b) => a + b.pot, 0);
  }
  return (
    <div className="bet-view">
      {((roomData?.pot || playersPot) * 25) / 100 <= currentPlayer?.wallet &&
        ((roomData.pot || playersPot) * 25) / 100 >= roomData.raiseAmount && (
          <span
            onClick={() => {
              raiseAction(((roomData.pot || playersPot) * 25) / 100);
              setRaise(false);
            }}
          >
            25%
          </span>
        )}
      {((roomData?.pot || playersPot) * 33) / 100 <= currentPlayer?.wallet &&
        ((roomData.pot || playersPot) * 33) / 100 >= roomData.raiseAmount && (
          <span
            onClick={() => {
              raiseAction(((roomData.pot || playersPot) * 33) / 100);
              setRaise(false);
            }}
          >
            33%
          </span>
        )}
      {((roomData?.pot || playersPot) * 50) / 100 <= currentPlayer?.wallet &&
        ((roomData.pot || playersPot) * 50) / 100 >= roomData.raiseAmount && (
          <span
            onClick={() => {
              raiseAction(((roomData.pot || playersPot) * 50) / 100);
              setRaise(false);
            }}
          >
            50%
          </span>
        )}
      {((roomData?.pot || playersPot) * 67) / 100 <= currentPlayer?.wallet &&
        ((roomData.pot || playersPot) * 67) / 100 >= roomData.raiseAmount && (
          <span
            onClick={() => {
              raiseAction(((roomData.pot || playersPot) * 67) / 100);
              setRaise(false);
            }}
          >
            67%
          </span>
        )}
      {((roomData?.pot || playersPot) * 75) / 100 <= currentPlayer?.wallet &&
        ((roomData.pot || playersPot) * 75) / 100 >= roomData.raiseAmount && (
          <span
            onClick={() => {
              raiseAction(((roomData.pot || playersPot) * 75) / 100);
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
