import { useState } from "react";
import InputRange from "react-input-range";
import { Form, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import numFormatter from "../../utils/utils";

const RaiseSlider = ({ currentPlayer, SliderAction, roomData }) => {
  const [rangeBetValue, setRangeBetValue] = useState(0);
  const { wallet } = currentPlayer || {};

  const handleRaiseAmount = (e) => {
    const { value } = e.target;
    console.log("value", value);

    if (value > wallet) {
      toast.error("You dont have enough balance", { id: "A" });
      return;
    } else {
      setRangeBetValue(value);
    }
  };

  const maxBetValue = numFormatter(currentPlayer?.wallet);
  const minBetValue = numFormatter(roomData?.raiseAmount);

  return (
    
    // Bet slider for custom bets needed

    // Quick Bet options in relation to pot size (33%/50%/75%/all in) as well as the blind multiple bets

    <div className="raise-inputRange">
      <Form className="customBet-amount">
        <div className="raiseSliderCustom">
          <div className="inputRange-Box">
            <InputRange
              maxValue={currentPlayer?.wallet}
              minValue={roomData?.raiseAmount}
              value={rangeBetValue}
              onChange={(e) => setRangeBetValue(e)}
              onChangeComplete={(betAmt) => {
                console.log({ betAmt: betAmt });
              }}
            />
            <div className="inputRangeSlider">
              <span className="minValueSpan">{minBetValue}</span>
              <span className="maxValueSpan">{maxBetValue}</span>
            </div>
          </div>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Control
              type="number"
              placeholder="ex:0"
              value={rangeBetValue>0 && rangeBetValue}
              onChange={(e) => handleRaiseAmount(e)}
            />
          </Form.Group>
        </div>
        {currentPlayer && (
          <Button
            variant="primary"
            onClick={() => SliderAction(parseInt(rangeBetValue))}
            disabled={rangeBetValue <= 0}
          >
            Bet
          </Button>
        )}
      </Form>
    </div>
  );
};

export default RaiseSlider;
