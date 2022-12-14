import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import StripePayment from '../stripe/stripe';
import { socket } from '../../config/socketConnection';

const BuyInPopup = ({
  setModalShow,
  modalShow,
  userId,
  tableId,
  setNewJoinLowBalance,
  newJoinlowBalance,
  gameType,
  setBuyinPopup,
  exchangeRate,
}) => {
  useEffect(() => {
    socket.on('CoinsAdded', (data) => {
      if (data.userId === userId) {
        toast.success('Coins Added, wallet will update in new Hand', {
          id: 'A',
        });
      } else {
        toast.success(`${data.name} is Added ${data.amt} coins in his wallet`, {
          id: 'A',
        });
      }
    });
  }, [userId]);

  return (
    <Modal
      show={modalShow}
      onHide={() => {
        if (newJoinlowBalance) setBuyinPopup(true);
        setModalShow(false);
        if (newJoinlowBalance === 'fail')
          window.location.href = window.location.origin;
      }}
      centered
      className='buy-coins-modal friends-popup stripe-confirmation-popup'>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className='block'>
          <StripePayment
            userId={userId}
            tableId={tableId}
            setModalShow={setModalShow}
            setNewJoinLowBalance={setNewJoinLowBalance}
            newJoinlowBalance={newJoinlowBalance}
            gameType={gameType}
            exchangeRate={exchangeRate}
          />
          <div id='StripeApp'></div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default BuyInPopup;
