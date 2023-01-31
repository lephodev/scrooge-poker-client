import { useState } from "react";
import InputRange from "react-input-range";
import { Form, Button } from "react-bootstrap";

const RaiseSlider = () => {
  const [rangeBetValue, setRangeBetValue] = useState(0);
  return (
    // Bet slider for custom bets needed

    // Quick Bet options in relation to pot size (33%/50%/75%/all in) as well as the blind multiple bets

    <div className="raise-inputRange">
      <Form className="customBet-amount">
        <div className="raiseSliderCustom">
          <InputRange
            maxValue={10000}
            minValue={0}
            value={rangeBetValue}
            onChange={(e) => setRangeBetValue(e)}
            onChangeComplete={(betAmt) => {
              console.log(betAmt);
            }}
          />
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Control type="number" placeholder="ex: 100" />
          </Form.Group>
        </div>
        <Button variant="primary" type="button">
          Bet
        </Button>
      </Form>
    </div>
  );
};

export default RaiseSlider;
