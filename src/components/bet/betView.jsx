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
        ((roomData.pot ||
          players?.reduce((acc, obj) => {
            return acc + obj.pot;
          }, 0)) *
          25) /
          100 >=
          roomData.raiseAmount && (
          <span
            onClick={() => {
              betAction(
                ((roomData.pot ||
                  players?.reduce((acc, obj) => {
                    return acc + obj.pot;
                  }, 0)) *
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
        ((roomData.pot ||
          players?.reduce((acc, obj) => {
            return acc + obj.pot;
          }, 0)) *
          33) /
          100 >=
          roomData.raiseAmount && (
          <span
            onClick={() => {
              betAction(
                ((roomData.pot ||
                  players?.reduce((acc, obj) => {
                    return acc + obj.pot;
                  }, 0)) *
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
        ((roomData.pot ||
          players?.reduce((acc, obj) => {
            return acc + obj.pot;
          }, 0)) *
          50) /
          100 >=
          roomData.raiseAmount && (
          <span
            onClick={() => {
              betAction(
                ((roomData.pot ||
                  players?.reduce((acc, obj) => {
                    return acc + obj.pot;
                  }, 0)) *
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
        ((roomData.pot ||
          players?.reduce((acc, obj) => {
            return acc + obj.pot;
          }, 0)) *
          67) /
          100 >=
          roomData.raiseAmount && (
          <span
            onClick={() => {
              betAction(
                ((roomData.pot ||
                  players?.reduce((acc, obj) => {
                    return acc + obj.pot;
                  }, 0)) *
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
        ((roomData.pot ||
          players?.reduce((acc, obj) => {
            return acc + obj.pot;
          }, 0)) *
          75) /
          100 >=
          roomData.raiseAmount && (
          <span
            onClick={() => {
              betAction(
                ((roomData.pot ||
                  players?.reduce((acc, obj) => {
                    return acc + obj.pot;
                  }, 0)) *
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
