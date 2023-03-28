import React from 'react'
import { Button } from 'react-bootstrap';

const BetRaise = ({ currentPlayer,
    setBetRaise,
    setAction,
    allinAction,
    roomData,
    remainingTime,
    players, }) => {
    let playersPot;
    switch (roomData?.runninground) {
        case 1:
            playersPot = roomData.preflopround?.reduce((a, b) => a + b.pot, 0);
            break;
        case 2:
            playersPot = roomData.flopround?.reduce((a, b) => a + b.pot, 0);
            break;
        case 3:
            playersPot = roomData.turnround?.reduce((a, b) => a + b.pot, 0);
            break;
        case 4:
            playersPot = roomData.riverround?.reduce((a, b) => a + b.pot, 0);
            break;
        default:
            playersPot = players?.reduce((a, b) => a + b.pot, 0);
    }
    return (
        <div className="bet-view">
            {((roomData?.pot + playersPot) * 25) / 100 <= currentPlayer?.wallet &&
                ((roomData.pot + playersPot) * 25) / 100 >= roomData.raiseAmount *2 && (
                    <Button
                    disabled={remainingTime <=1}
                        onClick={() => {
                            setAction(((roomData.pot + playersPot) * 25) / 100);
                            setBetRaise(false);
                        }}
                    >
                        25%
                    </Button>
                )}
            {((roomData?.pot + playersPot) * 33) / 100 <= currentPlayer?.wallet &&
                ((roomData.pot + playersPot) * 33) / 100 >= roomData.raiseAmount * 2 && (
                    <Button
                    disabled={remainingTime <=1}
                        onClick={() => {
                            setAction(((roomData.pot + playersPot) * 33) / 100);
                            setBetRaise(false);
                        }}
                    >
                        33%
                    </Button>
                )}
            {((roomData?.pot + playersPot) * 50) / 100 <= currentPlayer?.wallet &&
                ((roomData.pot + playersPot) * 50) / 100 >= roomData.raiseAmount * 2 && (
                    <Button
                    disabled={remainingTime <=1}
                        onClick={() => {
                            setAction(((roomData.pot + playersPot) * 50) / 100);
                            setBetRaise(false);
                        }}
                    >
                        50%
                    </Button>
                )}
            {((roomData?.pot + playersPot) * 67) / 100 <= currentPlayer?.wallet &&
                ((roomData.pot + playersPot) * 67) / 100 >= roomData.raiseAmount * 2 && (
                    <Button
                    disabled={remainingTime <=1}
                        onClick={() => {
                            setAction(((roomData.pot + playersPot) * 67) / 100);
                            setBetRaise(false);
                        }}
                    >
                        67%
                    </Button>
                )}

            {((roomData?.pot + playersPot) * 75) / 100 <= currentPlayer?.wallet &&
                ((roomData.pot + playersPot) * 75) / 100 >= roomData.raiseAmount * 2 && (
                    <Button
                    disabled={remainingTime <=1}
                        onClick={() => {
                            setAction(((roomData.pot + playersPot) * 75) / 100);
                            setBetRaise(false);
                        }}
                    >
                        75%
                    </Button>
                )}
            <Button
            disabled={remainingTime <=1}
                onClick={() => {
                    allinAction();
                    setBetRaise(false);
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
        </div>
    )
}

export default BetRaise