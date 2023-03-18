/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import numFormatter from "../../utils/utils";
// import numFormatter from "../../utils/utils";
// import RaiseView from "./raiseView";
// import RaiseSlider from "./raiseSlider";
import "./bet.css";

const AdvanceActionBtns = ({
  handleTentativeAction,
  tentativeAction,
  setTentativeAction,
  roomData,
  currentPlayer,
  player,
}) => {
  useEffect(() => {
    if (player?.tentativeAction === null) {
      setTentativeAction();
    } else {
      setTentativeAction(player?.tentativeAction);
    }
  }, [currentPlayer, player]);
  const FOLD_BTN = (
    <div className="footer-btn ">
      <Button>
        <Form.Check
          className="tentative-action-btn"
          inline
          label="Fold"
          value="fold"
          name="group1"
          type="radio"
          key="fold"
          onChange={handleTentativeAction}
          defaultChecked={player?.tentativeAction?.startsWith("fold")}
          //  disabled={player?.tentativeAction !== null && player.id === userId}
          id="inline-radio-3"
          checked={tentativeAction === "fold"}
        />
      </Button>
    </div>
  );
  const CHECK_FOLD_BTN = (
    <div className="footer-btn ">
      <Button>
        <Form.Check
          className="tentative-action-btn"
          inline
          label="Check/Fold"
          value="check/fold"
          name="group1"
          type="radio"
          key="check/fold"
          onChange={handleTentativeAction}
          defaultChecked={player?.tentativeAction?.startsWith("check/fold")}
          //  disabled={player?.tentativeAction !== null && player.id === userId}
          id="inline-radio-2"
          checked={tentativeAction === "check/fold"}
        />
      </Button>
    </div>
  );

  const CHECK_BTN = (
    <div className="footer-btn ">
      <Button>
        <Form.Check
          className="tentative-action-btn"
          inline
          label="Check"
          value="check"
          name="group1"
          type="radio"
          key="check"
          onChange={handleTentativeAction}
          defaultChecked={player?.tentativeAction?.startsWith("check")}
          //  disabled={player?.tentativeAction !== null && player.id === userId}
          id="inline-radio-3"
          checked={tentativeAction === "check"}
        />
      </Button>
    </div>
  );

  const CALL_ANY_BTN = (
    <div className="footer-btn ">
      <Button>
        <Form.Check
          className="tentative-action-btn"
          inline
          defaultChecked={player?.tentativeAction?.startsWith("call")}
          label="Call Any"
          value="callAny"
          name="group1"
          type="radio"
          key="callAny"
          onChange={handleTentativeAction}
          //  disabled={player?.tentativeAction !== null && player.id === userId}
          id="inline-radio-5"
          checked={tentativeAction === "callAny"}
        />
      </Button>
    </div>
  );

  const ALL_IN_BTN = (
    <div className="footer-btn ">
      <Button>
        <Form.Check
          className="tentative-action-btn"
          inline
          defaultChecked={player?.tentativeAction?.startsWith("allin")}
          label="All-in"
          value={`allin ${player?.wallet}`}
          name="group1"
          type="radio"
          key="allin"
          onChange={handleTentativeAction}
          //  disabled={player?.tentativeAction !== null && player.id === userId}
          id="inline-radio-6"
          checked={tentativeAction?.includes("allin")}
        />
      </Button>
    </div>
  );

  const CALL_BTN = (
    <div className="footer-btn ">
      <Button>
        <Form.Check
          className="tentative-action-btn"
          inline
          defaultChecked={player?.tentativeAction?.startsWith("call")}
          label={`Call ${numFormatter(roomData?.raiseAmount - player?.pot)}`}
          value={`call ${roomData?.raiseAmount - player?.pot}`}
          name="group1"
          type="radio"
          key="call"
          onChange={handleTentativeAction}
          //  disabled={player?.tentativeAction !== null && player.id === userId}
          id="inline-radio-4"
          checked={
            tentativeAction === `call ${roomData?.raiseAmount - player?.pot}`
          }
        />
      </Button>
    </div>
  );

  let btn = "";
  if (
    roomData?.raiseAmount === player?.pot ||
    roomData?.lastAction === "check"
  ) {
    btn = (
      <>
        {CALL_ANY_BTN}
        {CHECK_BTN}
        {CHECK_FOLD_BTN}
      </>
    );
  } else if (roomData?.raiseAmount > player?.pot) {
    if (player?.wallet >= roomData?.raiseAmount) {
      btn = (
        <>
          {CALL_ANY_BTN}
          {CALL_BTN}
          {FOLD_BTN}
        </>
      );
    } else {
      btn = (
        <>
          {ALL_IN_BTN}
          {CHECK_FOLD_BTN}
        </>
      );
    }
  }
  return btn;
};

export default AdvanceActionBtns;
