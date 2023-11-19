import React, { useEffect, useState } from "react";

export default function Counter(props) {
  const [timeLeft, setTimeLeft] = useState("");
  const dateString = props.endDate;
  const parts = dateString.split(".");
  const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  const targetDate = new Date(formattedDate);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // setTimeLeft(
        //   `${days} days and ${hours} hours ${minutes} minutes ${seconds} seconds left for voting`
        // );
        setTimeLeft({
          days: days,
          hours: hours,
          minutes: minutes,
          seconds: seconds,
        });
      } else {
        clearInterval(interval);
        setTimeLeft("Voting has ended.");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);
  return (
    <div class="countdown-container">
      {/* <div >Time for voting left:</div> */}
      <div class="countdown-timer">
        <div>{timeLeft.days}</div>
        <div>{timeLeft.hours}</div>
        <div>{timeLeft.minutes}</div>
        <div>{timeLeft.seconds}</div>
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
