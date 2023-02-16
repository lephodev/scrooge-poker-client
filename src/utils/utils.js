const numFormatter = (num) => {
    if (num > 1 && num < 999) {
      return (num / 1)?.toFixed(0); // convert to K for number from > 1000 < 1 million
    } else if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed(2) + "K"; // convert to K for number from > 1000 < 1 million
    } else if (num >= 1000000 && num < 1000000000) {
      return (num / 1000000).toFixed(2) + "M"; // convert to M for number from > 1 million
    } else if (num >= 100000000 && num < 1000000000000) {
      return (num / 100000000).toFixed(2) + "B";
    } else if (num >= 1000000000000)
      return (num / 1000000000000).toFixed(2) + "T";
    else return num; // if value < 1000, nothing to do
  };
  
  export default numFormatter;
  