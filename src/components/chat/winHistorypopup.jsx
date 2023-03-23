import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import close from '../../assets/close.png';
import numFormatter from '../../utils/utils';

const WinHistoryPopup = ({ setModalShow, modalShow, winPopupData }) => {

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
          {winPopupData?.map(winnData => (
            <div className="stats-details">

              <h5>Winning Stats: {winnData?.name}</h5>
              <div className="winningplayerDetails">

                <div className="roomDetails-titles">Player Name: <span>{winnData?.name}</span></div>
                <div className="roomDetails-titles">Hand Name : <span>{winnData?.handName || "opponent folded"}</span></div>
                <div className="cummunityCards">
                  <div>Cummunity Cards :</div>
                  {winnData?.communityCards?.length ? winnData?.communityCards?.map((card, i) => (
                    <img key={i} src={`./cards/${card.toUpperCase()}.svg`} alt="card" />
                  )) : <span>All Folded</span>}
                </div>
                <div className="roomDetails-titles">Winning Amount: <span>{numFormatter(winnData?.winningAmount)}</span></div>
                <div className="cummunityCards">
                  <div>Player Cards :</div>
                  {winnData?.winnerCards?.map((card, i) => (
                    <img key={i} src={`./cards/${card.toUpperCase()}.svg`} alt="card" />
                  ))}
                </div>
                <div className='cummunityCards'>
                  <div>Winner Hand:</div>
                  {winnData?.winnerHand?.length ? winnData?.winnerHand?.map((card, i) => (
                    <img key={i} src={`./cards/${card.toUpperCase()}.svg`} alt="card" />
                  )) : <span>All Folded</span>}
                </div>
              </div>
            </div>
          ))}

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
