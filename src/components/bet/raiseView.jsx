import React from "react";

const RaiseView = ({
  currentPlayer,
  setRaise,
  raiseAction,
  allinAction,
  roomData,
  players,
}) => {
  console.log("Players", players);
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
              raiseAction(
                roomData.raiseAmount +
                  ((roomData.pot ||
                    players.reduce((aa, el) => aa.pot + el.pot)) *
                    25) /
                    100
              );
              setRaise(false);
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
              raiseAction(
                roomData.raiseAmount +
                  ((roomData.pot ||
                    players.reduce((aa, el) => aa.pot + el.pot)) *
                    33) /
                    100
              );
              setRaise(false);
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
              raiseAction(
                roomData.raiseAmount +
                  ((roomData.pot ||
                    players.reduce((aa, el) => aa.pot + el.pot)) *
                    50) /
                    100
              );
              setRaise(false);
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
              raiseAction(
                roomData.raiseAmount +
                  ((roomData.pot ||
                    players.reduce((aa, el) => aa.pot + el.pot)) *
                    67) /
                    100
              );
              setRaise(false);
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
              raiseAction(
                roomData.raiseAmount +
                  ((roomData.pot ||
                    players.reduce((aa, el) => aa.pot + el.pot)) *
                    75) /
                    100
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
