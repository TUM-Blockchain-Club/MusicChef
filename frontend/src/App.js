import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import UploadMusicPage from "./Pages/UploadMusicPage";
import NavBar from "./Components/NavBar";

import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import { WagmiConfig } from "wagmi";
import { useEffect, useState } from "react";
import {
  arbitrum,
  avalanche,
  bsc,
  fantom,
  gnosis,
  mainnet,
  optimism,
  polygon,
} from "wagmi/chains";
import Counter from "./Components/Counter";

const chains = [
  mainnet,
  polygon,
  avalanche,
  arbitrum,
  bsc,
  optimism,
  gnosis,
  fantom,
];

// 1. Get projectID at https://cloud.walletconnect.com

const projectId =
  process.env.NEXT_PUBLIC_PROJECT_ID || "bee1b7797f9217deebc8f9024dfda9ec";

const metadata = {
  name: "Next Starter Template",
  description: "A Next.js starter template with Web3Modal v3 + Wagmi",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({ wagmiConfig, projectId, chains });

function App() {
  return (
    <div className="App">
      {/* <header className="App-header"></header> */}
      <div className="mainContainer">
        <Router>
          <NavBar />
          <Counter />
          <WagmiConfig config={wagmiConfig}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/upload" element={<UploadMusicPage />} />
            </Routes>
          </WagmiConfig>
        </Router>
      </div>
      <div class="footer">
        <p>created by </p>
        <img
          className="clubFooterLogo"
          src={`${process.env.PUBLIC_URL}/TBC logo white full.png`}
          alt=""
        />
      </div>
    </div>
  );
}

export default App;
