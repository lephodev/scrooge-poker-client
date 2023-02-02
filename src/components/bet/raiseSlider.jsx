import { useState } from "react";
import InputRange from "react-input-range";
import { Form, Button } from "react-bootstrap";
import toast from "react-hot-toast";

const RaiseSlider = ({ currentPlayer, SliderAction, roomData }) => {
  const [rangeBetValue, setRangeBetValue] = useState(0);
  const { wallet } = currentPlayer || {};
  console.log("wallet===", wallet);
  const handleRaiseAmount = (e) => {
    const { value } = e.target;

    if (value > 100) {
      toast.error("You dont have enough balance", { id: "A" });
      return;
    } else {
      setRangeBetValue(value);
    }
  };
  return (
    // Bet slider for custom bets needed

    // Quick Bet options in relation to pot size (33%/50%/75%/all in) as well as the blind multiple bets

    <div className="raise-inputRange">
      <Form className="customBet-amount">
        <div className="raiseSliderCustom">
          {/* maxValue={
             roomData &&
        currentPlayer &&
        currentPlayer.wallet >= roomData.raiseAmount * 2 
            } */}

          <InputRange
            maxValue={currentPlayer?.wallet}
            minValue={roomData?.raiseAmount}
            value={rangeBetValue}
            onChange={(e) => setRangeBetValue(e)}
            onChangeComplete={(betAmt) => {
              console.log(betAmt);
            }}
          />
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Control
              type="number"
              placeholder="ex: 100"
              value={rangeBetValue}
              onChange={(e) => handleRaiseAmount(e)}
            />
          </Form.Group>
        </div>
        {currentPlayer && (
          <Button
            variant="primary"
            onClick={() => SliderAction(parseInt(rangeBetValue))}
          >
            Bet
          </Button>
        )}
      </Form>
    </div>
  );
};

export default RaiseSlider;
