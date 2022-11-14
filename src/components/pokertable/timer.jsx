import React, { useEffect } from "react";

// export const timerStart = (value) => {
//   var time = value;
//   var initialOffset = '500';
//   var i = 1;
//   let ele = document.getElementById('circle');
//   console.log(ele, 'ele');
//   if (ele)
//     ele.style.strokeDashoffset = initialOffset - 1 * (initialOffset / time);

//   var interval = setInterval(function () {
//     if (i === time) {
//       clearInterval(interval);
//       return;
//     }
//     console.log('hjvhvh');
//     let ele = document.getElementById('circle');
//     if (ele)
//       ele.style.strokeDashoffset =
//         initialOffset - (i + 1) * (initialOffset / time);
//     i++;
//   }, 1000);
// };

export const Timer = ({ children, timer, leftTime, me }) => {
  useEffect(() => {
    if (timer && leftTime) {
      var initialOffset = me ? 450 : 420;
      var i = timer - leftTime;
      let ele = document.getElementById("circle");
      if (ele && i === 1) {
        ele.style.strokeDashoffset =
          initialOffset - 1 * (initialOffset / timer);
      }
      if (ele)
        ele.style.strokeDashoffset =
          initialOffset - (i + 1) * (initialOffset / timer);
    }
  }, [timer, leftTime, me]);

  return (
    <div className="timer-circle">
      <svg xmlns="http://www.w3.org/2000/svg">
        <circle
          id="circle"
          className="circle_animation"
          r="72.85699"
          cy="100"
          cx="100"
          strokeWidth="5"
          stroke="#6fdb6f"
          fill="none"
        ></circle>
      </svg>
      {children}
    </div>
  );
};
