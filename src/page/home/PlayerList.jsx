import React, { useState, useEffect } from "react";
import { Button, Modal, Table } from "react-bootstrap";

const PlayerList = ({
  show,
  tournament,
  setShowPlayerList,
  setSelectedTournament,
}) => {
  const [players, setPlayers] = useState([]);
  console.log("Players list executed ", tournament);

  const handleHide = () => {
    setShowPlayerList(false);
    setSelectedTournament(null);
  };

  useEffect(() => {
    setPlayers(tournament?.tournamentPlayers);
  }, [tournament?.tournamentPlayers]);

  return (
    <>
      <Modal
        show={show}
        onHide={handleHide}
        centered
        className="casino-popup participant-list"
      >
        <Modal.Header closeButton>Participant List </Modal.Header>
        <Modal.Body>
          <Table striped bordered variant="dark" responsive>
            <thead>
              <tr>
                <th style={{ maxWidth: "60px" }}>
                  <p>Sr No.</p>
                </th>

                <th>
                  <p>Name</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {players?.map((el, i) => (
                <tr key={i + 1}>
                  <td style={{ maxWidth: "60px" }}>{i + 1}</td>
                  <td>
                    <img
                      src={el.profile}
                      alt={el.username}
                      className="participant-avtar"
                    />
                    {el.username}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PlayerList;
