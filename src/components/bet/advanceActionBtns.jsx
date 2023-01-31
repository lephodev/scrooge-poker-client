import React from "react";
import { Form, Button } from "react-bootstrap";
// import RaiseView from "./raiseView";
// import RaiseSlider from "./raiseSlider";
import "./bet.css";

const AdvanceActionBtns = ({
  handleTentativeAction,
  tentativeAction,
  roomData,
  currentPlayer,
}) => {
  console.log("tentativeAction IN Advance", tentativeAction);
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
          onChange={handleTentativeAction}
          // defaultChecked={player?.tentativeAction?.startsWith("check")}
          //  disabled={player?.tentativeAction !== null && player.id === userId}
          id="inline-checkbox-3"
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
          type="checkbox"
          key="check/fold"
          onChange={handleTentativeAction}
          //  defaultChecked={player?.tentativeAction?.startsWith("check/fold")}
          //  disabled={player?.tentativeAction !== null && player.id === userId}
          id="inline-checkbox-2"
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
          type="checkbox"
          key="check"
          onChange={handleTentativeAction}
          // defaultChecked={player?.tentativeAction?.startsWith("check")}
          //  disabled={player?.tentativeAction !== null && player.id === userId}
          id="inline-checkbox-3"
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
          // defaultChecked={player?.tentativeAction?.startsWith("call")}
          label="Call Any"
          value="callAny"
          name="group1"
          type="checkbox"
          key="callAny"
          onChange={handleTentativeAction}
          //  disabled={player?.tentativeAction !== null && player.id === userId}
          id="inline-checkbox-5"
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
          //defaultChecked={player?.tentativeAction?.startsWith("allin")}
          label="All-in"
          value={`all-in`}
          name="group1"
          type="checkbox"
          key="allin"
          onChange={handleTentativeAction}
          //  disabled={player?.tentativeAction !== null && player.id === userId}
          id="inline-checkbox-6"
          checked={tentativeAction === `all-In`}
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
          label={`Call`}
          value={`call`}
          name="group1"
          type="checkbox"
          key="call"
          onChange={handleTentativeAction}
          //  disabled={player?.tentativeAction !== null && player.id === userId}
          id="inline-checkbox-4"
          checked={tentativeAction === `call`}
        />
      </Button>
    </div>
  );

  let btn = "";
  if (
    roomData?.raiseAmount === currentPlayer?.pot ||
    roomData?.lastAction === "check"
  ) {
    btn = (
      <>
        {CALL_ANY_BTN}
        {CHECK_BTN}
        {CHECK_FOLD_BTN}
      </>
    );
  } else if (roomData?.raiseAmount > currentPlayer?.pot) {
    if (currentPlayer?.wallet >= roomData?.raiseAmount) {
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
