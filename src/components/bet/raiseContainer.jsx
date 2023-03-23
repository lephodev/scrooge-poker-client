import React from 'react'
import BetRaise from './betRaise'
import RaiseSlider from './raiseSlider'

const RaiseContainer = ({ currentPlayer, SliderAction, roomData, setBetRaise, setAction, allinAction, players, remainingTime }) => {
    return (
        <div className="raiseBet-container">
            <RaiseSlider
                currentPlayer={currentPlayer}
                SliderAction={SliderAction}
                roomData={roomData}
                remainingTime={remainingTime}
            />
            <BetRaise
                currentPlayer={currentPlayer}
                setBetRaise={setBetRaise}
                setAction={setAction}
                allinAction={allinAction}
                roomData={roomData}
                players={players}
                remainingTime={remainingTime}
            />
        </div>
    )
}

export default RaiseContainer