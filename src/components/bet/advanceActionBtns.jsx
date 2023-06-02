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
  }, [currentPlayer, player?.tentativeAction]);

  // let actionTrigr;

  const handleAction = (e) => {
    // if (actionTrigr) {
    //   clearTimeout(actionTrigr);
    // }
    // actionTrigr = setTimeout(() => {
    handleTentativeAction(e)
    // }, 500);
  }


  const FOLD_BTN = (
    <div className="footer-btn ">
      <Button>
        <Form.Check
          className="tentative-action-btn"
          inline
          label="Fold"
          value="fold"
          name="group1"
          type="checkbox"
          key="fold"
          onChange={handleAction}
          // defaultChecked={player?.tentativeAction?.startsWith("fold")}
          checked={player?.tentativeAction?.startsWith("fold")}
          //  disabled={player?.tentativeAction !== null && player.id === userId}
          id="inline-radio-3"
        // checked={tentativeAction === "fold"}
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
          type="checkbox"
          key="check/fold"
          onChange={handleAction}
          // defaultChecked={player?.tentativeAction?.startsWith("check/fold")}
          checked={player?.tentativeAction?.startsWith("check/fold")}
          //  disabled={player?.tentativeAction !== null && player.id === userId}
          id="inline-radio-2"
        // checked={tentativeAction === "check/fold"}
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
          type="checkbox"
          key="check"
          onChange={handleAction}
          // defaultChecked={player?.tentativeAction?.startsWith("check")}
          checked={player?.tentativeAction === "check"}
          //  disabled={player?.tentativeAction !== null && player.id === userId}
          id="inline-radio-3"
        // checked={tentativeAction === "check"}
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
          // defaultChecked={player?.tentativeAction?.startsWith("call")}
          checked={player?.tentativeAction === "callAny"}
          label="Call Any"
          value="callAny"
          name="group1"
          type="checkbox"
          key="callAny"
          onChange={handleAction}
          //  disabled={player?.tentativeAction !== null && player.id === userId}
          id="inline-radio-5"
        // checked={tentativeAction === "callAny"}
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
          // defaultChecked={player?.tentativeAction?.startsWith("allin")}
          checked={player?.tentativeAction?.startsWith("allin")}
          label="All-in"
          value={`allin ${ player?.wallet }`}
          name="group1"
          type="checkbox"
          key="allin"
          onChange={handleAction}
          //  disabled={player?.tentativeAction !== null && player.id === userId}
          id="inline-radio-6"
        // checked={tentativeAction?.includes("allin")}
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
          // defaultChecked={player?.tentativeAction?.startsWith("call")}
          label={`Call ${ numFormatter(roomData?.raiseAmount - player?.pot) }`}
          value={`call ${ roomData?.raiseAmount - player?.pot }`}
          name="group1"
          type="checkbox"
          key="call"
          onChange={handleAction}
          //  disabled={player?.tentativeAction !== null && player.id === userId}
          id="inline-radio-4"
          checked={player?.tentativeAction?.startsWith("call ")}
        // checked={
        //   tentativeAction === `call ${ roomData?.raiseAmount - player?.pot }`
        // }
        />
      </Button>
    </div>
  );
  const DISABLE_BTN = (
    <div className="footer-btn hiddenBtn">
      <Button disabled="true">
        {" "}
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
        {CHECK_FOLD_BTN}
        {CHECK_BTN}
        {CALL_ANY_BTN}
      </>
    );
  } else if (roomData?.raiseAmount > player?.pot) {
    if (player?.wallet >= roomData?.raiseAmount) {
      btn = (
        <>
          {FOLD_BTN}
          {CALL_BTN}
          {CALL_ANY_BTN}
        </>
      );
    } else {
      btn = (
        <>
          {FOLD_BTN}
          {DISABLE_BTN}
          {ALL_IN_BTN}
        </>
      );
    }
  }
  return btn;
};

export default AdvanceActionBtns;
