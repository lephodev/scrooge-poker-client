import React from 'react'

const BetView = ({ currentPlayer, setBet, betAction, allinAction,roomData }) => {
    return (
     <div className="bet-view">
      {roomData &&
        currentPlayer &&
        currentPlayer.wallet * 0.25 && (
          <span
            onClick={() => {
              betAction(25);
              setBet(false);
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
              betAction(33);
              setBet(false);
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
              betAction(50);
              setBet(false);
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
              betAction(67);
              setBet(false);
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
              betAction(75);
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
      {/* <div
        className="close-bet"
        role="presentation"
        onClick={() => setBet(false)}
      >
        x
      </div> */}
    </div>
  );
  };

export default BetView