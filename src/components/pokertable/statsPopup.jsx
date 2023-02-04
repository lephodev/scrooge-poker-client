import React, { useState, useEffect } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import close from '../../assets/close.png';
import { socket } from '../../config/socketConnection';

const StatsPopup = ({ setModalShow, modalShow, handWinner }) => {

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
          {handWinner ? <div className="stats-details">
            <div className="roomDetails"> <div className="roomDetails-titles">Room Name : <span>{winnData?.gameName}</span></div>
              <div className="roomDetails-titles">Big Blind : <span>{winnData?.bigBlind}</span></div>
              <div className="cummunityCards">
                <div>Cummunity Cards :</div>
                {winnData?.communityCard?.map((card, i) => (
                  <img key={i} src={`./cards/${card.toUpperCase()}.svg`} alt="card" />
                ))}
              </div>
              <div className="roomDetails-titles">Total Pot Amount : <span>{winnData?.pot}</span></div>
              <div className="tablePlayerNames">Players Name. : <span className='tablePlayerNames-span'>{winnData?.players?.map((name, i) => (
                <div key={i} className={`tablePlaye${i}`}>{i + 1}.{" "}{name?.name}</div>
              ))}</span></div>
              <div className="roomDetails-titles">Last Player Action : <span>{winnData?.lastAction}</span></div></div>
            <h5>Winning Stats</h5>
            <div className="winningplayerDetails">

              {winnData?.winnerPlayer?.map((data, i) => (<>    <div className="roomDetails-titles">Player Name: <span>{data?.name}</span></div>
                <div className="roomDetails-titles">Hand Name : <span>{data?.handName || "opponent folded"}</span></div>
                <div className="roomDetails-titles">Winning Amount: <span>{data?.winningAmount}</span></div>
                <div className="cummunityCards">
                  <div>Player Cards :</div>
                  {data?.winnerCards?.map((card, i) => (
                    <img key={i} src={`./cards/${card.toUpperCase()}.svg`} alt="card" />
                  ))}
                </div></>))}
            </div>
          </div>
            :
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Hand No.</th>
                  <th>Winnners</th>
                  <th>Win Amount</th>
                  <th>Winning Hands </th>
                </tr>
              </thead>
              <tbody>
                {handWinner &&
                  handWinner.map((round, i) => {
                    return round.map((winner, j) => (
                      <tr key={`item-${j}${i}`}>
                        <td>{i + 1}</td>
                        <td>{winner.name}</td>
                        <td>{winner.winningAmount}</td>
                        <td>
                          {winner.handName && winner.handWinner !== ''
                            ? winner.handName
                            : 'Winner before showdown'}
                        </td>
                      </tr>
                    ));
                  })}
              </tbody>
            </Table>
          }


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
export default StatsPopup;
