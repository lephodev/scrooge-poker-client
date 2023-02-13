import React from "react";

const BetView = ({
  currentPlayer,
  setBet,
  betAction,
  allinAction,
  roomData,
  players,
}) => {
  return (
    <div className="bet-view">
      {roomData &&
        currentPlayer &&
        currentPlayer.wallet >=
          roomData.raiseAmount +
            ((roomData.pot || players.reduce((aa, el) => aa.pot + el.pot)) *
              25) /
              100 && (
          <span
            onClick={() => {
              betAction(
                roomData.raiseAmount +
                  ((roomData.pot ||
                    players.reduce((aa, el) => aa.pot + el.pot)) *
                    25) /
                    100
              );
              setBet(false);
            }}
          >
            25%
          </span>
        )}
      {roomData &&
        currentPlayer &&
        currentPlayer.wallet >=
          roomData.raiseAmount +
            ((roomData.pot || players.reduce((aa, el) => aa.pot + el.pot)) *
              33) /
              100 && (
          <span
            onClick={() => {
              betAction(
                roomData.raiseAmount +
                  ((roomData.pot ||
                    players.reduce((aa, el) => aa.pot + el.pot)) *
                    33) /
                    100
              );
              setBet(false);
            }}
          >
            33%
          </span>
        )}
      {roomData &&
        currentPlayer &&
        currentPlayer.wallet >=
          roomData.raiseAmount +
            ((roomData.pot || players.reduce((aa, el) => aa.pot + el.pot)) *
              50) /
              100 && (
          <span
            onClick={() => {
              betAction(
                roomData.raiseAmount +
                  ((roomData.pot ||
                    players.reduce((aa, el) => aa.pot + el.pot)) *
                    50) /
                    100
              );
              setBet(false);
            }}
          >
            50%
          </span>
        )}
      {roomData &&
        currentPlayer &&
        currentPlayer.wallet >=
          roomData.raiseAmount +
            ((roomData.pot || players.reduce((aa, el) => aa.pot + el.pot)) *
              67) /
              100 && (
          <span
            onClick={() => {
              betAction(
                roomData.raiseAmount +
                  ((roomData.pot ||
                    players.reduce((aa, el) => aa.pot + el.pot)) *
                    67) /
                    100
              );
              setBet(false);
            }}
          >
            67%
          </span>
        )}

      {roomData &&
        currentPlayer &&
        currentPlayer.wallet >=
          roomData.raiseAmount +
            ((roomData.pot || players.reduce((aa, el) => aa.pot + el.pot)) *
              75) /
              100 && (
          <span
            onClick={() => {
              betAction(
                roomData.raiseAmount +
                  ((roomData.pot ||
                    players.reduce((aa, el) => aa.pot + el.pot)) *
                    75) /
                    100
              );
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
