import React from "react";
import { Modal, Tooltip } from "react-bootstrap";

const FollowMe = ({ modalShow, setModalShow }) => {
  return (
    <Modal
      show={modalShow}
      onHide={() => setModalShow(false)}
      centered
      className="friends-popup stripe-confirmation-popup"
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="block">
          <RenderTooltip playerData={modalShow} />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default FollowMe;

const RenderTooltip = ({ playerData }) => {
  const {
    photoURI: playerImage,
    name,
    stats: { total, max, Level },
  } = playerData;

  return (
    <div id="button-tooltip" className="tootltip player-tooltip">
      <div className="tooltip-box">
        <h5>{name}</h5>
        <div className="tooltip-content">
          <img src={playerImage} alt="las-vegas-player" />
          <div className="player-details-content">
            <p>
              Level - <span>{Level}</span>
            </p>
            <p>
              Win - <span>{total.win}</span>
            </p>
            <p>
              Win ratio - <span>{total.wl_ratio.toFixed(2)}</span>
            </p>
          </div>
        </div>

        <p>
          Win coins - <span>{max.winCoins}</span>
        </p>
        <p>
          Game played - <span>{total.games}</span>
        </p>
      </div>
    </div>
  );
};
