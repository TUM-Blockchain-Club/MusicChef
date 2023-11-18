import React, { useEffect, useState } from "react";
import { Core } from "@walletconnect/core";
import { Web3Wallet, Web3WalletTypes } from "@walletconnect/web3wallet";
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils";
import Counter from "../Components/Counter";
import mockRating from "../mockData";
import { useWeb3Modal } from "@web3modal/wagmi/react";

export default function HomePage(props) {
  const { open } = useWeb3Modal();

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
      <td class="play-button-cell">
        <span className="playSongIcon" />
      </td>
      <td class="vote-button-cell">
        <span className="voteIcon" />
      </td>
    </tr>
  ));

  return (
    <div>
      <div class="page" id="page-1">
        <div class="header">
          <div className="walletBtnContainer flex justify-end">
            {/* <span className="btn" onClick={handleConnectWallet}>
              Connect Wallet
            </span> */}
            <>
              <span className="btn" onClick={() => open()}>
                Open Connect Modal
              </span>
              <span className="btn" onClick={() => open({ view: "Networks" })}>
                Open Network Modal
              </span>
            </>
          </div>
          <h1>Welcome to MusicChef</h1>
          <div></div>
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
        
      </div>
    </div>
  );
}
