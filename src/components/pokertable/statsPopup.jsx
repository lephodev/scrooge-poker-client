/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
// import close from '../../assets/close.png';
// { useEffect }
const StatsPopup = ({ modalShow, handWinner, leaveTable, isWatcher }) => {

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (!isWatcher) {
  //       leaveTable();
  //     }
  //   }, 60000);
  // }, []);


  return (
    <>
      <Modal
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        show={modalShow}
        centered
        className='stats-popup'>
        <Modal.Body>
          <div className='stats-heading'>
            <h6>Table Stats</h6>
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
                    <tr key={`item-${ j }${ i }`}>
                      <td>{i + 1}</td>
                      <td>{winner.name}</td>
                      <td>{winner.winningAmount?.toFixed(2)}</td>
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
                leaveTable()
                  (window.location.href = `${ window.location.origin }`)
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
