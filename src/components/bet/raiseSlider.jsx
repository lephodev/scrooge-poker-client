import { useState } from "react";
import InputRange from "react-input-range";

const RaiseSlider = () => {
  const [rangeBetValue, setRangeBetValue] = useState(0);
  return (
    // Bet slider for custom bets needed

    // Quick Bet options in relation to pot size (33%/50%/75%/all in) as well as the blind multiple bets

    <div className="raise-inputRange">
      {/* <div className="bet-range-label">
        <span>min-0</span>
        <span>max-10000</span>
      </div> */}
      <InputRange
        maxValue={10000}
        minValue={0}
        value={rangeBetValue}
        onChange={(e) => setRangeBetValue(e)}
        onChangeComplete={(betAmt) => {
          console.log(betAmt);
        }}
      />
    </div>
  );
};

export default RaiseSlider;
