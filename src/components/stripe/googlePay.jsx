import React, { useMemo, useState, useEffect } from "react";
import {
  useStripe,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import { socket } from "../../config/socketConnection";

const useOptions = (paymentRequest) => {
  const options = useMemo(
    () => ({
      paymentRequest,
      style: {
        paymentRequestButton: {
          theme: "dark",
          height: "38px",
          type: "donate",
        },
      },
    }),
    [paymentRequest]
  );

  return options;
};

const usePaymentRequest = ({
  options,
  client_secret,
  handleSuccess,
  handlePermitionFail,
  uid,
  paymentValue,
  idToken,
  tableId,
  numCoins,
}) => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canMakePayment, setCanMakePayment] = useState(false);

  useEffect(() => {
    if (stripe && paymentRequest === null) {
      const pr = stripe.paymentRequest(options);
      setPaymentRequest(pr);
    }
  }, [stripe, options, paymentRequest]);

  useEffect(() => {
    let subscribed = true;
    if (paymentRequest) {
      paymentRequest.canMakePayment().then((res) => {
        if (res && subscribed) {
          setCanMakePayment(true);
        }
      });
    }

    return () => {
      subscribed = false;
    };
  }, [paymentRequest]);

  useEffect(() => {
    if (paymentRequest) {
      paymentRequest.on("paymentmethod", async (ev) => {
        // Confirm the PaymentIntent without handling potential next actions (yet).
        const { paymentIntent, error: confirmError } =
          await stripe.confirmCardPayment(
            client_secret,
            { payment_method: ev.paymentMethod.id },
            { handleActions: false }
          );

        if (confirmError) {
          ev.complete("fail");
          handlePermitionFail();
        } else if (paymentIntent) {
          // Report to the browser that the confirmation was successful, prompting
          // it to close the browser payment method collection interface.
          ev.complete("success");
          socket.emit("addCoins", {
            userId: uid,
            tableId: tableId,
            amt: numCoins,
            usd: paymentValue,
            payMethod: "Google Pay",
            cardNr: "Google Pay",
          });
          handleSuccess();

          // Check if the PaymentIntent requires any actions and if so let Stripe.js
          // handle the flow. If using an API version older than "2019-02-11"
          // instead check for: `paymentIntent.status === "requires_source_action"`.
        }
      });
    }
    return () => {
      if (paymentRequest) {
        paymentRequest.off("paymentmethod");
      }
    };
  }, [
    paymentRequest,
    client_secret,
    handlePermitionFail,
    handleSuccess,
    idToken,
    paymentValue,
    uid,
    stripe,
    tableId,
    numCoins,
  ]);

  return canMakePayment ? paymentRequest : null;
};

const GooglePay = ({
  uid,
  paymentValue,
  numCoins,
  client_secret,
  handleSuccess,
  handlePermitionFail,
  idToken,
  tableId,
}) => {
  const paymentRequest = usePaymentRequest({
    options: {
      country: "US",
      currency: "usd",
      total: {
        label: "Google Pay",
        amount: paymentValue,
      },
    },
    client_secret,
    handleSuccess,
    handlePermitionFail,
    uid,
    paymentValue,
    idToken,
    tableId,
    numCoins,
  });
  const options = useOptions(paymentRequest);

  if (!paymentRequest) {
    return null;
  }

  return (
    <PaymentRequestButtonElement
      className="PaymentRequestButton"
      options={options}
      onReady={() => {}}
      onClick={(event) => {
        alert("Click");
      }}
      onBlur={() => {}}
      onFocus={() => {}}
    />
  );
};

export default GooglePay;
