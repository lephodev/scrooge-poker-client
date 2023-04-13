import React from 'react'
import numFormatter from "../../utils/utils";
import token from "../../assets/coin.png";
import tickets from "../../assets/tickets.png";
import { Button, OverlayTrigger } from "react-bootstrap";
import { Tooltip } from "react-bootstrap";
import logo from "../../assets/game/logo.png";
import { FaQuestionCircle } from "react-icons/fa";
import { landingClient } from '../../config/keys';

const Header = ({ userData, handleShow }) => {
    const renderWallet = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            This is your token balance, and can be used for betting.
        </Tooltip>
    );
    const renderTicket = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            This is your ticket balance and can be redeemed for prizes.
        </Tooltip>
    );

    return (
        <div className="user-header">
            <div className="container">
                <div className="user-header-grid">
                    <div className="casino-logo">
                        <a href={landingClient}>
                            <img src={logo} alt="" />
                        </a>
                    </div>
                    <div className="create-game-box">
                        <a href={`${ landingClient }profile`}>
                            <div className="create-game-box-avtar">
                                <img
                                    src={
                                        userData?.profile ||
                                        "https://i.pinimg.com/736x/06/d0/00/06d00052a36c6788ba5f9eeacb2c37c3.jpg"
                                    }
                                    alt=""
                                />
                                <h5>{userData?.username}</h5>
                            </div>
                        </a>
                        <div className="walletTicket-box">
                            <div className="pokerWallet-box">
                                <img src={token} alt="" className="pokerWallet" />
                                <span>{numFormatter(userData?.wallet || 0)}</span>
                                <OverlayTrigger
                                    placement={window.innerWidth < 767 ? "right" : "left"}
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderWallet}
                                >
                                    <Button variant="success">
                                        <FaQuestionCircle />
                                    </Button>
                                </OverlayTrigger>
                            </div>
                            <div className="pokerWallet-box">
                                <img src={tickets} alt="" className="pokerWallet" />
                                <span>{numFormatter(userData?.ticket || 0)}</span>
                                <OverlayTrigger
                                    placement={window.innerWidth < 767 ? "right" : "left"}
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderTicket}
                                >
                                    <Button variant="success">
                                        <FaQuestionCircle />
                                    </Button>
                                </OverlayTrigger>
                            </div>
                        </div>
                        {/* <button
                            type="button"
                            className="create-game-boxBtn"
                            onClick={handleShow}
                        >
                            Create Game
                        </button> */}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Header