import React from "react";

const BetView = ({
  currentPlayer,
  setBet,
  betAction,
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
              betAction(Math.round(((roomData?.pot || playersPot) * 25) / 100));
              setBet(false);
            }}
          >
            25%
          </span>
        )}
      {((roomData?.pot + playersPot) * 33) / 100 <= currentPlayer?.wallet &&
        ((roomData?.pot + playersPot) * 33) / 100 >= roomData.raiseAmount && (
          <span
            onClick={() => {
              betAction(Math.round(((roomData?.pot || playersPot) * 33) / 100));
              setBet(false);
            }}
          >
            33%
          </span>
        )}
      {((roomData?.pot + playersPot) * 50) / 100 <= currentPlayer?.wallet &&
        ((roomData?.pot + playersPot) * 50) / 100 >= roomData.raiseAmount && (
          <span
            onClick={() => {
              betAction(Math.round(((roomData?.pot || playersPot) * 50) / 100));
              setBet(false);
            }}
          >
            50%
          </span>
        )}
      {((roomData?.pot + playersPot) * 67) / 100 <= currentPlayer?.wallet &&
        ((roomData?.pot + playersPot) * 67) / 100 >= roomData.raiseAmount && (
          <span
            onClick={() => {
              betAction(Math.round(((roomData?.pot || playersPot) * 67) / 100));
              setBet(false);
            }}
          >
            67%
          </span>
        )}

      {((roomData?.pot + playersPot) * 75) / 100 <= currentPlayer?.wallet &&
        ((roomData?.pot + playersPot) * 75) / 100 >= roomData.raiseAmount && (
          <span
            onClick={() => {
              betAction(Math.round(((roomData?.pot || playersPot) * 75) / 100));
              setBet(false);
            }}
          >
            75%
          </span>
        )}
      <span
        onClick={() => {
          allinAction();
          setBet(false);
        }}
      >
        All in
      </span>
      <div
        className="close-bet"
        role="presentation"
        onClick={() => setBet(false)}
      >
        x
      </div>
    </div>
  );
};

export default BetView;
