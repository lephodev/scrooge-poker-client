import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Modal, Button } from "react-bootstrap";
import {
  CardElement,
  Elements,
  ElementsConsumer,
} from "@stripe/react-stripe-js";
import GooglePay from "./googlePay";
import axios from "axios";
import { isChrome, isSafari } from "react-device-detect";
import "./stripe.css";
import check from "../../assets/images/profile/check.png";
import info from "../../assets/images/profile/info.png";
import cancel from "../../assets/images/profile/cancel.png";
import loader from "../../assets/images/profile/Rolling-2.6s-88px (1).gif";
import coin6 from "../../assets/images/profile/coin-6.png";
import coin5 from "../../assets/images/profile/coin-5.png";
import coin4 from "../../assets/images/profile/coin-4.png";
import coin3 from "../../assets/images/profile/coin-3.png";
import coin2 from "../../assets/images/profile/coin-2.png";
import coin1 from "../../assets/images/profile/coin-1.png";
import tag1 from "../../assets/images/profile/tag.png";
import tag2 from "../../assets/images/profile/tag2.png";
import { socket } from "../../config/socketConnection";
import firebase from "../../config/firebase";
import ApplePay from "./ApplePay";
import PayPal from "./payPal";
import "./buyPopup.css";

const CheckoutForm = (props) => {
  const [idToken, setIdToken] = useState("");
  const [confirmState, setConfirmState] = useState(false);
  const [stripebox, setStripebox] = useState(true);
  const [stripeCard, setStripeCard] = useState(false);
  const [permitionState, setPermitionState] = useState(false);
  const [stripeFail, setStripeFail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardErr, setcardErr] = useState("");
  const [card, setcard] = useState("");
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const getIdToken = async () => {
      const token = await firebase.auth().currentUser.getIdToken();
      setIdToken(token);
    };
    getIdToken();
  }, []);

  useEffect(() => {
    socket.on("CoinsAdded", () => {
      setPermitionState(true);
      setLoading(false);
      setConfirmState(false);
      setStripeCard(false);
      if (props.values.newJoinlowBalance)
        props.values.setNewJoinLowBalance(true);
    });
    socket.on("addFail", () => {
      setStripeFail(true);
      setLoading(false);
      if (props.values.newJoinlowBalance)
        props.values.setNewJoinLowBalance("fail");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    try {
      const { stripe, elements, values } = props;
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        values.client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );
      if (error.code === "resource_missing") {
        setStripeFail(true);
        setLoading(false);
        setcardErr("Not a valid card");
        if (props.values.newJoinlowBalance)
          props.values.setNewJoinLowBalance("fail");
      }
      if (paymentIntent === undefined && error.code === "card_declined") {
        setStripeFail(true);
        setLoading(false);
        setcardErr("Card declined");
        if (props.values.newJoinlowBalance)
          props.values.setNewJoinLowBalance("fail");
      }
      if (!error && paymentIntent) {
        if (values.newJoinlowBalance) {
          if (paymentIntent.status === "succeeded") {
            await axios
              .get("https://auth-api-t3e66zpola-ue.a.run.app", {
                params: {
                  service: "buyCoins",
                  params: `usid=${values.uid},action=buy-coins,id=${
                    paymentIntent.id
                  },from=social_media,usd=${
                    values.paymentValue / 100
                  },payMethod=card,cardNr=${card}`,
                },
                headers: { idtoken: idToken },
              })
              .then((response) => {
                if (
                  response.data.error === "no error" &&
                  response.data.success === true
                ) {
                  setPermitionState(true);
                  setLoading(false);
                  setConfirmState(false);
                  setStripeCard(false);
                  if (props.values.newJoinlowBalance)
                    props.values.setNewJoinLowBalance(true);
                } else {
                  setStripeFail(true);
                  setLoading(false);
                  if (props.values.newJoinlowBalance)
                    props.values.setNewJoinLowBalance("fail");
                }
              })
              .catch((error) => {
                setStripeFail(true);
                setLoading(false);
                if (props.values.newJoinlowBalance)
                  props.values.setNewJoinLowBalance("fail");
              });
          }
          if (paymentIntent.code === "card_declined") {
            setStripeFail(true);
            setLoading(false);
            setcardErr("Card Declined");
            if (props.values.newJoinlowBalance)
              props.values.setNewJoinLowBalance("fail");
          }
        } else {
          socket.emit("addCoins", {
            userId: values.uid,
            tableId: values.tableId,
            amt: values.numCoins,
            usd: values.paymentValue,
            payMethod: "card",
            cardNr: card,
          });
        }
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleChange = (change) => {
    setcard(change.brand);
    if (change.complete) {
      setcardErr("");
      setComplete(true);
    }
  };

  const handleBlur = () => {};

  const handleClick = () => {};
  const handleFocus = () => {};
  const handleReady = () => {};

  const handleClickStripe = (coin, usd) => {
    props.onChangeValue(coin, usd);
    setStripebox(false);
    setStripeCard(true);
  };
  const handleStripePay = () => {
    if (complete) {
      setConfirmState(true);
    } else {
      setcardErr("Please fill details Properly");
    }
  };

  const handlePermition = () => {
    setLoading(true);
    handleSubmit();
  };

  const handlePermitionFail = () => {
    setStripeFail(true);
    setLoading(false);
    setConfirmState(false);
    if (props.values.newJoinlowBalance)
      props.values.setNewJoinLowBalance("fail");
  };
  const closePopUp = () => {
    setPermitionState(false);
    setStripeFail(false);
    props.setModalShow(false);
  };

  return (
    <div>
      {stripebox ? (
        <>
          {/* <div>
            <h5 className="CoinsHeader">
              Please select a <b style={{ color: "#fff" }}> Plan</b>
            </h5>
            <br></br>
          </div> */}
          <div className="buy-coins-popup">
            <div className="buy-coins-list">
              <div
                className="buy-coins-box"
                onClick={() => handleClickStripe(1000000, 9999)}
              >
                <div className="tag-label">
                  <img src={tag1} alt="lvcoins" className="tag-img" />
                </div>
                <h5>1,000,000</h5>
                <img src={coin1} alt="lvcoins" />
                <Button>{(99.99 * props.values.exchangeRate).toFixed(2)} &nbsp;{props.values.currency}</Button>
              </div>
              <div
                className="buy-coins-box"
                onClick={() => handleClickStripe(360000, 4999)}
              >
                <h5>360,000</h5>
                <img src={coin2} alt="lvcoins" />
                <Button>{(49.99 * props.values.exchangeRate).toFixed(2)} &nbsp;{props.values.currency}</Button>
              </div>
              <div
                className="buy-coins-box buy-coin-image"
                onClick={() => handleClickStripe(120000, 1999)}
              >
                <div className="tag-label">
                  <img src={tag2} alt="lvcoins" className="tag-img" />
                </div>
                <h5>120,000</h5>
                <img src={coin3} alt="lvcoins" />
                <Button>1{(19.99 * props.values.exchangeRate).toFixed(2)} &nbsp;{props.values.currency}</Button>
              </div>
              <div
                className="buy-coins-box"
                onClick={() => handleClickStripe(50000, 999)}
              >
                <h5>50,000</h5>
                <img src={coin4} alt="lvcoins" />
                <Button>{(9.99 * props.values.exchangeRate).toFixed(2)} &nbsp;{props.values.currency}</Button>
              </div>
              <div
                className="buy-coins-box"
                onClick={() => handleClickStripe(20000, 499)}
              >
                <h5>20,000</h5>
                <img src={coin5} alt="lvcoins" />
                <Button>{(4.99 * props.values.exchangeRate).toFixed(2)} &nbsp;{props.values.currency}</Button>
              </div>
              <div
                className="buy-coins-box"
                onClick={() => handleClickStripe(10000, 299)}
              >
                <h5>10,000</h5>
                <img src={coin6} alt="lvcoins" />
                <Button>{(2.99 * props.values.exchangeRate).toFixed(2)} &nbsp;{props.values.currency}</Button>
              </div>
            </div>
          </div>
        </>
      ) : stripeCard ? (
        <>
          <div>
            <h5 className="CoinsHeader">
              Get{" "}
              <b style={{ color: "#ffc107" }}>
                {props.values.numCoins.toLocaleString()}
              </b>{" "}
              LV Coins
            </h5>
          </div>

          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#fff",
                  "::placeholder": {
                    color: "#fff",
                  },
                },
                invalid: {
                  color: "#fff",
                },
              },
            }}
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            onReady={handleReady}
            onClick={handleClick}
          />
          <div className="payment-btn">
            {cardErr !== "" && <p>{cardErr}</p>}
            <div className="sub-btn text-center">
              {complete && (
                <button
                  type="submit"
                  onClick={handleStripePay}
                  disabled={!props.stripe}
                >
                  Pay
                </button>
              )}
            </div>
            {isChrome ? (
              <GooglePay
                uid={props.values.uid}
                idToken={idToken}
                paymentValue={props.values.paymentValue}
                handleSuccess={() => {
                  setPermitionState(true).setStripeCard(false);
                }}
                handlePermitionFail={handlePermitionFail}
                numCoins={props.values.numCoins}
                client_secret={props.values.client_secret}
                tableId={props.values.tableId}
              />
            ) : (
              ""
            )}
            {isSafari ? (
              <ApplePay
                uid={props.values.uid}
                idToken={idToken}
                paymentValue={props.values.paymentValue}
                handleSuccess={() => {
                  setPermitionState(true).setStripeCard(false);
                }}
                handlePermitionFail={handlePermitionFail}
                numCoins={props.values.numCoins}
                client_secret={props.values.client_secret}
                tableId={props.values.tableId}
              />
            ) : (
              ""
            )}
            <PayPal
              uid={props.values.uid}
              idToken={idToken}
              paymentValue={props.values.paymentValue}
              handleSuccess={() => {
                setPermitionState(true).setStripeCard(false);
              }}
              handlePermitionFail={handlePermitionFail}
              numCoins={props.values.numCoins}
              client_secret={props.values.client_secret}
              tableId={props.values.tableId}
            />
          </div>
        </>
      ) : permitionState ? (
        <StripeSuccess closePopUp={closePopUp} values={props.values} />
      ) : stripeFail ? (
        <StripeFailed closePopUp={closePopUp} />
      ) : (
        ""
      )}
      <Modal
        show={confirmState}
        centered
        className="friends-popup stripe-modal stripe-confirmation-popup "
      >
        <Modal.Body>
          <div className="block">
            <StripeConfirmation
              loading={loading}
              handlePermition={handlePermition}
              handlePermitionFail={handlePermitionFail}
              values={props.values}
            />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const StripeConfirmation = (props) => {
  return (
    <>
      <div className="stripe-confirmation text-center ">
        {props.loading ? (
          <>
            <div className="loader-img">
              <img src={loader} alt="" />
            </div>
            <p>Please wait...</p>
          </>
        ) : (
          <>
            <div className="confirm-icon">
              <img src={info} alt="confirm" />
            </div>
            <h3>Are you sure you?</h3>
            <p>
              You will get {props.values.numCoins} coins for{" "}
              {props.values.paymentValue / 100}$.
            </p>
            <div className="sc-btn">
              <button onClick={() => props.handlePermition()}>Yes</button>
              <button onClick={() => props.handlePermitionFail()}>No</button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const StripeSuccess = (props) => {
  const handleClose = () => {
    console.log("close ->", props.values.newJoinlowBalance);
    socket.emit("checkTable", {
      tableId: props.values.tableId,
      userId: props.values.uid,
      gameType: props.values.gameType,
    });
    props.closePopUp();
  };
  return (
    <>
      <div className="stripe-confirmation text-center">
        <div className="confirm-icon">
          <img src={check} alt="confirm" />
        </div>
        <h3> Payment Successfully </h3>
        <p>Wallet amount will update on next Hand start. </p>
        <div className="sc-btn">
          <button onClick={() => handleClose()}>Ok</button>
        </div>
      </div>
    </>
  );
};

const StripeFailed = (props) => {
  const handleClose = () => {
    if (props.values.newJoinlowBalance) {
      props.closePopUp();
      if (props.values.newJoinlowBalance)
        window.location.href = window.location.origin + "/profile";
    } else {
      props.closePopUp();
    }
  };
  return (
    <>
      <div className="stripe-confirmation text-center">
        <div className="confirm-icon">
          <img src={cancel} alt="confirm" />
        </div>
        <h3> Payment Failed Please Try Again After some time </h3>
        <div className="sc-btn">
          <button onClick={() => handleClose()}>Ok</button>
        </div>
      </div>
    </>
  );
};

const InjectedCheckoutForm = (props) => (
  <ElementsConsumer>
    {({ stripe, elements }) => (
      <CheckoutForm
        stripe={stripe}
        setModalShow={props.setModalShow}
        elements={elements}
        values={props.values}
        onChangeValue={props.onChangeValue}
        setState={props.setState}
      />
    )}
  </ElementsConsumer>
);

const stripePromise = loadStripe(
  "pk_live_51Ixsp4FVoELiMoreDHF3SXZj2LLomeR5kW3Rf5wcnSbQLAdgkjefw4vDeKMhN9R0b9V3uv60kqsIPiS0nEwM4tGD00yrZLdpD0"
);

const StripeApp = ({
  userId,
  tableId,
  setModalShow,
  setNewJoinLowBalance,
  newJoinlowBalance,
  gameType,
  exchangeRate
}) => {
  const [values, setValues] = useState({
    uid: userId,
    paymentValue: 999,
    numCoins: 50000,
    SuccessShow: false,
    client_secret: "",
    tableId,
    newJoinlowBalance,
    gameType,
    setNewJoinLowBalance,
	exchangeRate: exchangeRate.rate || 1,
	currency: exchangeRate.currency || "USD"
  });

  useEffect(() => {
    return () => {
      if (newJoinlowBalance === "fail") {
        window.location.href = window.location.origin + "/profile";
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newJoinlowBalance]);
  const onChangeValue = async (coin, usd) => {
    let target = usd;
    let coins = coin;

    const res = await axios.post(
      "https://stripe-pay-t3e66zpola-uk.a.run.app/",
      {
        usd: target,
      }
    );
    if (res.data.error === "no error") {
      setValues({
        ...values,
        paymentValue: target,
        numCoins: coins,
        client_secret: res.data.clientSecret,
      });
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <InjectedCheckoutForm
        values={values}
        onChangeValue={onChangeValue}
        setState={setValues}
        setModalShow={setModalShow}
      />
    </Elements>
  );
};

export default StripeApp;
