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
        currentPlayer.wallet * 0.25 && (
          <span
            onClick={() => {
              raiseAction(25);
              setRaise(false);
            }}
          >
            25%
          </span>
        )}
      {roomData &&
        currentPlayer &&
        currentPlayer.wallet * 0.33 && (
          <span
            onClick={() => {
              raiseAction(33);
              setRaise(false);
            }}
          >
            33%
          </span>
        )}
      {roomData &&
        currentPlayer &&
        currentPlayer.wallet * 0.50 && (
          <span
            onClick={() => {
              raiseAction(50);
              setRaise(false);
            }}
          >
            50%
          </span>
        )}
      {roomData &&
        currentPlayer &&
        currentPlayer.wallet *  0.67 && (
          <span
            onClick={() => {
              raiseAction(67);
              setRaise(false);
            }}
          >
             67%
          </span>
        )}
        {roomData &&
        currentPlayer &&
        currentPlayer.wallet *  0.75 && (
          <span
            onClick={() => {
              raiseAction(75);
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
