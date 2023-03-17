/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import "animate.css";
import ProgressBar from "react-bootstrap/ProgressBar";
import "react-circular-progressbar/dist/styles.css";
import front from "../../assets/game/Black-Card.png";
import back from "../../assets/game/Black-Card.png";
import back2 from "../../assets/game/Black-Card2.png";
import { socket } from "../../config/socketConnection";
import accept from "../../assets/checked.png";
import reject from "../../assets/close.png";
import Chat from "../chat/chat";
import winnerSound from "../../assets/Poker Sfx/winSoundPoker.mp3";
import call from "../../assets/Poker Sfx/Chip Bet/bet.wav";
import collect from "../../assets/Poker Sfx/Collect Chips/collect.wav";
import check from "../../assets/Poker Sfx/Check/check.mp3";
import chatBubble from "../../assets/Poker Sfx/ChatBubble.wav";
import fold from "../../assets/Poker Sfx/Fold.mp3";
import myTurn from "../../assets/Poker Sfx/MyTurn.wav";
import arrow from "../../assets/left-arrow.png";
import Bet from "../bet/bet";
import "./table.css";
import footerlogo from "../../assets/game/logo-poker.png";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import winnericon from "../../assets/win-icon.png";
import loseicon from "../../assets/loss-icon.png";
import StatsPopup from "./statsPopup";
import BuyInPopup from "./buyInPopup";
import LeaveConfirmPopup from "./leaveConfirmPopup";
import "./tablepopup.css";
import btntoggle from "../../assets/btnmenu.png";
import sitdown from "../../assets/sit-in.png";
import situp from "../../assets/sit-out.png";
import loaderImg from "../../assets/chat/loader1.webp";
import InviteFriend from "./InviteFriend";
import Helmet from "react-helmet";
import MarketStore from "../MarketPlace/marketStore";
import axios from "axios";
import winImage from "../../assets/animation/win.json";
import userUtils from "./../../utils/user";
import { useHistory } from "react-router-dom";
import CONSTANTS from "../../config/contants";
import { getCookie } from "../../utils/cookieUtil";
import BetView from "../bet/betView";
import RaiseView from "../bet/raiseView";
import coinWinning from "../../assets/animation/22.gif";
import { pokerInstance } from "../../utils/axios.config";
import RaiseSlider from "../bet/raiseSlider";
import AdvanceActionBtn from "../bet/advanceActionBtns";
import ChatHistory from "../chat/chatHistory";
import UsersComments from "../../assets/comenting.svg";
import AddCoinIcon from "../SVGfiles/coinSVG";
import { MuteIcon, VolumeIcon } from "../SVGfiles/soundSVG";
import EnterAmountPopup from "./enterAmountPopup";

const getQueryParams = () => {
  const url = new URLSearchParams(window.location.search);
  return {
    tableid: url.get("tableid") || "",
    gameCollection: url.get("gameCollection") || url.get("gamecollection"),
  };
};
const winImageanim = {
  loop: true,
  autoplay: true,
  animationData: winImage,
};

let roomData;
let userId;
let isWatcher = false;
let joinInRunningRound = false;
let tRound = null;
let tPlayer = null;
let showFinish = false;
let AvailablePosition = [];
let admin = false;
let idToken;
let interval;
let retryCount = 0;

const numFormatter = (num) => {
  if (num > 1 && num < 999) {
    return (num / 1)?.toFixed(0); // convert to K for number from > 1000 < 1 million
  } else if (num > 999 && num < 1000000) {
    return (num / 1000).toFixed(2) + "K"; // convert to K for number from > 1000 < 1 million
  } else if (num >= 1000000 && num < 1000000000) {
    return (num / 1000000).toFixed(1) + "M"; // convert to M for number from > 1 million
  } else if (num >= 100000000 && num < 1000000000000) {
    return (num / 100000000).toFixed(2) + "B";
  } else if (num >= 1000000000000)
    return (num / 1000000000000).toFixed(2) + "T";
  else return num; // if value < 1000, nothing to do
};

const PokerTable = (props) => {
  const [currentPlayer, setCurrentPlayer] = useState();
  const [action, setAction] = useState(false);
  const [actionText, setActionText] = useState("");
  const [winner, setWinner] = useState(false);
  const [bet, setBet] = useState();
  const [raise, setRaise] = useState();
  const [tableId, setTableId] = useState();
  const [players, setPlayers] = useState([]);
  const [tablePot, setTablePot] = useState("");
  const [isAdmin, setisAdmin] = useState(false);
  const [timer, setTimer] = useState(0);
  const [communityCards, setCommunityCards] = useState([]);
  const [newUser, setNewUser] = useState(false);
  const [winnerText, setWinnerText] = useState("");
  const [remainingTime, setRemainingTime] = useState();
  const [handMatch, setHandMatch] = useState([]);
  const [matchCards, setMatchCards] = useState([]);
  const [messageBy, setMessageBy] = useState();
  const [message, setMessage] = useState("");
  const [allowWatcher, setAllowWatcher] = useState(false);
  const [watchers, setWatchers] = useState([]);
  const [betOn, setBetOn] = useState("");
  const [betWin, setBetWin] = useState(false);
  const [onlywatcher, setOnlywatcher] = useState(false);
  const [gameCollection, setGameCollection] = useState("");
  const [handWinner, setHandWinner] = useState([]);
  const [showCoin, setShowCoin] = useState(false);
  const [loader, setLoader] = useState(false);
  const [start, setStart] = useState(false);
  const [startBtn, setStartBtn] = useState(false);
  const [mergeAnimationState, setMergeAnimationState] = useState(false);
  const [newJoinlowBalance, setNewJoinLowBalance] = useState(false);
  const [volume, setVolume] = useState(true);
  const [userData, setUserData] = useState(null);
  const [playersLeft, setPlayerLeft] = useState([]);
  const [playersRight, setPlayersRight] = useState([]);
  const [openAction, setOpenAction] = useState({
    bet: false,
    call: false,
    raise: false,
    check: false,
    allin: false,
    fold: false,
  });
  const history = useHistory();
  const [open, setOpen] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [refillSitInAmount, setRefillSitInAmount] = useState(false);
  const [showEnterAmountPopup, setShowEnterAmountPopup] = useState(false);
  const [leaveConfirmShow, setLeaveConfirm] = useState(false);
  const [buyinPopup, setBuyinPopup] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [tentativeAction, setTentativeAction] = useState();
  const [blindTimer, setBlindTimer] = useState();
  const handleClick = (e) => {
    setOpen(e);
  };
  const [view, setView] = useState();
  const [btnToggle, setBtnToggle] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [winAnimationType, setWinAnimationType] = useState("");
  const [showFollowMe, setShowFollowMe] = useState(false);
  const [followingList, setFollowingList] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [noOfPrevMessages, setNoOfPrevMessages] = useState(0);
  const [unReadMessages, setUnReadMessages] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [openChatHistory, setOpenChatHistory] = useState(false);

  const handleBtnClick = () => {
    setBtnToggle(!btnToggle);
  };

  const handleBetClick = (e) => {
    setView(e);
  };

  const scrollDownRef = useRef(null);

  const scrollToBottom = () => {
    scrollDownRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    let urlParams = new URLSearchParams(window.location.search);
    setTableId(urlParams.get("tableid"));
    setGameCollection(
      urlParams.get("gameCollection") || urlParams.get("gamecollection")
    );
  }, []);

  useEffect(() => {
    const tryReconnect = () => {
      setTimeout(() => {
        socket.io.open((err) => {
          // console.log("Socket open");
          if (err) {
            console.log("reconnect err => ", err);
            tryReconnect();
          } else {
            let urlParams = new URLSearchParams(window.location.search);
            let table = urlParams.get("tableid");
            // console.log({ table });
            let type =
              urlParams.get("gameCollection") ||
              urlParams.get("gamecollection");
            socket.emit("checkTable", {
              gameId: table,
              userId,
              gameType: type,
              dataFrom: "reconnect",
            });
            setLoader(true);
          }
        });
      }, 2000);
    };
    socket.io.on("close", tryReconnect);
  }, []);

  useEffect(() => {
    const isLoggedIn = async () => {
      let urlParams = new URLSearchParams(window.location.search);
      let user;
      if (
        !localStorage.getItem("token") &&
        !urlParams.get("token") &&
        !getCookie("token")
      ) {
        return (window.location.href = `${CONSTANTS.landingClient}`);
      }

      user = await userUtils.getAuthUserData();

      if (!user.success) {
        return (window.location.href = `${CONSTANTS.landingClient}`);
      }
      userId = user?.data.user?.id;
      let table = urlParams.get("tableid");
      let type =
        urlParams.get("gameCollection") || urlParams.get("gamecollection");
      userId = user?.data.user?.id;
      setUserData(user.data.user);

      try {
        if (table) {
          console.log("RommData", roomData);
          socket.emit("checkTable", {
            gameId: table,
            userId: user?.data.user?.id,
            gameType: type,
            sitInAmount: 0,
          });
        }
        setLoader(true);
      } catch (error) {
        console.log("error", error);
      }
    };

    isLoggedIn();
  }, []);

  useEffect(() => {
    socket.on("roomFull", () => {
      setLoader(false);
      toast.error("Room already full", { id: "full" });
      setTimeout(() => {
        window.location.href = window.location.origin + "/";
      }, 1000);
    });

    socket.on("notFound", (data) => {
      toast.error("Table not Found");
      if (
        data?.message === "Game not found. Either game is finished or not exist"
      ) {
        setTimeout(() => {
          window.location.href = window.location.origin;
        }, 500);
      }
    });
    socket.on("notInvitedPlayer", (data) => {
      if (data.message === "notInvited") {
        setShowEnterAmountPopup(true);
      } else {
        setShowEnterAmountPopup(false);
      }
    });
    socket.on("tablenotFound", (data) => {
      if (data.message === "tablenotFound") {
        setShowEnterAmountPopup(false);
        history.push("/");
      }
    });

    socket.on("userId", async (data) => {
      userId = data;
    });
    socket.on("newMessage", (data) => {
      playAudio("chat");
      setMessage(() => {
        return data.message;
      });
      setMessageBy(() => {
        return data.userId;
      });

      setTimeout(() => {
        setMessage("");
        setMessageBy(null);
      }, 10000);
    });
    socket.on("lowBalance", (data) => {
      setLoader(false);
      if (data.userid === userId) {
        toast(
          (toaster) => (
            <div className="custom-toaster low-balance">
              <p>Wallet has low balance, Unable to join</p>
            </div>
          ),
          { id: "A", duration: 2000 }
        );
        setNewJoinLowBalance(true);
        setBuyinPopup(true);
      }
    });

    socket.on("watcherbet", (data) => {
      setBetOn(data.player.id);
      setBetWin(data.betType);
    });

    socket.on("OnlyOne", (data) => {
      toast.error("Only One player, please wait for othe to join", { id: "A" });
      setStart(false);
      setTablePot(data.tablePot);

      updatePlayer(data.players);
      if (data.hostId === userId) {
        setisAdmin(true);
        admin = true;
      }
    });

    socket.on("newWatcherJoin", (data) => {
      setLoader(false);
      if (data.watcherId === userId) {
        toast.success("Joined as Watcher", { id: "A" });
        isWatcher = true;
      }
      roomData = data.roomData;
      setWatchers(data.roomData.watchers);
      if (roomData.runninground === 0) {
        updatePlayer(roomData.players);
      } else if (roomData.runninground === 1) {
        updatePlayer(roomData.preflopround);
      } else if (roomData.runninground === 2) {
        updatePlayer(roomData.flopround);
      } else if (roomData.runninground === 3) {
        updatePlayer(roomData.turnround);
      } else if (roomData.runninground === 4) {
        updatePlayer(roomData.riverround);
      } else if (roomData.runninground === 5) {
        updatePlayer(roomData.showdown);
      }
    });

    socket.on("actionError", (data) => {
      console.log("actionErroractionError", data);
    });
    socket.on("sitInOut", (data) => {
      roomData = data.updatedRoom;
      if (roomData.runninground === 0) {
        updatePlayer(roomData.players);
      } else if (roomData.runninground === 1) {
        updatePlayer(roomData.preflopround);
      } else if (roomData.runninground === 2) {
        updatePlayer(roomData.flopround);
      } else if (roomData.runninground === 3) {
        updatePlayer(roomData.turnround);
      } else if (roomData.runninground === 4) {
        updatePlayer(roomData.riverround);
      } else if (roomData.runninground === 5) {
        updatePlayer(roomData.showdown);
      }
    });
    socket.on("privateTable", () => {
      setLoader(false);
      toast.error("Unable to join Private table", { id: "A" });
    });
    socket.on("noAdmin", () => {
      setLoader(false);
      toast.error("Table host is not Available", { id: "A" });
    });
    socket.on("tableOwner", (data) => {
      setLoader(false);
      setisAdmin(true);
      admin = true;
      roomData = data;
    });

    socket.on("noTable", () => {
      toast.error("No such table found", { id: "A" });
      setLoader(false);
    });
    socket.on("alreadyStarted", () => {
      toast.error("Game already Started, Please comeback after some time", {
        id: "alreadyStarted",
      });
      setTimeout(() => {
        window.location.href = window.location.origin;
      }, 1000);
    });

    socket.on("newWatcher", () => {
      setLoader(false);
      setOnlywatcher(true);
    });

    socket.on("alreadyJoin", () => {
      toast.error("You are already in room", { id: "A", duration: 1000 });
    });
    socket.on("hostApproval", () => {
      toast.success("Request send for Approval", { id: "A", duration: 1000 });
    });

    socket.on("newUser", (data) => {
      setLoader(false);
      if (data.allowWatcher) {
        setAllowWatcher(true);
      } else setNewUser(true);
    });

    socket.on("playerleft", (data) => {
      toast.success(data.msg, { id: "A" });
    });

    socket.on("notAuthorized", () => {
      toast.error("Not Authorized", { id: "A" });
      setLoader(false);
    });

    socket.on("noUser", () => {
      toast.error("No user found", { id: "A" });
    });

    socket.on("actionperformed", (data) => {
      setActionText(data.action);
      setAction(true);
      // setCurrentPlayer(false)
    });

    socket.on("notification", (data) => {
      let pl =
        roomData &&
        roomData.players.find(
          (ele) => (ele.id ? ele.id : ele.userid) === data.id
        );
      toast.success(`${pl.name} made ${data.action}`, { id: "info" });
    });

    socket.on("cancelJoinRequest", (data) => {
      // toast cancel join request
      // open join action panel
    });

    socket.on("approved", (data) => {
      if (data.playerid === userId) {
        toast.success("Join request is approved", { id: "A" });
        setNewUser(false);
      } else {
        toast.success(`${data.name} join the table`, { id: "B" });
      }
    });

    socket.on("rejected", (data) => {
      if (data.playerid === userId) {
        toast.error("Your join request is rejected", { id: "A" });
        if (data.allowWatcher) {
          setAllowWatcher(true);
        } else setNewUser(true);
      }
    });

    socket.on("notEnoughPlayer", (data) => {
      toast.error("Atleast 3 player required to start the game", { id: "A" });
    });

    socket.on("newhand", (data) => {
      if (data) {
        console.log(data?.updatedRoom);
        roomData = data?.updatedRoom;
        tPlayer = null;
        setStart(false);
        joinInRunningRound = false;
        setTablePot(roomData?.tablePot);
        updatePlayer(roomData?.players);
        setCommunityCards([]);
        setCurrentPlayer(false);
        setWinner(false);
        setWinnerText("");
        setAction(false);
        setActionText("");
        setHandMatch([]);
        if (roomData?.hostId === userId) {
          setisAdmin(true);
          admin = true;
        }
        if (roomData?.eleminated?.length > 0) {
          if (
            roomData?.eleminated?.find(
              (el) => el?.userid?.toString() === userId?.toString()
            )
          ) {
            history.push("/");
          }
        }
      }
    });

    socket.on("preflopround", (data) => {
      roomData = data;
      setTablePot(roomData.pot);
      setTimer(roomData.timer);
      updatePlayer(data.preflopround);
    });

    socket.on("flopround", (data) => {
      setMergeAnimationState(true);
      roomData = data;
      setTablePot(roomData.pot);
      setCommunityCards(data?.communityCard);
      updatePlayer(data.flopround);
      setTimeout(() => {
        setMergeAnimationState(false);
        playAudio("collect");
      }, 400);
    });

    socket.on("turnround", (data) => {
      setMergeAnimationState(true);
      roomData = data;
      setCommunityCards(data?.communityCard);
      setTablePot(roomData.pot);
      updatePlayer(data.turnround);
      setTimeout(() => {
        setMergeAnimationState(false);
        playAudio("collect");
      }, 400);
    });

    socket.on("riverround", (data) => {
      setMergeAnimationState(true);
      roomData = data;
      setCommunityCards(data?.communityCard);
      setTablePot(roomData.pot);
      updatePlayer(data.riverround);
      setTimeout(() => {
        setMergeAnimationState(false);
        playAudio("collect");
      }, 400);
    });

    socket.on("winner", (data) => {
      roomData = data.updatedRoom;
      updatePlayer(roomData.showdown);
      setCurrentPlayer(false);
      showWinner(roomData.winnerPlayer, roomData.players);
    });

    socket.on("gameStarted", () => {
      toast.error("Game already started", { id: "A" });
    });

    socket.on("gameFinished", () => {
      toast.error("Game already finished", { id: "A" });
      setLoader(false);
      socket.emit("clearData", {
        tableId,
        gameType: gameCollection,
      });
      setTimeout(() => {
        window.location.href = `${window.location.origin}`;
      }, 100);
    });

    socket.on("beingtimeout", (data) => {
      toast.error("being Timeout");
    });

    socket.on("automaticFold", (data) => {
      playAudio("fold");
      toast.error(data.msg, { id: "A" });
    });

    socket.on("raise", (data) => {
      playAudio("bet");
      roomData = data.updatedRoom;
      setTablePot(roomData.pot);
      if (roomData.runninground === 0) {
        updatePlayer(roomData.players);
      } else if (roomData.runninground === 1) {
        updatePlayer(roomData.preflopround);
      } else if (roomData.runninground === 2) {
        updatePlayer(roomData.flopround);
      } else if (roomData.runninground === 3) {
        updatePlayer(roomData.turnround);
      } else if (roomData.runninground === 4) {
        updatePlayer(roomData.riverround);
      } else if (roomData.runninground === 5) {
        updatePlayer(roomData.showdown);
      }
    });

    socket.on("allin", (data) => {
      playAudio("bet");
      roomData = data.updatedRoom;
      setTablePot(roomData.pot);
      if (roomData.runninground === 0) {
        updatePlayer(roomData.players);
      } else if (roomData.runninground === 1) {
        updatePlayer(roomData.preflopround);
      } else if (roomData.runninground === 2) {
        updatePlayer(roomData.flopround);
      } else if (roomData.runninground === 3) {
        updatePlayer(roomData.turnround);
      } else if (roomData.runninground === 4) {
        updatePlayer(roomData.riverround);
      } else if (roomData.runninground === 5) {
        updatePlayer(roomData.showdown);
      }
    });

    socket.on("bet", (data) => {
      playAudio("bet");
      roomData = data.updatedRoom;
      setTablePot(roomData.pot);
      if (roomData.runninground === 0) {
        updatePlayer(roomData.players);
      } else if (roomData.runninground === 1) {
        updatePlayer(roomData.preflopround);
      } else if (roomData.runninground === 2) {
        updatePlayer(roomData.flopround);
      } else if (roomData.runninground === 3) {
        updatePlayer(roomData.turnround);
      } else if (roomData.runninground === 4) {
        updatePlayer(roomData.riverround);
      } else if (roomData.runninground === 5) {
        updatePlayer(roomData.showdown);
      }
    });

    socket.on("call", (data) => {
      playAudio("bet");
      roomData = data.updatedRoom;
      setTablePot(roomData.pot);
      if (roomData.runninground === 0) {
        updatePlayer(roomData.players);
      } else if (roomData.runninground === 1) {
        updatePlayer(roomData.preflopround);
      } else if (roomData.runninground === 2) {
        updatePlayer(roomData.flopround);
      } else if (roomData.runninground === 3) {
        updatePlayer(roomData.turnround);
      } else if (roomData.runninground === 4) {
        updatePlayer(roomData.riverround);
      } else if (roomData.runninground === 5) {
        updatePlayer(roomData.showdown);
      }
    });

    socket.on("check", (data) => {
      playAudio("check");
      roomData = data.updatedRoom;
      setTablePot(roomData.pot);
      if (roomData.runninground === 0) {
        updatePlayer(roomData.players);
      } else if (roomData.runninground === 1) {
        updatePlayer(roomData.preflopround);
      } else if (roomData.runninground === 2) {
        updatePlayer(roomData.flopround);
      } else if (roomData.runninground === 3) {
        updatePlayer(roomData.turnround);
      } else if (roomData.runninground === 4) {
        updatePlayer(roomData.riverround);
      } else if (roomData.runninground === 5) {
        updatePlayer(roomData.showdown);
      }
    });

    socket.on("fold", (data) => {
      playAudio("fold");
      roomData = data.updatedRoom;
      setTablePot(roomData.pot);
      if (roomData.runninground === 0) {
        updatePlayer(roomData.players);
      } else if (roomData.runninground === 1) {
        updatePlayer(roomData.preflopround);
      } else if (roomData.runninground === 2) {
        updatePlayer(roomData.flopround);
      } else if (roomData.runninground === 3) {
        updatePlayer(roomData.turnround);
      } else if (roomData.runninground === 4) {
        updatePlayer(roomData.riverround);
      } else if (roomData.runninground === 5) {
        updatePlayer(roomData.showdown);
      }
    });

    socket.on("updateGame", (data) => {
      setLoader(false);
      roomData = data.game;
      setChatMessages(data.game.chats);
      if (
        roomData.players.find((ele) => ele.userid === userId) &&
        !roomData.preflopround.find((ele) => ele.id === userId) &&
        roomData.runninground !== 0
      ) {
        joinInRunningRound = true;
      }
      setCommunityCards(data?.communityCard);
      if (roomData.hostId === userId) {
        setisAdmin(true);
        admin = true;
      }
      if (roomData.runninground === 0) {
        updatePlayer(roomData.players);
        setCommunityCards([]);
        setCurrentPlayer(false);
        setWinner(false);
        setWinnerText("");
        setAction(false);
        setActionText("");
        setHandMatch([]);
      } else if (roomData.runninground === 1) {
        updatePlayer(roomData.preflopround);
      } else if (roomData.runninground === 2) {
        updatePlayer(roomData.flopround);
      } else if (roomData.runninground === 3) {
        updatePlayer(roomData.turnround);
      } else if (roomData.runninground === 4) {
        updatePlayer(roomData.riverround);
      } else if (roomData.runninground === 5) {
        updatePlayer(roomData.showdown);
      }
    });

    socket.on("roomPaused", () => {
      toast.success("Game is Pause for Next Hand", { id: "A" });
    });

    socket.on("roomFinished", (data) => {
      toast.success(data.msg, { id: "A" });
      if (data.roomdata.runninground === 0) {
        setHandWinner(data.roomdata.handWinner);
        setModalShow(true);
      }
    });

    socket.on("onlyOnePlayingPlayer", (data) => {
      roomData = data.roomdata;
      updatePlayer(roomData.players);
      setStart(false);
      toast.success(
        "Only one player is eligible to play and poker needs atleast two player to play",
        { id: "onlyOnePlayingPlayer" }
      );
    });
    socket.on("roomResume", () => {
      toast.success("Game is resumed for next hand", { id: "A" });
    });

    socket.on("joinAndLeave", () => {
      window.location.reload();
    });

    socket.on("adminLeave", (data) => {
      if (userId === data.userId) {
        toast.success("Admin left the game, Now you are the Game Admin", {
          id: "GameAdmin",
        });
      } else {
        toast.success(
          `Admin left the game, Now ${data.name} is the Game Admin`,
          { id: "GameAdmin" }
        );
      }
    });

    socket.on("notEnoughBalance", (data) => {
      toast.error(data.message);
      setTimeout(() => {
        window.location.href = window.location.origin;
      }, 1000);
    });

    socket.on("inOtherGame", (data) => {
      toast.error(data.message);
      setTimeout(() => {
        window.location.href = window.location.origin;
      }, 1000);
    });

    socket.on("joinInRunningGame", (data) => {
      setLoader(false);
      if (data.playerId === userId) {
        joinInRunningRound = true;
        roomData = data.updatedRoom;
        setCommunityCards(data?.communityCard);
        if (roomData.hostId === userId) {
          setisAdmin(true);
          admin = true;
        }
        if (roomData.runninground === 0) {
          updatePlayer(roomData.players);
          setCommunityCards([]);
          setCurrentPlayer(false);
          setWinner(false);
          setWinnerText("");
          setAction(false);
          setActionText("");
          setHandMatch([]);
        } else if (roomData.runninground === 1) {
          updatePlayer(roomData.preflopround);
        } else if (roomData.runninground === 2) {
          updatePlayer(roomData.flopround);
        } else if (roomData.runninground === 3) {
          updatePlayer(roomData.turnround);
        } else if (roomData.runninground === 4) {
          updatePlayer(roomData.riverround);
        } else if (roomData.runninground === 5) {
          updatePlayer(roomData.showdown);
        }
      }
    });

    socket.on("reload", () => {
      window.location.reload();
    });
  }, [isAdmin]);

  const handleTentativeActionAuto = (player) => {
    let event;
    const { tentativeAction } = player;
    if (tentativeAction.includes(" ")) {
      const [event1] = tentativeAction.split(" ");
      event = event1;
    } else {
      event = tentativeAction;
    }
    switch (event) {
      case "check":
        socket.emit("docheck", { userid: player.id, roomid: tableId });
        break;
      case "fold":
        socket.emit("dofold", { userid: player.id, roomid: tableId });
        break;
      case "check/fold":
        if (
          roomData.lastAction === "check" ||
          roomData.raiseAmount === player.pot
        ) {
          socket.emit("docheck", { userid: player.id, roomid: tableId });
        } else {
          socket.emit("dofold", { userid: player.id, roomid: tableId });
        }
        break;
      case "call":
        if (
          roomData.lastAction === "check" ||
          roomData.raiseAmount === player.pot
        ) {
          socket.emit("docheck", { userid: player.id, roomid: tableId });
        } else {
          socket.emit("docall", {
            userid: player.id,
            roomid: tableId,
            amount: roomData.raiseAmount,
          });
        }
        break;
      case "callAny":
        if (
          roomData.lastAction === "check" ||
          roomData.raiseAmount === player.pot
        ) {
          socket.emit("docheck", { userid: player.id, roomid: tableId });
        } else {
          socket.emit("docall", {
            userid: player.id,
            roomid: tableId,
            amount: roomData.raiseAmount,
          });
        }

        break;
      case "allin":
        if (
          roomData?.lastAction === "check" ||
          roomData?.raiseAmount === player?.pot
        ) {
          socket.emit("docheck", { userid: player?.id, roomid: tableId });
        } else {
          socket.emit("doallin", {
            userid: player?.id,
            roomid: tableId,
            amount: player?.wallet,
          });
        }
        break;

      default:
        return "";
    }
  };

  useEffect(() => {
    setCommunityCards(roomData?.communityCard);
    socket.on("timer", (data) => {
      setRemainingTime(data.playerchance);
      if (tPlayer !== data.id || tRound !== data.runninground) {
        if (timer === 0) {
          setTimer(roomData && roomData.timer);
        }

        setAction(false);
        setActionText(false);

        setPlayers((preState) => {
          setCurrentPlayer(preState.find((ele) => ele.id === data.id));
          handleActionButton(preState.find((ele) => ele.id === data.id));
          return preState;
        });
      }
      tPlayer = data.id;
      tRound = data.runninground;
    });
  }, [players, currentPlayer]);

  useEffect(() => {
    if (currentPlayer && currentPlayer.id === userId) {
      playAudio("turn");
    }
  }, [currentPlayer]);

  useEffect(() => {
    socket.on("updateChat", (data) => {
      setChatMessages(data.chat);
      let nesMsgCount = 0;
      data.chat.forEach((chatObj, i) => {
        if (chatObj.seenBy.indexOf(userId) < 0 && chatObj.userId !== userId)
          nesMsgCount++;
      });
      if (openChatHistory) {
        socket.emit("updateChatIsReadWhileChatHistoryOpen", {
          userId,
          tableId,
          openChatHistory,
        });
        nesMsgCount = 0;
      }
      setUnReadMessages(nesMsgCount);
    });
  }, []);

  const updatePlayer = (data) => {
    if (!data) {
      return;
    }
    let availablePosition = [];
    const pl = [...data];
    let players = [...pl];
    const pRight = pl.slice(0, Math.ceil(pl.length / 2));
    const pleft = pl.slice(Math.ceil(pl.length / 2)).reverse();
    setPlayerLeft(pleft);
    setPlayersRight(pRight);

    switch (data.length) {
      case 1:
        availablePosition = [0];
        break;
      case 2:
        availablePosition = [0, 5];
        break;
      case 3:
        availablePosition = [0, 4, 5];
        break;
      case 4:
        availablePosition = [0, 2, 4, 7];
        break;
      case 5:
        availablePosition = [0, 2, 4, 5, 7];
        break;
      case 6:
        availablePosition = [0, 2, 3, 4, 6, 7];
        break;
      case 7:
        availablePosition = [0, 1, 2, 3, 6, 7, 8];
        break;
      case 8:
        availablePosition = [0, 1, 2, 3, 4, 6, 7, 8];
        break;
      case 9:
        availablePosition = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        break;
      // case 10:
      //   availablePosition = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      //   break;
      default:
        break;
    }
    AvailablePosition = [...availablePosition];
    let whole = [];
    if (isWatcher || joinInRunningRound) {
      whole = [...data];
    } else {
      const index = data.findIndex(
        (ele) => (ele.id ? ele.id : ele.userid) === userId
      );
      if (index !== -1) {
        const split1 = data.slice(0, index + 1);
        const me = split1.pop();
        const split2 = data.slice(index + 1, data.length);
        whole.push(me);
        whole = whole.concat(split2).concat(split1);
      }
    }
    let playerDetails = [];
    whole?.forEach((el, i) => {
      playerDetails.push({
        ...el,
        availablePosition: availablePosition[i],
        isDealer: roomData.dealerPosition === el.position ? true : false,
        isSmallBlind:
          roomData.smallBlindPosition === el.position ? true : false,
        isBigBlind: roomData.bigBlindPosition === el.position ? true : false,
        id: el.userid ? el.userid : el.id,
      });
    });
    setPlayers(playerDetails);
  };

  const showWinner = (data, players) => {
    data.forEach((item, i) => {
      if (i === 0) {
        let type = players.find((el) => el.userid === item.id);
        setWinAnimationType(type.items);
        setWinner(item);
        playAudio("winner");
        if (item.handName) {
          setWinnerText(`${item.name} wins with ${item.handName}`);
          let newMatch = [];
          let hand = [];
          item.communityCards.forEach((card, j) => {
            let handCard = item.winnerHand.find((hand) => hand === card);
            if (handCard) {
              newMatch.push(j);
            }
          });
          item.winnerCards.forEach((card, j) => {
            let handCard = item.winnerHand.find((hand) => hand === card);
            if (handCard) {
              hand.push(j);
            }
          });
          hand.sort((a, b) => a - b);
          newMatch.sort((a, b) => a - b);
          setMatchCards(newMatch);
          setHandMatch(hand);
        } else if (!item.handName || item.name) {
          setWinnerText(`All player folded, ${item.name} Win`);
        }
        setTimeout(() => {
          console.log("set winner for one executed");
          setWinner(false);
        }, 2500);
      } else if (i > 0) {
        setTimeout(() => {
          let type = players.find((el) => el.id === item.id);
          setWinAnimationType(type?.items);
          setWinner(item);
          if (item.handName) {
            setWinnerText(`${item.name} wins with ${item.handName}`);
            let newMatch = [];
            item.communityCards.forEach((card, j) => {
              let handCard = item.winnerHand.find((hand) => hand === card);
              if (handCard) {
                newMatch.push(j);
              }
            });
            newMatch.sort((a, b) => a - b);
            setMatchCards(newMatch);
          } else if (!item.handName || item.name) {
            setWinnerText(`All player folded, ${item.name} Win`);
          }
          setTimeout(() => {
            setWinner(false);
          }, 2500);
        }, 3000);
      }
    });
    if (roomData.finish) {
      setHandWinner(roomData.handWinner);
    }
  };

  const [auto, setAuto] = useState(false);
  const startGame = (data) => {
    socket.emit("startPreflopRound", {
      tableId,
      userId,
    });
    if (data) {
      setAuto(true);
    }
  };

  const joinGame = () => {
    socket.emit("joinGame", {
      tableId,
      userId,
      gameType: gameCollection,
    });
    setNewUser(false);
    setAllowWatcher(false);
  };

  const callAction = () => {
    setOpenAction({
      bet: false,
      call: false,
      raise: false,
      check: false,
      allin: false,
      fold: false,
    });
    socket.emit("docall", {
      userid: userId,
      roomid: tableId,
      amount: roomData.raiseAmount,
    });
    setTimer(0);
  };

  const raiseAction = (x) => {
    setOpenAction({
      bet: false,
      call: false,
      raise: false,
      check: false,
      allin: false,
      fold: false,
    });
    socket.emit("doraise", {
      userid: userId,
      roomid: tableId,
      amount: x,
    });
    setTimer(0);
  };

  const checkAction = () => {
    setOpenAction({
      bet: false,
      call: false,
      raise: false,
      check: false,
      allin: false,
      fold: false,
    });
    socket.emit("docheck", {
      userid: userId,
      roomid: tableId,
    });
    setTimer(0);
  };

  const betAction = (x) => {
    setOpenAction({
      bet: false,
      call: false,
      raise: false,
      check: false,
      allin: false,
      fold: false,
    });
    socket.emit("dobet", {
      userid: userId,
      roomid: tableId,
      amount: x,
    });
    setTimer(0);
  };

  const allinAction = () => {
    setOpenAction({
      bet: false,
      call: false,
      raise: false,
      check: false,
      allin: false,
      fold: false,
    });
    socket.emit("doallin", {
      userid: userId,
      roomid: tableId,
      amount: currentPlayer?.wallet,
    });
    setTimer(0);
  };

  const foldAction = () => {
    setOpenAction({
      bet: false,
      call: false,
      raise: false,
      check: false,
      allin: false,
      fold: false,
    });
    socket.emit("dofold", {
      userid: userId,
      roomid: tableId,
    });
    setTimer(0);
  };

  const finishGame = () => {
    socket.emit("dofinishgame", {
      userid: userId,
      roomid: tableId,
    });
  };

  const pauseGame = () => {
    socket.emit("dopausegame", {
      userid: userId,
      roomid: tableId,
    });
  };

  const resumeGame = () => {
    socket.emit("doresumegame", {
      userid: userId,
      roomid: tableId,
    });
  };

  const handleActionButton = (currentPlayer) => {
    setBet(false);
    setRaise(false);
    let currentAction = { ...openAction };
    const { pot, wallet } = currentPlayer ? currentPlayer : {};
    const {
      raiseAmount,
      lastAction,
      runninground: round,
    } = roomData ? roomData : {};
    currentAction.fold = true;
    if (round === 1) {
      if (wallet > raiseAmount) {
        //range true
        currentAction.raise = true;
        currentAction.bet = false;

        if (raiseAmount === pot) {
          //check true
          currentAction.check = true;
        } else if (pot < raiseAmount) {
          //call true
          currentAction.call = true;
          currentAction.bet = false;
        }
      } else if (wallet <= raiseAmount) {
        //allin true
        currentAction.allin = true;
        currentAction.raise = false;
      }
    }

    if (round >= 2) {
      if (lastAction === "check") {
        currentAction.check = true;
      }

      if (lastAction === "check") {
        if (raiseAmount > wallet) {
          currentAction.allin = true;
          currentAction.raise = false;
        } else {
          currentAction.call = false;
          currentAction.bet = true;
          currentAction.raise = false;
        }
      } else {
        if (raiseAmount < wallet) {
          currentAction.call = true;
          currentAction.bet = false;
          currentAction.check = false;
        }
        if (raiseAmount > wallet) {
          currentAction.allin = true;
          currentAction.raise = false;
        }
        if (raiseAmount < wallet) {
          currentAction.allin = false;
          currentAction.bet = false;
          currentAction.raise = true;
        }
      }
      if (wallet <= raiseAmount) {
        currentAction.allin = true;
        currentAction.raise = false;
      }
      if (lastAction !== "check" && pot !== raiseAmount) {
        currentAction.check = false;
      }
    }
    setOpenAction(() => {
      return currentAction;
    });
  };

  const playAudio = (type) => {
    if (type) {
      const audioEl = document.getElementsByClassName(`audio-${type}`)[0];
      if (audioEl) {
        audioEl.play();
      }
    }
    if (type === "winner") {
      setTimeout(() => {
        setWinner(false);
      }, 10000);
    }
  };

  const sitout = () => {
    socket.emit("dositout", {
      tableId,
      userId,
      gameType: gameCollection,
    });
  };

  const sitin = () => {
    socket.emit("dositin", {
      tableId,
      userId,
      gameType: gameCollection,
    });
  };

  const leaveTable = () => {
    socket.emit("doleavetable", {
      tableId,
      userId,
      gameType: gameCollection,
      isWatcher: isWatcher,
      action: "Leave",
    });
    window.location.href = `${window.location.origin}`;
  };

  useEffect(() => {
    socket.on("notInvited", () => {
      alert("This is a private table");
      history.push("/");
    });
    socket.on("roomchanged", (data) => {
      const { newRoomId, changeIds } = data;
      if (newRoomId && changeIds.length > 0) {
        if (changeIds.find((el) => el.toString() === userId.toString())) {
          console.log("Change ids--->", changeIds);
          window.location.href =
            "/table?gamecollection=poker&tableid=" + newRoomId;
        }
      }
    });
    socket.on("tablefull", (data) => {
      toast.error(data?.message, { id: "A" });
      setTimeout(() => {
        history.push("/");
      }, 2000);
    });
    socket.on("eleminated", (data) => {
      console.log("Eleminated detail--->", data);
      const { roomDetail } = data;
      if (roomDetail) {
        if (
          roomDetail?.players(
            (el) => el?.userid?.toString() !== userId?.toString()
          )
        ) {
          history.push("/");
        }
      }
    });
    return () => {
      socket.off("notInvited");
    };
  }, [history]);

  const handleOpenChatHistory = () => {
    socket.emit("updateChatIsRead", { userId, tableId });
    setNoOfPrevMessages(chatMessages.length);
    setUnReadMessages(0);
    setOpenChatHistory(!openChatHistory);
  };

  const handleTentativeAction = (e) => {
    const {
      target: { value, checked },
    } = e;

    if (tentativeAction === value) {
      setTentativeAction("");
    } else {
      setTentativeAction(value);
    }
    socket.emit("playerTentativeAction", {
      gameId: tableId,
      userId,
      playerAction: checked ? value : null,
    });
  };

  useEffect(() => {
    // console.log("currentPlayer", currentPlayer);

    if (currentPlayer?.tentativeAction && currentPlayer?.id === userId) {
      handleTentativeActionAuto(currentPlayer);
    }
    // setTentativeAction("");
  }, [currentPlayer, userId]);

  const wrapperRef = useRef();

  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setBtnToggle(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };
  useOutsideAlerter(wrapperRef);

  const handleSitInAmount = async (amount) => {
    if (refillSitInAmount) {
      return handleReffill(amount);
    } else {
      handleSitin(amount);
    }
  };

  const handleSitin = (sitInAmount) => {
    let urlParams = getQueryParams();
    let table = urlParams["tableid"];
    let type = urlParams["gameCollection"] || urlParams["gamecollection"];

    if (!tableId) {
      setTableId(table);
    }

    if (!userData) {
      return (window.location.href = window.location.origin);
    }

    if (parseFloat(sitInAmount) > userData.wallet) {
      toast.error("You don't have enough balance.", {
        id: "notEnoughSitIn",
      });
      // setTimeout(() => {
      //   window.location.href = window.location.origin;
      // }, 1000);
      return;
    } else if (parseFloat(sitInAmount) < 0) {
      toast.error("Amount is not valid.", {
        id: "notEnoughSitIn",
      });
      setTimeout(() => {
        window.location.href = window.location.origin;
      }, 1000);
      return;
    } else if (/\d/.test(sitInAmount)) {
      socket.emit("checkTable", {
        gameId: table,
        userId: userId,
        gameType: type,
        sitInAmount: parseFloat(sitInAmount),
      });
      setShowEnterAmountPopup(false);
      // setRetryIfUserNotJoin(true);

      setLoader(true);
    } else {
      toast.error("Not valid amount.", {
        id: "notEnoughSitIn",
      });
      setTimeout(() => {
        window.location.href = window.location.origin;
      }, 1000);
      return;
    }
  };

  const handleReffill = async (amount) => {
    console.log("RefelAmount", userData);
    // let user = await userUtils.getAuthUserData();

    try {
      if (parseFloat(amount) > userData?.wallet) {
        toast.error("You don't have enough balance.", {
          id: "notEnoughSitIn",
        });
        return;
      } else {
        // const data = await pokerInstance().post("/refillWallet", {
        //   tableId,
        //   amount,
        // });
        socket.emit("refillWallet", {
          tableId: tableId,
          amount: amount,
          userid: userData.id,
          username: userData.username,
        });

        return "success";
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data.msg || "Some error occured";
      }
      return "Failed to refill";
    }
  };

  useEffect(() => {
    socket.on("updateRoom", (data) => {
      console.log("datatatata", data);

      updatePlayer(data?.players);
      toast.success(`Your wallet is updated`);
      setRefillSitInAmount(false);
    });

    socket.on("InrunningGame", (data) => {
      toast.success(`Your wallet is update in next hand`);
      setRefillSitInAmount(false);
    });
  }, []);

  const raiseInSliderAction = (x) => {
    if (x >= roomData?.raiseAmount) {
      setOpenAction({
        bet: false,
        call: false,
        raise: false,
        check: false,
        allin: false,
        fold: false,
      });

      socket.emit("doraise", {
        userid: userId,
        roomid: tableId,
        amount: x,
      });
    } else {
      toast.error(`Raise amount must be minimum ${roomData?.raiseAmount}`);
    }
  };
  const betInSliderAction = (x) => {
    // console.log("BetAmount", x);
    if (x >= roomData.raiseAmount) {
      setOpenAction({
        bet: false,
        call: false,
        raise: false,
        check: false,
        allin: false,
        fold: false,
      });

      socket.emit("dobet", {
        userid: userId,
        roomid: tableId,
        amount: x,
      });
    } else {
      toast.error(`Raise amount must be minimum ${roomData?.raiseAmount}`);
    }
  };

  useEffect(() => {
    // console.log("RunningRound", roomData?.runninground);
    socket.on("blindTimer", (data) => {
      console.log("blindTimer", data);
      setBlindTimer(data.time);
    });
  }, []);

  return (
    <div className="poker" id={players.length}>
      <Helmet>
        <html
          className={`game-page ${
            !(players && players.find((ele) => ele.id === userId)) &&
            roomData &&
            roomData.players.find((ele) => ele.userid === userId)
              ? "game-started-join"
              : ""
          }`}
        />
      </Helmet>

      <div
        className={
          !(players && players.find((ele) => ele.id === userId)) &&
          roomData &&
          roomData.players.find((ele) => ele.userid === userId)
            ? "backToHome"
            : "notShow"
        }
      >
        <button onClick={() => setLeaveConfirm(true)}>
          <i class="fa fa-sign-out" aria-hidden="true" />
        </button>
      </div>
      <div className={`poker-bg ${loader ? "loaderactive" : ""} `}>
        {loader && (
          <div className="poker-loader">
            <img src={loaderImg} alt="loader-Las vegas" />{" "}
          </div>
        )}

        <div className="container">
          {console.log("play pause game start  ==>", roomData?.gamestart)}
          {startBtn && isAdmin && roomData?.gamestart ? (
            <PlayPauseBtn
              pauseGame={pauseGame}
              finishGame={finishGame}
              resumeGame={resumeGame}
            />
          ) : (
            ""
          )}

          {roomData?.gameType === "poker-tournament" && (
            <div className="table-blindLevel">
              <h4>
                SB/BB :{" "}
                <span>{roomData?.smallBlind + "/" + roomData?.bigBlind}</span>
              </h4>
            </div>
          )}

          {roomData?.gameType === "poker-tournament" &&
            roomData?.isGameRunning && (
              <div className="table-blindTimer">
                <h4>
                  SB/BB will change in :{" "}
                  <span>{blindTimer ? blindTimer : ""}</span>
                </h4>
              </div>
            )}

          <div className={`poker-table ${winner ? "winner-show" : ""}`}>
            <div className="containerFor-chatHistory">
              <div className="chatHistory-icon" onClick={handleOpenChatHistory}>
                {unReadMessages > 0 && (
                  <p className="ChatHistory-count">{unReadMessages}</p>
                )}
                <img src={UsersComments} alt="" />
              </div>
              <ChatHistory
                setOpenChatHistory={setOpenChatHistory}
                openChatHistory={openChatHistory}
                handleOpenChatHistory={handleOpenChatHistory}
                userId={userId}
                roomData={roomData}
                chatMessages={chatMessages}
                scrollToBottom={scrollToBottom}
                scrollDownRef={scrollDownRef}
              />
            </div>
            {(players && players.find((ele) => ele.id === userId)) ||
            (roomData &&
              roomData.players.find((ele) => ele.userid === userId)) ||
            isWatcher ? (
              <div
                className={`poker-table-bg wow animate__animated animate__fadeIn player-count-${players?.length}`}
              >
                {/* {console.log('con--', roomData?.players.find((el) => el.id === userId) &&
                  !roomData?.gamestart &&
                  !newUser &&
                  !roomData.tournament)} */}
                {roomData?.players.find((el) => el.id === userId) &&
                  !roomData?.gamestart &&
                  !newUser &&
                  !roomData.tournament && (
                    <div className="start-game">
                      <div className="start-game-btn">
                        {console.log(
                          `is admin ${isAdmin}`,
                          `is game started ${roomData?.gamestart}`
                        )}
                        {isAdmin && roomData && !roomData?.gamestart ? (
                          <>
                            <p>Click to start game</p>
                            {/* disabled={players && players.length <2} */}
                            <div className="footer-btn ">
                              {players && players.length >= 2 && (
                                <Button
                                  onClick={() => {
                                    setStart(true);
                                    setStartBtn(true);
                                    startGame(roomData?.autoNextHand);
                                  }}
                                  disabled={start}
                                >
                                  Start Game
                                </Button>
                              )}
                              {players && players.length < 2 && (
                                <OverlayTrigger
                                  placement="bottom"
                                  overlay={
                                    <Tooltip id="tooltip-disabled">
                                      Please wait for the other friends to join
                                    </Tooltip>
                                  }
                                >
                                  <Button className="not-allowed">
                                    Start Game
                                  </Button>
                                </OverlayTrigger>
                              )}
                            </div>
                          </>
                        ) : newUser ? (
                          <>
                            <p>Join table</p>
                            <div className="footer-btn ">
                              <Button onClick={() => joinGame()}>
                                Join Game
                              </Button>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                        {roomData &&
                          roomData?.runninground === 0 &&
                          !roomData?.gamestart &&
                          !isAdmin &&
                          !roomData?.tournament && (
                            <>
                              <p>Please wait for the Admin to Start the game</p>
                            </>
                          )}
                        {roomData &&
                        roomData.handWinner.length === 0 &&
                        !roomData?.gamestart ? (
                          <>
                            {roomData.gameType !== "poker-tournament" && (
                              <p className="joined-player">
                                Invited Players joined -{" "}
                                {roomData.players.filter((ele) =>
                                  roomData.invPlayers.includes(ele.userid)
                                ).length + 1}
                                /{roomData.invPlayers.length + 1}
                              </p>
                            )}
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  )}
                {tablePot ? <TablePotMoney tablePot={tablePot} /> : ""}
                {winner ? <GameMessage winnerText={winnerText} /> : null}

                <TableCard
                  winner={winner}
                  communityCards={communityCards}
                  matchCards={matchCards}
                  roomData={roomData}
                  blindTimer={blindTimer}
                />

                {!isWatcher &&
                  roomData &&
                  userId &&
                  players.map((player, i) => (
                    <Players
                      mergeAnimationState={mergeAnimationState}
                      key={`item-${player.userid ? player.userid : player.id}`}
                      followingList={followingList}
                      friendList={friendList}
                      systemplayer={i === 0 ? true : false}
                      playerclass={`player${player.availablePosition + 1}`}
                      playerData={player}
                      timer={timer}
                      action={action}
                      actionText={actionText}
                      remainingTime={remainingTime}
                      currentPlayer={currentPlayer}
                      winner={winner}
                      handMatch={handMatch}
                      message={message}
                      messageBy={messageBy}
                      betOn={betOn}
                      betWin={betWin}
                      tableId={tableId}
                      sitout={sitout}
                      sitin={sitin}
                      gameCollection={gameCollection}
                      showCoin={showCoin}
                      setShowCoin={setShowCoin}
                      setBuyinPopup={setBuyinPopup}
                      winAnimationType={winAnimationType}
                      tablePot={tablePot}
                    />
                  ))}
              </div>
            ) : (
              ""
            )}
          </div>
          <FooterButton
            bet={bet}
            setBet={setBet}
            raise={raise}
            setRaise={setRaise}
            isAdmin={isAdmin}
            startGame={startGame}
            betAction={betAction}
            callAction={callAction}
            foldAction={foldAction}
            raiseAction={raiseAction}
            checkAction={checkAction}
            allinAction={allinAction}
            joinGame={joinGame}
            newUser={newUser}
            currentPlayer={currentPlayer}
            action={action}
            openAction={openAction}
            roomData={roomData}
            handleTentativeAction={handleTentativeAction}
            tentativeAction={tentativeAction}
            setTentativeAction={setTentativeAction}
            loader={loader}
            raiseInSliderAction={raiseInSliderAction}
            betInSliderAction={betInSliderAction}
            playersRight={playersRight}
            playersLeft={playersLeft}
            players={players}
          />
        </div>
      </div>

      <div className="btn-toggler" onClick={handleBtnClick} role="presentation">
        <img src={btntoggle} alt="" />
      </div>
      {((players &&
        players.length > 0 &&
        players.find((ele) => ele.id === userId)) ||
        isWatcher) &&
        btnToggle && (
          <ul className="btn-list" ref={wrapperRef}>
            <li>
              <span
                className="close-icon"
                onClick={() => handleBtnClick()}
                role="presentation"
              >
                <i className="fa fa-close" />
              </span>
            </li>
            <li>
              <OverlayTrigger
                placement="left"
                overlay={<Tooltip id="tooltip-disabled">Leave</Tooltip>}
              >
                <button onClick={() => setLeaveConfirm(true)}>
                  <i class="fa fa-sign-out" aria-hidden="true" />
                </button>
              </OverlayTrigger>
            </li>
            {players &&
              players.length > 0 &&
              players.find((ele) => ele.id === userId) && (
                <li className="">
                  <OverlayTrigger
                    placement="left"
                    overlay={<Tooltip id="tooltip-disabled">Chat</Tooltip>}
                  >
                    <button
                      onClick={() => {
                        handleClick(!open);
                        setBtnToggle(!btnToggle);
                      }}
                    >
                      <i className="fa fa-comment" aria-hidden="true" />
                    </button>
                  </OverlayTrigger>
                </li>
              )}
            {isWatcher ? (
              ""
            ) : players &&
              players.length &&
              players.find((ele) => (ele.id ? ele.id : ele.userid) === userId)
                .playing ? (
              <li>
                <OverlayTrigger
                  placement="left"
                  overlay={<Tooltip id="tooltip-disabled">Stood up</Tooltip>}
                >
                  <button onClick={() => sitout()}>
                    <img src={situp} alt="sit-in" />
                  </button>
                </OverlayTrigger>
              </li>
            ) : (
              <li>
                <OverlayTrigger
                  placement="left"
                  overlay={<Tooltip id="tooltip-disabled">Sat down</Tooltip>}
                >
                  <button onClick={() => sitin()}>
                    <img src={sitdown} alt="sit-out" />
                  </button>
                </OverlayTrigger>
              </li>
            )}
            {((roomData && roomData.public) ||
              (isAdmin && roomData.gameType !== "poker1vs1_Tables")) && (
              <li>
                <OverlayTrigger
                  placement="left"
                  overlay={
                    <Tooltip id="tooltip-disabled">Invite Friends</Tooltip>
                  }
                >
                  <button onClick={() => setShowInvite(true)}>
                    {/* <img src={addcoin} alt="Invite friend" /> */}
                    <i className="fa fa-envelope"></i>
                  </button>
                </OverlayTrigger>
              </li>
            )}
            {roomData?.tournament ? (
              ""
            ) : (
              <li>
                <OverlayTrigger
                  placement="left"
                  overlay={<Tooltip id="tooltip-disabled">Fill Tokens</Tooltip>}
                >
                  <button onClick={() => setRefillSitInAmount(true)}>
                    <AddCoinIcon />
                  </button>
                </OverlayTrigger>
              </li>
            )}
            <li>
              <OverlayTrigger
                placement="left"
                overlay={
                  <Tooltip id="tooltip-disabled">
                    {volume ? "Mute" : "Speaker"}
                  </Tooltip>
                }
              >
                <button onClick={() => setVolume(!volume)}>
                  {volume ? <MuteIcon /> : <VolumeIcon />}
                </button>
              </OverlayTrigger>
            </li>
          </ul>
        )}
      <Chat
        handleClick={handleClick}
        open={open}
        userId={userId}
        tableId={tableId}
      />
      {/* <div className="play-pause-button leave-btn"><div className="pause-btn"><Button >Leave</Button> </div></div> */}
      {isWatcher && (
        <div className="bet-button">
          <span onClick={() => handleBetClick(!view)} role="presentation">
            Place Bet <img src={arrow} alt="arrow" />
          </span>
        </div>
      )}
      {roomData?.gameType?.toLowerCase() === "poker" ? <EnterAmountPopup
        handleSitin={handleSitInAmount}
        showEnterAmountPopup={showEnterAmountPopup || refillSitInAmount}
        submitButtonText={refillSitInAmount ? "Refill Tokens" : "Join"}
        setShow={
          refillSitInAmount ? setRefillSitInAmount : setShowEnterAmountPopup
        }
      /> : null}

      <Bet
        handleBetClick={handleBetClick}
        view={view}
        setView={setView}
        players={players}
        watchers={watchers}
        roomData={roomData}
        userId={userId}
      />

      <LogoImage />
      <audio className="audio-winner" muted={!volume}>
        <source src={winnerSound}></source>
      </audio>
      <audio className="audio-bet" muted={!volume}>
        <source src={call}></source>
      </audio>
      <audio className="audio-turn" muted={!volume}>
        <source src={myTurn}></source>
      </audio>
      <audio className="audio-bet" muted={!volume}>
        <source src={fold}></source>
      </audio>
      <audio className="audio-collect" muted={!volume}>
        <source src={collect}></source>
      </audio>
      <audio className="audio-check" muted={!volume}>
        <source src={check}></source>
      </audio>
      <audio className="audio-chat" muted={!volume}>
        <source src={chatBubble}></source>
      </audio>
      <StatsPopup
        modalShow={modalShow}
        setModalShow={setModalShow}
        handWinner={handWinner}
      />
      <LeaveConfirmPopup
        setLeaveConfirm={setLeaveConfirm}
        leaveConfirmShow={leaveConfirmShow}
        leaveTable={leaveTable}
        isWatcher={isWatcher}
        allowWatcher={allowWatcher}
      />
      <BuyInPopup
        setModalShow={setShowCoin}
        setBuyinPopup={setBuyinPopup}
        modalShow={showCoin}
        userId={userId}
        tableId={tableId}
        setNewJoinLowBalance={setNewJoinLowBalance}
        newJoinlowBalance={newJoinlowBalance}
        gameType={gameCollection}
      />
      <InviteFriend
        setShowInvite={setShowInvite}
        showInvite={showInvite}
        userId={userId}
        tableId={tableId}
        gameCollection={gameCollection}
        roomData={roomData}
      />
    </div>
  );
};

export default PokerTable;

const Players = ({
  winner,
  setBuyinPopup,
  playerclass,
  handMatch,
  message,
  messageBy,
  action,
  currentPlayer,
  playerData,
  actionText,
  timer,
  remainingTime,
  mergeAnimationState,
  followingList,
  setFriendList,
  setFollowingList,
  tablePot,
  blindTimer,
}) => {
  const [newPurchase, setNewPurchase] = useState(false);
  const [showFollowMe, setShowFollowMe] = useState(false);
  const [foldShowCard, setFoldShowCard] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const target = useRef(null);
  useEffect(() => {
    setShowCard(false);
    const showBuyIn = () => {
      if (
        playerData &&
        playerData.id === userId &&
        playerData.wallet === 0 &&
        roomData &&
        roomData.runninground === 0 &&
        !roomData.buyin.find(
          (ele) => ele.userid === userId && ele.redeem === 0
        ) &&
        roomData.gameType !== "pokerTournament_Tables"
      ) {
        setBuyinPopup(true);
      } else {
        setBuyinPopup(false);
      }
      if (
        playerData &&
        playerData.id === userId &&
        roomData &&
        roomData.buyin.find(
          (ele) => ele.userid === userId && ele.redeem === 0
        ) &&
        roomData.gameType !== "pokerTournament_Tables"
      ) {
        setBuyinPopup(false);
        setNewPurchase(true);
      }
    };
    if (playerData && playerData.wallet === 0) {
      showBuyIn();
    }
    if (roomData && roomData.runninground === 0) {
      setNewPurchase(false);
    }
  }, [playerData, setBuyinPopup]);

  useEffect(() => {
    // console.log("RunningRound", roomData?.runninground);
    socket.on("showCard", (data) => {
      console.log("RunningRound", roomData?.runninground);
      console.log("playerData.id", playerData.id);
      if (playerData.id === userId) {
        setShowCard(true);
      } else if (roomData?.runninground === 5) {
        if (playerData.id === data.userId) {
          setShowCard(true);
        }
      }
    });
    socket.on("hideCard", (data) => {
      if (playerData.id === data.userId) {
        setShowCard(false);
      }
    });
  }, []);

  const handleChangeFold = (e) => {
    setFoldShowCard(!foldShowCard);
    if (foldShowCard) {
      socket.emit("hideCard", {
        userId,
        gameId: roomData?._id,
      });
    } else {
      socket.emit("showCard", {
        userId,
        gameId: roomData?._id,
      });
    }
  };

  return (
    <>
      <div
        onClick={() => {
          if (playerData?.id !== userId) {
            setShowFollowMe(!showFollowMe);
          }
        }}
        ref={target}
        key={playerData?.id}
        className={`players ${playerclass} ${
          winner && playerData && winner.id === playerData.id
            ? `winner-player`
            : ``
        } ${
          playerData && playerData.playing && !playerData?.fold
            ? ""
            : "not-playing"
        } ${mergeAnimationState ? "animateMerge-chips" : ""} ${
          playerData && playerData.id === messageBy ? "playerChated" : ""
        }`}
      >
        {playerData?.availablePosition === 0 &&
          playerData?.fold &&
          roomData.runninground === 5 && (
            <div className="showCardIn-fold">
              <Form.Check
                inline
                label="Show cards !"
                name="group1"
                type="checkbox"
                id="inlinecheckbox"
                onChange={handleChangeFold}
              />
            </div>
          )}
        {playerData &&
          (playerData.fold || !playerData.playing) &&
          playerData.id === userId && (
            <ShowCard
              cards={playerData.cards ? playerData.cards : []}
              handMatch={handMatch}
            />
          )}
        {showCard ? (
          <ShowCard
            cards={playerData.cards ? playerData.cards : []}
            handMatch={handMatch}
          />
        ) : playerData && (playerData.fold || !playerData.playing) ? (
          ""
        ) : roomData && roomData.runninground === 5 ? (
          <ShowCard
            cards={playerData.cards ? playerData.cards : []}
            handMatch={handMatch}
          />
        ) : roomData &&
          roomData.runninground >= 1 &&
          playerData.id === userId ? (
          <ShowCard
            cards={playerData.cards ? playerData.cards : []}
            handMatch={handMatch}
          />
        ) : roomData && roomData.runninground === 0 ? (
          ""
        ) : (
          <HideCard />
        )}

        {/* end of win or lose animation */}
        {currentPlayer &&
          playerData &&
          currentPlayer.id === playerData.id &&
          action && <span className="player-action">{actionText}</span>}

        <div id={`store-item-${playerData.id}`}></div>
        <div
          className={`player-box ${
            currentPlayer && playerData && currentPlayer.id === playerData.id
              ? "currentPlayerChance"
              : ""
          }`}
        >
          {winner && playerData && winner.id === playerData.id && (
            <img className="coinWinning-animation" src={coinWinning} alt="" />
          )}

          {/************ player PIC avtaar  **********/}

          <div
            className="player-pic"
            style={{
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            {currentPlayer &&
              playerData &&
              currentPlayer.id === playerData.id && (
                <TimerSeparator time={timer} remainingTime={remainingTime} />
              )}
            <img
              src={
                playerData?.photoURI ||
                "https://i.pinimg.com/736x/06/d0/00/06d00052a36c6788ba5f9eeacb2c37c3.jpg"
              }
              alt=""
            />
          </div>
          <div
            className={`player-info ${
              currentPlayer && playerData && currentPlayer.id === playerData.id
                ? "progressActive"
                : ""
            } `}
          >
            <h4>
              {playerData && playerData?.name?.length > 8
                ? playerData?.name?.substring(0, 8) + ".."
                : playerData?.name}
            </h4>
            <p>
              {newPurchase
                ? "Purchase"
                : numFormatter(playerData && playerData.wallet)}
            </p>
          </div>
          {roomData &&
            roomData.runninground !== 0 &&
            playerData &&
            (playerData.isBigBlind || playerData.isSmallBlind) && (
              // || playerData.isDealer
              <div className="player-badge">
                {playerData.isSmallBlind
                  ? "S"
                  : playerData.isBigBlind
                  ? "B"
                  : // : playerData.isDealer
                    // ? "D"
                    ""}
              </div>
            )}

          {playerData && playerData.pot > 0 && playerData !== undefined ? (
            <div className="player-chip">
              <span>{numFormatter(playerData && playerData?.pot)}</span>
            </div>
          ) : (
            ""
          )}
        </div>
        {playerData && playerData.id === messageBy && (
          <BubbleMessage message={message} />
        )}
      </div>
    </>
  );
};

const TableCard = ({
  winner,
  communityCards,
  matchCards,
  roomData,
  blindTimer,
}) => {
  return (
    <div className={`table-card ${winner ? "winner-show" : ""}`}>
      {communityCards &&
        communityCards.map((card, i) => {
          // const cards = require(`../../assets/cards/${card.toUpperCase()}.svg`).default
          return (
            <div className={`card-animate active duration-${i}`}>
              <img
                key={`item-${i}`}
                // src={cards ? cards : back }
                src={`/cards/${card.toUpperCase()}.svg`}
                alt="card"
                className={`${
                  winner && matchCards.findIndex((ele) => ele === i) !== -1
                    ? `winner-card`
                    : ``
                } front-card duration-${i}`}
              />
              <img
                key={`item1-${i}`}
                src={back2}
                alt="back"
                className={`back-card duration-${i}`}
              />
            </div>
          );
        })}
    </div>
  );
};

const TablePotMoney = ({ tablePot }) => {
  return (
    <div className="total-pot-money animate__animated animate__fadeIn">
      <span>
        <p>{numFormatter(tablePot && tablePot)}</p>
      </span>
    </div>
  );
};

// const TableLogo = () => {
//   return (
//     <div className='poker-logo'>
//       <img
//         src={logo}
//         alt='logo'
//       />
//     </div>
//   );
// };

const FooterButton = ({
  bet,
  setBet,
  openAction,
  raise,
  currentPlayer,
  setRaise,
  betAction,
  callAction,
  foldAction,
  allinAction,
  raiseAction,
  checkAction,
  roomData,
  handleTentativeAction,
  tentativeAction,
  setTentativeAction,
  loader,
  raiseInSliderAction,
  betInSliderAction,
  playersLeft,
  playersRight,
  players,
}) => {
  return (
    <div className="footer-button">
      <div className="container">
        <div className="footer-container">
          {currentPlayer &&
          currentPlayer?.id === userId &&
          !currentPlayer?.tentativeAction ? (
            <>
              {openAction.fold && (
                <div className="footer-btn ">
                  <Button onClick={() => foldAction()}> Fold</Button>
                  {/* <Form.Check
                    inline
                    label="Fold"
                    name="Fold"
                    type="checkbox"
                    id={"fold"}
                    onChange={() => handleCheck("Fold")}
                    checked={selectedbets === "Fold"}
                  /> */}
                </div>
              )}
              {openAction.check && (
                <div className="footer-btn ">
                  <Button onClick={() => checkAction()}>Check</Button>
                  {/* <Form.Check
                    inline
                    name="Check"
                    type="checkbox"
                    id={"Check"}
                    onChange={() => handleCheck("Check")}
                    checked={selectedbets === "Check"}
                  /> */}
                </div>
              )}
              {openAction.call && (
                <div className="footer-btn ">
                  <Button onClick={() => callAction()}>
                    Call{" "}
                    <span
                      className={
                        roomData.raiseAmount - currentPlayer?.pot > 0
                          ? "callBtn-amount"
                          : "callBtn-amount-none"
                      }
                    >
                      {console.log(
                        " roomData?.raiseAmount - currentPlayer?.pot",
                        roomData?.raiseAmount,
                        currentPlayer?.pot
                      )}
                      {/* roomData?.raiseAmount /* - currentPlayer?.pot */}(
                      {numFormatter(roomData?.raiseAmount)})
                    </span>
                  </Button>
                  {/* <Form.Check
                    inline
                    name="Call"
                    type="checkbox"
                    id={"Call"}
                    onChange={() => handleCheck("Call")}
                    checked={selectedbets === "Call"}
                  /> */}
                </div>
              )}

              {openAction.raise && (
                <div className="footer-btn ">
                  {raise && (
                    <div className="raiseBet-container">
                      <RaiseSlider
                        currentPlayer={currentPlayer}
                        SliderAction={raiseInSliderAction}
                        roomData={roomData}
                      />
                      <RaiseView
                        currentPlayer={currentPlayer}
                        setRaise={setRaise}
                        raiseAction={raiseAction}
                        allinAction={allinAction}
                        roomData={roomData}
                        players={players}
                      />
                    </div>
                  )}
                  <Button
                    onClick={() => {
                      setBet(false);
                      setRaise(true);
                    }}
                  >
                    {/* <Form.Check
                      inline
                      label="Raise"
                      name="Raise"
                      type="checkbox"
                      id={"Raise"}
                      onChange={() => handleCheck("Raise")}
                      checked={selectedbets === "Raise"}
                    /> */}
                    Raise
                  </Button>
                </div>
              )}

              {openAction.bet && (
                <div className="footer-btn ">
                  {bet && (
                    <div className="raiseBet-container">
                      <RaiseSlider
                        currentPlayer={currentPlayer}
                        SliderAction={betInSliderAction}
                        roomData={roomData}
                      />
                      <BetView
                        currentPlayer={currentPlayer}
                        setBet={setBet}
                        betAction={betAction}
                        allinAction={allinAction}
                        roomData={roomData}
                        players={players}
                      />
                    </div>
                  )}
                  <Button
                    onClick={() => {
                      setBet(true);
                      setRaise(false);
                    }}
                  >
                    {/* <Form.Check
                      inline
                      label="Bet"
                      name="Bet"
                      type="checkbox"
                      id={"Bet"}
                      onChange={() => handleCheck("Bet")}
                      checked={selectedbets === "Bet"}
                    /> */}
                    Bet
                  </Button>
                </div>
              )}
              {!openAction.raise && !openAction.bet && openAction.allin && (
                <div className="footer-btn ">
                  <Button onClick={() => allinAction()}>
                    {/* <Form.Check
                      inline
                      label="All In"
                      name="AllIn"
                      type="checkbox"
                      id={"AllIn"}
                      onChange={() => handleCheck("All In")}
                      checked={selectedbets === "All In"}
                    /> */}
                    All In
                  </Button>
                </div>
              )}
            </>
          ) : (
            // ""

            <>
              {roomData?.gamestart &&
                roomData.runninground >= 1 &&
                roomData.runninground < 5 &&
                players.find((el) => el.id === userId)?.cards?.length === 2 &&
                !players.find((el) => el.id === userId)?.fold &&
                !(
                  roomData.lastAction === "check" &&
                  players.find((el) => el.id === userId)?.action === true
                ) &&
                players.find((el) => el.id === userId).actionType !==
                  "all-in" && (
                  <AdvanceActionBtn
                    setTentativeAction={setTentativeAction}
                    tentativeAction={tentativeAction}
                    handleTentativeAction={handleTentativeAction}
                    roomData={roomData}
                    currentPlayer={currentPlayer}
                    player={players.find((el) => el.id === userId)}
                  />
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const PlayPauseBtn = ({ pauseGame, resumeGame, finishGame }) => {
  const [isFinishClick, setisFinishClick] = useState(false);
  return (
    <div className="play-pause-button">
      {roomData && roomData.autoNextHand ? (
        roomData.pause ? (
          <>
            <div className="play-btn">
              <Button onClick={() => resumeGame()}>Resume</Button>
            </div>
            <div className="pause-btn">
              <Button
                onClick={() => {
                  finishGame();
                  setisFinishClick(true);
                }}
                disabled={isFinishClick}
              >
                Finish
              </Button>
            </div>
          </>
        ) : (
          <>
            {" "}
            <div className="play-btn">
              <Button onClick={() => pauseGame()}>Pause</Button>
            </div>
            <div className="pause-btn">
              <Button
                onClick={() => {
                  finishGame();
                  setisFinishClick(true);
                }}
                disabled={isFinishClick}
              >
                Finish
              </Button>
            </div>
          </>
        )
      ) : (
        ""
      )}
    </div>
  );
};

const HideCard = () => {
  return (
    <div className="player-card">
      <img
        src={front}
        alt="card"
        className="animate__animated animate__rollIn duration-0"
      />
      <img
        src={back}
        alt="card"
        className="animate__animated animate__rollIn duration-1"
      />
    </div>
  );
};

const ShowCard = ({ cards, handMatch }) => {
  return (
    <div className="show-card">
      {cards &&
        cards.map((card, i) => (
          <img
            key={`item-${card}`}
            src={`/cards/${card.toUpperCase()}.svg`}
            alt="card"
            className={`animate__animated animate__rollIn duration-${i} ${
              handMatch.findIndex((ele) => ele === i) !== -1
                ? ``
                : `winner-card`
            } `}
          />
        ))}
    </div>
  );
};

const GameMessage = ({ winnerText }) => {
  return (
    <div className="game-msg">
      <p className={winnerText !== "" ? "winner-text" : ""}>{winnerText}</p>
    </div>
  );
};

const BubbleMessage = ({ message }) => {
  return (
    <div className="bubble-msg">
      <div className="triangle-isosceles left">{message}</div>
    </div>
  );
};

const LogoImage = () => {
  return (
    <div className="logo--bottom-image">
      <img src={footerlogo} alt="footer-logo" />
    </div>
  );
};

const RenderTooltip = ({ playerData }) => {
  const {
    name,
    photoURI: playerImage,
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

const TimerSeparator = ({ time, remainingTime }) => {
  const [activeTime, setActiveTime] = useState(100);
  useEffect(() => {
    if (remainingTime && time) {
      let percent = (remainingTime / time) * 100;
      setActiveTime(parseInt(percent));
    }
  }, [remainingTime]);

  const handelColor = () => {
    if (activeTime > 67) {
      return "success";
    } else if (activeTime < 68 && activeTime > 33) {
      return "warning";
    } else {
      return "danger";
    }
  };

  return <ProgressBar animated variant={handelColor()} now={activeTime} />;
};
