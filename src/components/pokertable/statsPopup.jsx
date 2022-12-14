import React from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import close from '../../assets/close.png';

const StatsPopup = ({ setModalShow, modalShow, handWinner }) => {
  return (
    <Modal
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      show={modalShow}
      onHide={() => {
        setModalShow(false);
        window.location.href = `${window.location.origin}`;
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
                window.location.href = `${window.location.origin}`;
              }}
            />
          </div>
        </div>
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
        <div className='close-btn'>
          <Button
            onClick={() =>
              (window.location.href = `${window.location.origin}`)
            }>
            Close
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default StatsPopup;
