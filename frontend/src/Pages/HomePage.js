import React, { useEffect, useState } from "react";
import { Core } from "@walletconnect/core";
import { Web3Wallet, Web3WalletTypes } from "@walletconnect/web3wallet";
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils";
import Counter from "../Components/Counter";
import mockRating from "../mockData";

export default function HomePage(props) {
  const [timeLeft, setTimeLeft] = useState("");
  const dateString = "01.12.2023";
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

  const core = new Core({
    // projectId: process.env.PROJECT_ID,
    projectId: "bee1b7797f9217deebc8f9024dfda9ec",
  });

  const handleConnectWallet = async () => {
    const web3wallet = await Web3Wallet.init({
      core, // <- pass the shared `core` instance
      metadata: {
        name: "Demo app",
        description: "Demo Client as Wallet/Peer",
        url: "www.walletconnect.com",
        icons: [],
      },
    });
  };

  const topRating = mockRating.map((el, index) => (
    <tr class="entry" key={index}>
      <td class="rank">{index + 1}</td>
      <td class="title">{el.title}</td>
      <td class="artist">{el.artist}</td>
      <td class="duration">{el.duration} min</td>
      <td class="votes">{el.votes} votes</td>
      <td class="votes">{el.votes} play</td>
      <td class="votes">{el.votes} vote</td>
    </tr>
  ));



  return (
    <div>
      <div class="page" id="page-1">
        <div class="header">
          <div className="walletBtnContainer flex justify-end">
            <span className="btn" onClick={handleConnectWallet}>
              Connect Wallet
            </span>
          </div>
          {/* <p>4 days and 13 hours left for voting</p> */}
          {/* <p>{timeLeft}</p> */}
          <h1>Welcome to MusicChef</h1>
          <div>
            <Counter timeLeft={timeLeft} />
          </div>
        </div>
        <div class="section">
          <h2>Music Leaderboard</h2>
          <div class="leaderboard">
            <table class="songsTable">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Title</th>
                  <th>Artist</th>
                  <th>Duration</th>
                  <th>Votes</th>
                  
                </tr>
              </thead>
            {topRating}
            </table>
          </div>
        </div>
        <div class="footer">
          <p>created by </p>
          <img
            className="clubFooterLogo"
            src={`${process.env.PUBLIC_URL}/TBC logo white full.png`}
            alt="My Image"
          />
        </div>
      </div>
    </div>
  );
}
