import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button, Modal, Table } from "react-bootstrap";

const PlayerList = ({show, tournament, setShowPlayerList, setSelectedTournament}) =>{

    const [players, setPlayers] = useState([]);
    console.log("Players list executed ", tournament)

    const handleHide = ()=>{
        setShowPlayerList(false);
        setSelectedTournament(null);
    }

    useEffect(()=>{
        setPlayers(tournament?.tournamentPlayers);
    }, [tournament?.tournamentPlayers]);

    return (
        <>
            <Modal show={show} onHide={handleHide} centered className="casino-popup">
                <Modal.Header closeButton>
                        </Modal.Header>
                <Modal.Body>
                    <Table striped bordered variant="dark" responsive>
                        <thead>
                            <tr>
                                <th>
                                    <p>Sr No.</p>
                                </th>
                                <th>
                                    <p>Profile</p>
                                </th>
                                <th>
                                    <p>Name</p>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                players?.map((el, i)=>(
                                    <tr>
                                        <td>{i + 1}</td>
                                        <td><img src={el.profile} alt={el.username} style={{width: "15%", height: "15%"}} /></td>
                                        <td>{el.username}</td>
                                    </tr>
                                ))
                            }
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
    )
}

export default PlayerList;
