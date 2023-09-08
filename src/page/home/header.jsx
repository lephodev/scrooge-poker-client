import React, { useEffect, /* useState */ } from 'react'
import numFormatter from "../../utils/utils";
import token from "../../assets/images/sweep.png";
import { /* FaArrowsAltH */ FaPlusCircle } from "react-icons/fa";
// import tickets from "../../assets/tickets.png";
import gold from "../../assets/images/goldCoin.png";
import { Button, Form, OverlayTrigger } from "react-bootstrap";
import { Tooltip } from "react-bootstrap";
import logo from "../../assets/game/logo.png";
import { FaQuestionCircle } from "react-icons/fa";
import { landingClient, domain, marketPlaceUrl } from '../../config/keys';
import cookie from "js-cookie";
import { getCookie } from '../../utils/cookieUtil';
// import TicketTotoken from './ticketToToken';


const Header = ({ userData, handleShow, mode, setMode, setUserData }) => {
    // const [ticketToToken, setTicketToToekn] = useState(false);

    const renderWallet = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            This is your token balance, and can be used for betting.
        </Tooltip>
    );
    // const renderTicket = (props) => (
    //     <Tooltip id="button-tooltip" {...props}>
    //         This is your ticket balance and can be redeemed for prizes.
    //     </Tooltip>
    // );
    const renderGold = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            This gold coins is for fun play.
        </Tooltip>
    );

    const handleModeChange = async (e) => {
        try {
            const { target: { checked } } = e;
            // setMode(checked);
            let gameMode = checked ? "token" : "goldCoin"
            cookie.set("mode", gameMode, {
                domain: domain,
                path: "/",
                httpOnly: false,
            });
            setMode(getCookie('mode'))
        } catch (error) {
            console.log("error", error);
        }
    }

    useEffect(() => {
        const getMode = getCookie("mode");
        if (getMode) {
            setMode(getMode);
        } else {
            cookie.set("mode", "goldCoin", {
                domain: domain,
                path: "/",
                httpOnly: false,
            });
            setMode("goldCoin");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // const handleTicketTotoken = () => {
    //     setTicketToToekn(!ticketToToken);
    // };
    return (
        <div className="user-header">
            <div className="container">
                <div className="user-header-grid">
                    <div className="casino-logo">
                        <a href={landingClient}>
                            <img src={logo} alt="" />
                        </a>
                    </div>
                    <div className="headerMode-container">
                        <div className={`slotLobby-mode ${ mode }`}>
                            <Form>
                                {/* <Form.Check
                      type="switch"
                      id="custom-switch"
                      label={
                        mode === "token"
                          ? `ST: ${numFormatter(userData?.wallet)}`
                          : `GC: ${numFormatter(userData?.goldCoin)}`
                      }
                      defaultChecked={mode === "token"}
                      onChange={handleModeChange}
                    /> */}
                                <input type="checkbox" id="switch" checked={mode === "token"} defaultChecked={mode === "token"} className='form-check-input' onChange={handleModeChange} /><label for="switch">Toggle</label>
                                <span>{
                                    mode === "token"
                                        ? `ST: ${ numFormatter(userData?.wallet) }`
                                        : `GC: ${ numFormatter(userData?.goldCoin) }`
                                }</span>
                                <Button className="purchase-btn">
                                    <a
                                        href={`${ marketPlaceUrl }/crypto-to-gc`}
                                        rel="noreferrer"
                                    >
                                        <FaPlusCircle />
                                    </a>
                                </Button>
                            </Form>
                        </div>
                        {/* <div className="tickets-token">
                  <Button
                    className="btn btn-primary"
                    disabled={userData?.ticket < 10}
                    onClick={handleTicketTotoken}
                  >
                    <img src={tickets} alt="" /> <span>Ticket</span>{" "}
                    <FaArrowsAltH /> <img src={token} alt="" />{" "}
                    <span>Token</span>
                  </Button>
                  <TicketTotoken
                    user={userData}
                    show={ticketToToken}
                    handleClose={handleTicketTotoken}
                    setUser={setUserData}
                  />
                </div> */}
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
                                    placement={window.innerWidth < 767 ? "bottom" : "left"}
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderWallet}
                                >
                                    <Button variant="success">
                                        <FaQuestionCircle />
                                    </Button>
                                </OverlayTrigger>
                            </div>
                            <div className="pokerWallet-box">
                                {/* <img src={tickets} alt="" className="pokerWallet" /> */}
                                {/* <span>{numFormatter(userData?.ticket || 0)}</span> */}
                                {/* <OverlayTrigger
                                    placement={window.innerWidth < 767 ? "bottom" : "left"}
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderTicket}
                                >
                                    <Button variant="success">
                                        <FaQuestionCircle />
                                    </Button>
                                </OverlayTrigger> */}
                            </div>
                            <div className="pokerWallet-box">
                                <img src={gold} alt="" className="pokerWallet" />
                                <span>{numFormatter(userData?.goldCoin || 0)}</span>
                                <OverlayTrigger
                                    placement={window.innerWidth < 767 ? "bottom" : "left"}
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderGold}
                                >
                                    <Button variant="success">
                                        <FaQuestionCircle />
                                    </Button>
                                </OverlayTrigger>
                            </div>
                        </div>
                        {/* <div className="slotLobby-mode">
                            <p>Mode:</p>
                            <div className="mode-labels">
                                <h6>GC</h6>
                                <Form className='formMode'>
                                    <Form.Check type="switch" id="custom-switch" checked={mode === "token" ? true : false} onChange={handleModeChange} />
                                </Form>
                                <h6>Token</h6>
                            </div>
                        </div> */}
                        <button
                            type="button"
                            className="create-game-boxBtn"
                            onClick={handleShow}
                        >
                            Create Game
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Header