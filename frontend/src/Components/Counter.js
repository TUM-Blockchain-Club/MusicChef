import React from "react";

export default function Counter(props) {
  return (
    <div class="countdown-container">
      <div class="countdown-timer">
        <div>{props.timeLeft.days}</div>
        <div>{props.timeLeft.hours}</div>
        <div>{props.timeLeft.minutes}</div>
        <div>{props.timeLeft.seconds}</div>
      </div>
      <div class="countdown-labels">
        <div>Days</div>
        <div>Hrs</div>
        <div>Mins</div>
        <div>Secs</div>
      </div>
    </div>
  );
}
