import React from "react";

const RaiseView = ({
  currentPlayer,
  setRaise,
  raiseAction,
  allinAction,
  roomData,
}) => {
  return (
    <div className="bet-view">
      {roomData &&
        currentPlayer &&
        currentPlayer.wallet >= roomData.raiseAmount * 2 && (
          <span
            onClick={() => {
              raiseAction(2);
              setRaise(false);
            }}
          >
            2%
          </span>
        )}
      {roomData &&
        currentPlayer &&
        currentPlayer.wallet >= roomData.raiseAmount * 4 && (
          <span
            onClick={() => {
              raiseAction(4);
              setRaise(false);
            }}
          >
            4%
          </span>
        )}
      {roomData &&
        currentPlayer &&
        currentPlayer.wallet >= roomData.raiseAmount * 6 && (
          <span
            onClick={() => {
              raiseAction(6);
              setRaise(false);
            }}
          >
            6%
          </span>
        )}
      {roomData &&
        currentPlayer &&
        currentPlayer.wallet >= roomData.raiseAmount * 8 && (
          <span
            onClick={() => {
              raiseAction(8);
              setRaise(false);
            }}
          >
            8%
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
      {/* <div
        className="close-bet"
        role="presentation"
        onClick={() => setRaise(false)}
      >
        x
      </div> */}
    </div>
  );
};

export default RaiseView;
