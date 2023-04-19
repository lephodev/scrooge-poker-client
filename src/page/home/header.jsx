import React,{useState,useEffect} from 'react'
import numFormatter from "../../utils/utils";
import token from "../../assets/coin.png";
import tickets from "../../assets/tickets.png";
import gold from "../../assets/gold.png";
import { Button, Form, OverlayTrigger } from "react-bootstrap";
import { Tooltip } from "react-bootstrap";
import logo from "../../assets/game/logo.png";
import { FaQuestionCircle } from "react-icons/fa";
import { landingClient,domain } from '../../config/keys';
import cookie from "js-cookie";
import { getCookie } from '../../utils/cookieUtil';


const Header = ({ userData, handleShow }) => {
    const [mode, setMode] = useState("");


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
          cookie.set("mode",gameMode, {domain: domain,
          path: "/",
          httpOnly: false, });
          setMode(getCookie('mode'))
        } catch (error) {
          console.log("error",error);
        }
      }             
      
      useEffect(() => {
        let getMode=getCookie('mode')
        if(getMode){
          setMode(getMode)
        }
        else {
          cookie.set("mode","token", {domain: domain,
            path: "/",
            httpOnly: false, });
            setMode(getCookie('mode'))
        }
       
      }, [mode])

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
                        <a href={`${landingClient}profile`}>
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
                            <div className="pokerWallet-box">
                                <img src={gold} alt="" className="pokerWallet" />
                                <span>{numFormatter(userData?.goldCoin || 0)}</span>
                                <OverlayTrigger
                                    placement={window.innerWidth < 767 ? "right" : "left"}
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderGold}
                                >
                                    <Button variant="success">
                                        <FaQuestionCircle />
                                    </Button>
                                </OverlayTrigger>
                            </div>
                        </div>
                        <div className="slotLobby-mode">
                            <p>Mode:</p>
                            <div className="mode-labels">
                                <h6>GC</h6>
                                <Form className='formMode'>
                                <Form.Check type="switch" id="custom-switch" checked={mode === "token" ? true : false} onChange={handleModeChange} />
                                </Form>
                                <h6>Token</h6>
                            </div>
                        </div>
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