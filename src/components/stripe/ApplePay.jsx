import React, { useEffect, useState, useMemo } from 'react';
import {
  PaymentRequestButtonElement,
  useStripe,
} from '@stripe/react-stripe-js';
import StatusMessages, { useMessages } from './StatusMessages';
import axios from 'axios';

const useOptions = (paymentRequest) => {
  const options = useMemo(
    () => ({
      paymentRequest,
      style: {
        paymentRequestButton: {
          theme: 'dark',
          height: '38px',
          type: 'buy',
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
  numCoins,
  handleLoading,
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
      paymentRequest.on('paymentmethod', async (ev) => {
        handleLoading();
        // Confirm the PaymentIntent without handling potential next actions (yet).
        const { paymentIntent, error: confirmError } =
          await stripe.confirmCardPayment(
            client_secret,
            { payment_method: ev.paymentMethod.id },
            { handleActions: false }
          );

        if (confirmError) {
          ev.complete('fail');
          handlePermitionFail();
        } else if (paymentIntent) {
          // Report to the browser that the confirmation was successful, prompting
          // it to close the browser payment method collection interface.
          ev.complete('success');
          const { id } = paymentIntent;

          if (paymentIntent.status === 'succeeded') {
            await axios
              .get('https://auth-api-t3e66zpola-ue.a.run.app', {
                params: {
                  service: 'buyCoins',
                  params: `usid=${uid},action=buy-coins,id=${id},from=social_media,usd=${
                    paymentValue / 100
                  },payMethod=Google Pay,cardNr=visa`,
                },
                headers: { idtoken: idToken },
              })
              .then((response) => {
                console.log('Executing transactionLog request:');
                if (
                  response.data.error === 'no error' &&
                  response.data.success === true
                ) {
                  handleSuccess();
                } else {
                  console.log('backend response failed: ', response.statusText);
                  handlePermitionFail();
                }
              })
              .catch((error) => {
                handlePermitionFail();
                console.log('Error req', error);
              });
          }
          if (paymentIntent.code === 'card_declined') {
            handlePermitionFail('Card Declined');
          }
          // Check if the PaymentIntent requires any actions and if so let Stripe.js
          // handle the flow. If using an API version older than "2019-02-11"
          // instead check for: `paymentIntent.status === "requires_source_action"`.
        }
      });
    }
    return () => {
      if (paymentRequest) {
        paymentRequest.off('paymentmethod');
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
    numCoins,
    handleLoading,
  ]);

  return canMakePayment ? paymentRequest : null;
};

const ApplePay = ({
  uid,
  paymentValue,
  numCoins,
  client_secret,
  handleSuccess,
  handlePermitionFail,
  idToken,
  handleLoading,
}) => {
  const [messages /* addMessage */] = useMessages();

  const paymentRequest = usePaymentRequest({
    options: {
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Google Pay',
        amount: paymentValue,
      },
    },
    client_secret,
    handleSuccess,
    handlePermitionFail,
    uid,
    paymentValue,
    idToken,
    numCoins,
    handleLoading,
  });
  const options = useOptions(paymentRequest);
  if (!paymentRequest) {
    return null;
  }

  return (
    <>
      <h1>Apple Pay</h1>
      <PaymentRequestButtonElement
        className='PaymentRequestButton'
        options={options}
        onReady={() => {
        }}
        onClick={(event) => {
          console.log('PaymentRequestButton [click]', event);
        }}
        onBlur={() => {
          console.log('PaymentRequestButton [blur]');
        }}
        onFocus={() => {
          console.log('PaymentRequestButton [focus]');
        }}
      />
      <StatusMessages messages={messages} />
    </>
  );
};

export default ApplePay;
