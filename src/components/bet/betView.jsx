import React from 'react'

const BetView = ({ currentPlayer, setBet, betAction, allinAction,roomData }) => {
    return (
      <div className="bet-view">
        {roomData &&
          currentPlayer &&
          roomData.raiseAmount <= currentPlayer.wallet && (
            <span
              onClick={() => {
                betAction(1);
                setBet(false);
              }}
            >
              1x
            </span>
          )}
        {roomData &&
          currentPlayer &&
          roomData.raiseAmount * 2 <= currentPlayer.wallet && (
            <span
              onClick={() => {
                betAction(2);
                setBet(false);
              }}
            >
              2x
            </span>
          )}
        {roomData &&
          currentPlayer &&
          roomData.raiseAmount * 4 <= currentPlayer.wallet && (
            <span
              onClick={() => {
                betAction(4);
                setBet(false);
              }}
            >
              4x
            </span>
          )}
        {roomData &&
          currentPlayer &&
          roomData.raiseAmount * 6 <= currentPlayer.wallet && (
            <span
              onClick={() => {
                betAction(6);
                setBet(false);
              }}
            >
              6x
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

export default BetView