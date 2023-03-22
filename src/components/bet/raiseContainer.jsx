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
            />
            <BetRaise
                currentPlayer={currentPlayer}
                setBetRaise={setBetRaise}
                setAction={setAction}
                allinAction={allinAction}
                roomData={roomData}
                players={players}
            />
        </div>
    )
}

export default RaiseContainer