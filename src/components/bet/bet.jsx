import React, { useRef, useEffect, useState } from "react";
import closeicon from "../../assets/close.png";
import user from "../../assets/profile_user.jpg";
import { Form, Button, Spinner } from "react-bootstrap";
import "./bet.css";
import { socket } from "../../config/socketConnection";
import firebase from "../../config/firebase";
import logo from "../../assets/chat/logocoin.png";
import toast from "react-hot-toast";

const Bet = ({
  view,
  setView,
  handleBetClick,
  watchers,
  players,
  roomData,
  userId,
}) => {
  const [player, setPlayer] = useState(null);
  const [amount, setAmount] = useState(0);
  const [betType, setBetType] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [isBothSelected, setIsBothSelected] = useState(true);
  const [loading, setLoading] = useState(false);
  const [bet, setBet] = useState([]);

  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setView(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };

  const createNewBet = (e) => {
    e.preventDefault();
    setLoading(true);
    const betby = watchers.find((ele) => ele.userid === userId);
    if (betby && player && amount !== 0) {
      socket.emit("newBet", {
        player,
        amount,
        betType,
        user: betby,
        tableId: roomData.tableId,
      });
      setPlayer(null);
      setAmount(0);
      setBetType(false);
      setIsSelected(true);
      setIsBothSelected(true);
    } else {
      setLoading(false);
    }
  };

  const handleChange = (e, type) => {
    if (e.target.value === "Select") {
      if (type === "player") {
        setPlayer(null);
      } else if (type === "amount") {
        setAmount(0);
      }
      return setIsBothSelected(true);
    }
    if (type === "player" && e.target.value !== "Select") {
      const pl = players.find((ele) => ele.id === e.target.value);
      setPlayer({
        name: pl.name,
        photoURI: pl.photoURI,
        id: pl.id,
      });
      if (amount) {
        setIsBothSelected(false);
      }
      setIsSelected(false);
    } else if (type === "amount" && e.target.value !== "Select") {
      setAmount(parseInt(e.target.value));
      setIsSelected(false);
      if (player) {
        setIsBothSelected(false);
      }
    } else if (type === "betType") {
      if (e.target.checked) {
        setBetType(true);
      } else {
        setBetType(false);
      }
    }
  };

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);
  useEffect(() => {
    socket.on("betMatched", () => {
      setLoading(false);
      toast.success("Your bet matched with watcher bet", { id: "A" });
    });
    socket.on("betCreated", () => {
      setLoading(false);
      toast.success("Bet card created.", { id: "A" });
    });
    socket.on("newBetPlaced", (data) => {
      setBet(data.bet);
    });
    socket.on("yourBetCard", () => {
      setLoading(false);
      toast.error("You cannot bet on your card", { id: "A" });
    });
    socket.on("lowBalanceBet", (data) => {
      setLoading(false);
      toast.error("Not Enough coin to bet.", { id: "A" });
    });
    socket.on("watcherWinners", (data) => {
      let bb = [...bet];
      let winnBet = [];
      let winners = data.winner;
      bb.forEach((item) => {
        if (item.isAccepted) {
          let win = winners.find(
            (ele) => ele.betId === item._id && ele.userid === userId
          );
          if (win) {
            winnBet.push({
              ...item,
              win: true,
            });
          } else if (
            item.betBy.userid === userId ||
            item.betAcceptBy.userid === userId
          ) {
            winnBet.push({
              ...item,
              win: false,
            });
          }
        }
      });
      bb.forEach((item) => {
        if (item.isAccepted) {
          let win = winners.find((ele) => ele.betId === item._id);
          if (
            win &&
            win.userid === item.betBy.userid &&
            item.betBy.userid !== userId &&
            item.betAcceptBy.userid !== userId
          ) {
            winnBet.push({
              ...item,
              betByWin: true,
            });
          } else if (
            win &&
            win.userid === item.betAcceptBy.userid &&
            item.betBy.userid !== userId &&
            item.betAcceptBy.userid !== userId
          ) {
            winnBet.push({
              ...item,
              acceptByWin: true,
            });
          }
        }
      });

      setBet(winnBet);
      setTimeout(() => {
        setBet([]);
      }, 13000);
    });
  }, [bet, userId]);

  return (
    <div className={`bet-wrapper ${!view ? `` : `expand`}`} ref={wrapperRef}>
      {roomData && roomData.gamestart ? (
        roomData.watchers.length < 2 ? (
          <div className="games-not-found">
            <div className="game-not-started">
              <img src={logo} alt="logo" />
              <p>Please wait there is only You as watcher, you can't bet</p>
            </div>
          </div>
        ) : (
          <div className="bet-container">
            <div className="bet-header">
              Place a Bet
              <span onClick={() => handleBetClick(!view)} role="presentation">
                <img src={closeicon} alt="close" />
              </span>
            </div>
            <div className="bet-content">
              <div className="bet-form">
                <Form onSubmit={createNewBet}>
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Select a Player</Form.Label>
                        <Form.Control
                          as="select"
                          onChange={(e) => handleChange(e, "player")}
                          defaultValue="Select"
                        >
                          <option value={null} selected={isSelected}>
                            Select
                          </option>
                          {players &&
                            players.map(
                              (item, i) =>
                                !item.fold && (
                                  <option value={item.id} key={`item-${i}`}>
                                    {item.name}
                                  </option>
                                )
                            )}
                        </Form.Control>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group controlId="exampleForm.ControlSelect2">
                        <Form.Label>Select amount</Form.Label>
                        <Form.Control
                          as="select"
                          onChange={(e) => handleChange(e, "amount")}
                          defaultValue="Select"
                        >
                          <option value={null} selected={isSelected}>
                            Select
                          </option>
                          <option value={100}>100</option>
                          <option value={200}>200</option>
                          <option value={300}>300</option>
                          <option value={400}>400</option>
                          <option value={500}>500</option>
                        </Form.Control>
                      </Form.Group>
                    </div>
                    <div className="col-md-6 col-6">
                      <div className="bet-switch">
                        <div className="switch-title">
                          <span>Lose</span>
                          <span>Winner</span>
                        </div>
                        <label class="switch">
                          <input
                            type="checkbox"
                            checked={betType}
                            onChange={(e) => handleChange(e, "betType")}
                          />
                          <span class="slider round"></span>
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6 col-6">
                      <Form.Group controlId="exampleForm.ControlSelect2">
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={loading || isBothSelected}
                          className={`${
                            loading || isBothSelected ? "disable-btn" : ""
                          }`}
                        >
                          {loading ? <Spinner animation="border" /> : "Bet"}
                        </Button>
                      </Form.Group>
                    </div>
                  </div>
                </Form>
              </div>

              <div className="bet-listing">
                {bet &&
                  bet.map((item, i) => (
                    <BetPlayer
                      item={item}
                      watchers={watchers}
                      userId={userId}
                      tableId={roomData.tableId}
                    />
                  ))}
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="games-not-found">
          <div className="game-not-started">
            <img src={logo} alt="logo" />
            <p>Game is not started please wait</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bet;

const BetPlayer = ({ item, watchers, userId, tableId }) => {
  const [player, setPlayer] = useState(
    "https://firebasestorage.googleapis.com/v0/b/mycool-net-app.appspot.com/o/default-avatar%2Fdefault-avatar_homePageLogo.png?alt=media&token=82a95636-78d2-4c68-8acc-25878e24d663"
  );
  const [betBy, setBetBy] = useState(
    "https://firebasestorage.googleapis.com/v0/b/mycool-net-app.appspot.com/o/default-avatar%2Fdefault-avatar_homePageLogo.png?alt=media&token=82a95636-78d2-4c68-8acc-25878e24d663"
  );
  const [acceptby, setAcceptBy] = useState(
    "https://firebasestorage.googleapis.com/v0/b/mycool-net-app.appspot.com/o/default-avatar%2Fdefault-avatar_homePageLogo.png?alt=media&token=82a95636-78d2-4c68-8acc-25878e24d663"
  );
  useEffect(() => {
    if (item) {
      var storage = firebase.storage();
      var gsReference = storage.refFromURL(item.selectedBetPlayer.photoURI);
      gsReference
        .getDownloadURL()
        .then(function (url) {
          setPlayer(url);
        })
        .catch(function (error) {
          console.log("error", error);
        });
      var betreference = storage.refFromURL(item.betBy.photoURI);
      betreference
        .getDownloadURL()
        .then(function (url) {
          setBetBy(url);
        })
        .catch(function (error) {
          console.log("error", error);
        });
      if (item.betAcceptBy) {
        var acceptreference = storage.refFromURL(item.betAcceptBy.photoURI);
        acceptreference
          .getDownloadURL()
          .then(function (url) {
            setAcceptBy(url);
          })
          .catch(function (error) {
            console.log("error", error);
          });
      }
    }
  }, [item]);

  const handleAcceptBet = (id) => {
    const acceptby = watchers.find((ele) => ele.userid === userId);
    socket.emit("acceptBet", { betId: id, betAcceptBy: acceptby, tableId });
  };
  return (
    <div
      className={`bet-player ${
        item && item.win === undefined ? "" : item.win ? "win" : "loss"
      }`}
    >
      <div className="bet-player-info">
        <div className="bet-player-name">
          <div className="bet-player-pic">
            <img src={player !== "" ? player : user} alt="" />
          </div>
          <div className="bet-player-title">
            <h5>
              {item.selectedBetPlayer.name.length > 11
                ? item.selectedBetPlayer.name.substring(0, 11) + ".."
                : item.selectedBetPlayer.name}
            </h5>
            <span>{item.betAmount}</span>
          </div>
        </div>

        <div className="bet-result">
          <span>{item.betType ? "Winner" : "Loser"}</span>
        </div>
      </div>

      <div className="bet-footer">
        <div className={`bet-challenger`}>
          <div
            className={`${
              item && item.betByWin === undefined
                ? ""
                : item.betByWin
                ? "bet-winner"
                : ""
            }`}
          >
            <img src={betBy !== "" ? betBy : user} alt="" />
            <span>
              {item.betBy.name.length > 8
                ? item.betBy.name.substring(0, 8) + ".."
                : item.betBy.name}
            </span>
          </div>
        </div>
        <div className="bet-vs">VS</div>
        <div className={`bet-challenger`}>
          <div
            className={`${
              item && item.acceptByWin === undefined
                ? ""
                : item.acceptByWin
                ? "bet-winner"
                : ""
            }`}
          >
            {item.betAcceptBy ? (
              <>
                <img src={acceptby !== "" ? acceptby : user} alt="" />
                <span>
                  {item.betAcceptBy.name.length > 8
                    ? item.betAcceptBy.name.substring(0, 8) + ".."
                    : item.betAcceptBy.name}
                </span>
              </>
            ) : (
              <Button
                onClick={() => handleAcceptBet(item._id)}
                disabled={item.betBy.userid === userId}
              >
                Accept
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
