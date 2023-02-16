import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import close from '../../assets/close.png';
import { socket } from '../../config/socketConnection';
import numFormatter from '../../utils/utils';

const WinHistoryPopup = ({ setModalShow, modalShow }) => {

  const [winnData, setWinnData] = useState([])

  useEffect(() => {
    socket.on("winner", (data) => {
      setWinnData(data?.updatedRoom)
    });
  }, [winnData])

  return (
    <>
      <Modal
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
        centered
        className='stats-popup'>
        <Modal.Body>
          <div className='stats-heading'>
            <h6>Table Stats</h6>
            <div className='close-icon'>
              <img
                src={close}
                alt='close'
                onClick={() => {
                  setModalShow(false);

                }}
              />
            </div>
          </div>
         <div className="stats-details">
            <div className="roomDetails"> <div className="roomDetails-titles">Room Name : <span>{winnData?.gameName}</span></div>
              <div className="roomDetails-titles">Big Blind : <span>{winnData?.bigBlind}</span></div>
              <div className="cummunityCards">
                <div>Cummunity Cards :</div>
                {winnData?.communityCard?.map((card, i) => (
                  <img key={i} src={`./cards/${card.toUpperCase()}.svg`} alt="card" />
                ))}
              </div>
              <div className="roomDetails-titles">Total Pot Amount : <span>{numFormatter(winnData?.pot)}</span></div>
              <div className="tablePlayerNames">Players Name. : <span className='tablePlayerNames-span'>{winnData?.players?.map((name, i) => (
                <div key={i} className={`tablePlaye${i}`}>{i + 1}.{" "}{name?.name}</div>
              ))}</span></div>
              <div className="roomDetails-titles">Last Player Action : <span>{winnData?.lastAction}</span></div></div>
            <h5>Winning Stats</h5>
            <div className="winningplayerDetails">

              {winnData?.winnerPlayer?.map((data, i) => (<>    <div className="roomDetails-titles">Player Name: <span>{data?.name}</span></div>
                <div className="roomDetails-titles">Hand Name : <span>{data?.handName || "opponent folded"}</span></div>
                <div className="roomDetails-titles">Winning Amount: <span>{numFormatter(data?.winningAmount)}</span></div>
                <div className="cummunityCards">
                  <div>Player Cards :</div>
                  {data?.winnerCards?.map((card, i) => (
                    <img key={i} src={`./cards/${card.toUpperCase()}.svg`} alt="card" />
                  ))}
                </div></>))}
            </div>
          </div>
          <div className='close-btn'>
            <Button
              onClick={() =>
                (window.location.href = `${window.location.origin}`)
              }>
              Back to lobby
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default WinHistoryPopup;
