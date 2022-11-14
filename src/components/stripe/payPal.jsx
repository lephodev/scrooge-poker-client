import { PayPalButton } from "react-paypal-button-v2";
import React, {Component} from "react";
import axios from "axios";


class PayPal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: this.props.uid,
            paymentValue: this.props.paymentValue / 100,
            numCoins: this.props.numCoins,
            client_secret: this.props.client_secret,
            idToken: this.props.idToken,
        };
      }

      render() {        
          
        return (
            <div className="paypal-btn">
            <PayPalButton
            amount={this.state.paymentValue}
            shippingPreference="NO_SHIPPING"
            style={{"layout":"vertical","color":"blue"}}
            onSuccess={(details, data) => {
              console.log("Transaction completed by " + details.payer.name.given_name);
              alert("Transaction completed by " + details.payer.name.given_name);
              console.log("Transaction completed details " + details);
              alert("Transaction completed details " + details);
                 axios
                  .get("https://auth-api-t3e66zpola-ue.a.run.app", {
                    params: {
                      service: "buyCoins",
                      params: `usid=${this.state.uid},action=buy-coins,id=${details.payer.name.given_name},from=social_media,usd=${this.paymentValue / 100},payMethod=Paypal,cardNr=Paypal`,},
                    headers: { idtoken: this.state.idToken },
                  })
                  .then((response) => {
                    console.log("Executing transactionLog request:");
                    if (
                      response.data.error === "no error" &&
                      response.data.success === true
                    ) {
                      console.log(
                        "Complete response.data transactionLog: ",
                        response.data
                      );
                      this.props.handleSuccess();
                    } else {
                      console.log("backend response failed: ", response.statusText);
                      this.props.handlePermitionFail();
                    }
                  })
                  .catch((error) => {
                    this.props.handlePermitionFail();
                    console.log("Error req", error);
                  });
    
              // OPTIONAL: Call your server to save the transaction
              return fetch("/paypal-transaction-complete", {
                method: "post",
                body: JSON.stringify({
                  orderId: data.orderID
                })
              });
            }}
            options={{
              clientId: "AQkFl5zabASw8uupNCumRon-yuoDg10u8A92mhtMDNNSpkteln1ceS0F8bNFdvFVzJv3PgSd5GEApbXr&disable-funding=credit,card"
            }}
          />
            </div>
        );
      }
    }
    

export default PayPal;
