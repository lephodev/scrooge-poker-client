import React from "react";

const RaiseView = ({
  currentPlayer,
  setRaise,
  raiseAction,
  allinAction,
  roomData,
  players,
}) => {
  return (
    <div className="bet-view">
      {roomData &&
        currentPlayer &&
        (players?.reduce((acc, obj) => {
          return acc + obj.pot;
        }, 0) <= currentPlayer?.wallet ||
          roomData.pot <= currentPlayer?.wallet) &&
        ((roomData?.pot ||
          players?.reduce((acc, obj) => {
            return acc + obj.pot;
          }, 0)) *
          25) /
          100 >=
          roomData.raiseAmount && (
          <span
            onClick={() => {
              raiseAction(
                ((roomData.pot ||
                  players?.reduce((acc, obj) => {
                    return acc + obj.pot;
                  }, 0)) *
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
        (players?.reduce((acc, obj) => {
          return acc + obj.pot;
        }, 0) <= currentPlayer?.wallet ||
          roomData.pot <= currentPlayer?.wallet) &&
        ((roomData?.pot ||
          players?.reduce((acc, obj) => {
            return acc + obj.pot;
          }, 0)) *
          33) /
          100 >=
          roomData.raiseAmount && (
          <span
            onClick={() => {
              raiseAction(
                ((roomData?.pot ||
                  players?.reduce((acc, obj) => {
                    return acc + obj.pot;
                  }, 0)) *
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
        (players?.reduce((acc, obj) => {
          return acc + obj.pot;
        }, 0) <= currentPlayer?.wallet ||
          roomData?.pot <= currentPlayer?.wallet) &&
        ((roomData?.pot ||
          players?.reduce((acc, obj) => {
            return acc + obj.pot;
          }, 0)) *
          50) /
          100 >=
          roomData.raiseAmount && (
          <span
            onClick={() => {
              raiseAction(
                ((roomData?.pot ||
                  players?.reduce((acc, obj) => {
                    return acc + obj.pot;
                  }, 0)) *
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
        (players?.reduce((acc, obj) => {
          return acc + obj.pot;
        }, 0) <= currentPlayer?.wallet ||
          roomData?.pot <= currentPlayer?.wallet) &&
        ((roomData.pot ||
          players?.reduce((acc, obj) => {
            return acc + obj.pot;
          }, 0)) *
          67) /
          100 >=
          roomData.raiseAmount && (
          <span
            onClick={() => {
              raiseAction(
                ((roomData.pot ||
                  players.reduce((acc, obj) => {
                    return acc + obj.pot;
                  }, 0)) *
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
        (players?.reduce((acc, obj) => {
          return acc + obj.pot;
        }, 0) <= currentPlayer.wallet ||
          roomData?.pot <= currentPlayer?.wallet) &&
        ((roomData?.pot ||
          players?.reduce((acc, obj) => {
            return acc + obj.pot;
          }, 0)) *
          75) /
          100 >=
          roomData.raiseAmount && (
          <span
            onClick={() => {
              raiseAction(
                ((roomData?.pot ||
                  players?.reduce((acc, obj) => {
                    return acc + obj.pot;
                  }, 0)) *
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
