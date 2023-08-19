import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
// import BetConfirmPopup from './betConfirmationPopup'

const BetRaise = ({
  currentPlayer,
  setBetRaise,
  setAction,
  allinAction,
  roomData,
  remainingTime,
  players,
}) => {
  let playersPot
  const [confirmPopup, setConfirmPopup] = useState(false)
  const [betAmount, setBetAmount] = useState(0)
  switch (roomData?.runninground) {
    case 1:
      playersPot = roomData.preflopround?.reduce((a, b) => a + b.pot, 0)
      break
    case 2:
      playersPot = roomData.flopround?.reduce((a, b) => a + b.pot, 0)
      break
    case 3:
      playersPot = roomData.turnround?.reduce((a, b) => a + b.pot, 0)
      break
    case 4:
      playersPot = roomData.riverround?.reduce((a, b) => a + b.pot, 0)
      break
    default:
      playersPot = players?.reduce((a, b) => a + b.pot, 0)
  }
  const getConfirmation = (percentAmt) => {
    setBetAmount(percentAmt)
    setConfirmPopup(true)
  }
  const confirmBet = () => {
    setAction(betAmount)
    setBetRaise(false)
    setBetAmount(0)
  }
  const cancelBet = () => {
    setConfirmPopup(false)
  }
  return (
    <div className="bet-view">
      {((roomData?.pot + playersPot) * 25) / 100 <= currentPlayer?.wallet &&
        ((roomData.pot + playersPot) * 25) / 100 >=
        roomData.raiseAmount * 2 && (
          <Button
            disabled={remainingTime <= 0}
            onClick={() => {
              getConfirmation(((roomData.pot + playersPot) * 25) / 100)
              // setAction(((roomData.pot + playersPot) * 25) / 100);
              // setBetRaise(false);
            }}
          >
            25%
          </Button>
        )}
      {/* {((roomData?.pot + playersPot) * 33) / 100 <= currentPlayer?.wallet &&
        ((roomData.pot + playersPot) * 33) / 100 >=
        roomData.raiseAmount * 2 && (
          <Button
            disabled={remainingTime <= 1}
            onClick={() => {
              getConfirmation(((roomData.pot + playersPot) * 33) / 100)
              //   setAction(((roomData.pot + playersPot) * 33) / 100)
              //   setBetRaise(false)
            }}
          >
            33%
          </Button>
        )} */}
      {((roomData?.pot + playersPot) * 50) / 100 <= currentPlayer?.wallet &&
        ((roomData.pot + playersPot) * 50) / 100 >=
        roomData.raiseAmount * 2 && (
          <Button
            disabled={remainingTime <=0}
            onClick={() => {
              getConfirmation(((roomData.pot + playersPot) * 50) / 100)
              //   setAction(((roomData.pot + playersPot) * 50) / 100)
              //   setBetRaise(false)
            }}
          >
            50%
          </Button>
        )}
      {/* {((roomData?.pot + playersPot) * 67) / 100 <= currentPlayer?.wallet &&
        ((roomData.pot + playersPot) * 67) / 100 >=
        roomData.raiseAmount * 2 && (
          <Button
            disabled={remainingTime <= 1}
            onClick={() => {
              getConfirmation(((roomData.pot + playersPot) * 67) / 100)
              //   setAction(((roomData.pot + playersPot) * 67) / 100)
              //   setBetRaise(false)
            }}
          >
            67%
          </Button>
        )} */}

      {((roomData?.pot + playersPot) * 75) / 100 <= currentPlayer?.wallet &&
        ((roomData.pot + playersPot) * 75) / 100 >=
        roomData.raiseAmount * 2 && (
          <Button
            disabled={remainingTime <= 0}
            onClick={() => {
              getConfirmation(((roomData.pot + playersPot) * 75) / 100)
              //   setAction(((roomData.pot + playersPot) * 75) / 100)
              //   setBetRaise(false)
            }}
          >
            75%
          </Button>
        )}
      <Button
        disabled={remainingTime <= 0}
        onClick={() => {
          allinAction()
          setBetRaise(false)
        }}
      >
        All in
      </Button>
      <div
        className="close-bet"
        role="presentation"
        onClick={() => setBetRaise(false)}
      >
        x
      </div>
      {confirmPopup && <BetConfirmPopup
        confirmBet={confirmBet}
        cancelBet={cancelBet}
        betAmount={betAmount}
      />}

    </div>
  )
}

export default BetRaise

const BetConfirmPopup = ({
  confirmBet,
  cancelBet,
  betAmount
}) => {
  const [clicked, setClicked] = useState(false);
  return (
    <div className="betConfirmPopup block">
      <p>Bet: {Math.ceil(betAmount)}</p>
      <div className="sub-btn text-center">
        <Button onClick={() => cancelBet()}>Cancel</Button>
        <Button
          onClick={() => {
            confirmBet();
            setClicked(true);
          }}
          disabled={clicked}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};