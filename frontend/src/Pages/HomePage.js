import React, { useEffect, useState } from "react";
import { Core } from "@walletconnect/core";
import { Web3Wallet, Web3WalletTypes } from "@walletconnect/web3wallet";
import mockRating from "../mockData";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import myTokenAbi from "../MyToken_metadata.json";
import Counter from "../Components/Counter";

// const { address } = useAccount();

export default function HomePage(props) {
  const [airdropMinted, setAirdropMinted] = useState();
  const { address } = useAccount();
  const { open } = useWeb3Modal();

  const { config: mintAirdropConfig } = usePrepareContractWrite({
    address: "0x3bcab43f601f120c3fba8ac369084247418fa0d1",
    abi: myTokenAbi.output.abi,
    functionName: "mintAirdrop",
    from: address,
    args: [],
  });

  // const { write: mintAirdropWrite } = useContractWrite(mintAirdropConfig);

  const {
    write: mintAirdropWrite,
    isLoading,
    isError,
    // error,
  } = useContractWrite({
    ...mintAirdropConfig,
    onSuccess(data) {
      console.log("Transaction successful:", data);
      setAirdropMinted(true);
    },
    onError(error) {
      console.error("Transaction failed:", error);
    },
    onSettled(data, error) {
      if (error) {
        console.log("Transaction settled with error:", error);
      } else {
        console.log("Transaction settled:", data);
      }
    },
  });

  const handleMintAirdrop = () => {
    if (mintAirdropWrite) {
      mintAirdropWrite();
    }
  };

  // const { config: hasParticipatedConfig } = usePrepareContractWrite({
  //   address: "0xc9b712f32a2b079edf75ead858ef04af7e7f9d38",
  //   abi: ensRegistryABI,
  //   functionName: "hasParticipated",
  //   from: address,
  //   args: [],
  // });
  // const { write: hasParticipatedWrite } = useContractWrite(
  //   hasParticipatedConfig
  // );

  const { data, error } = useContractRead({
    address: "0xc9b712f32a2b079edf75ead858ef04af7e7f9d38",
    abi: myTokenAbi.output.abi,
    functionName: "hasMintedAirdrop",
    args: [address], // the address you want to check
  });

  useEffect(() => {
    console.log("data: ", data);
  });
  // useEffect(() => {
  //   const airdropped = async () => {
  //     if (typeof hasParticipatedWrite === "function") {
  //       try {
  //         const res = await hasParticipatedWrite();
  //         if (res) {
  //           setAirdropMinted(res);
  //         }
  //       } catch (error) {
  //         console.error("Error when executing hasParticipatedWrite:", error);
  //       }
  //     } else {
  //       console.error("hasParticipatedWrite is not a function");
  //     }
  //   };
  //   airdropped();
  // }, [hasParticipatedWrite]);

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

  const handleClick = () => {
    console.log("Buton clicked");
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
      <span className="voteIcon" onClick={() => handleClick()}>→</span>

      </td>
      <Counter endDate={el.endDate}/>
    </tr>
  ));

  const handleConnect = () => {
    // const airdropped = hasParticipatedWrite();
    // setAirdropMinted(airdropped);
    // console.log("airdropped ", airdropped);
    open();
  };


  const addMEVButton = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x1", // Chain ID must be in hexadecimal numbers
                chainName: "MEV Blocker (Ethereum Mainnet)",
                nativeCurrency: {
                  name: "Ether",
                  symbol: "ETH", // 2-6 characters long
                  decimals: 18,
                },
                rpcUrls: ["https://rpc.mevblocker.io"],
                blockExplorerUrls: ["https://etherscan.io"],
              },
            ],
          });
        } catch (addError) {
          console.error("Error adding MEV Blocker network", addError);
        }
      } else {
        console.log("MetaMask is not installed!");
      }
    };


  return (
    <div>
      <div class="page" id="page-1">
        <div class="header">
          <div className="walletBtnContainer flex justify-end">
            {/* <span className="btn" onClick={handleConnectWallet}>
              Connect Wallet
            </span> */}
            <>
              {!airdropMinted && address && (
                <span className="btn" onClick={handleMintAirdrop}>
                  Claim Airdrop
                </span>
              )}
              <span className="btn" onClick={handleConnect}>
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
                  <th> </th>
                  <th> </th>
                  <th>Time left for voting:</th>
                </tr>
              </thead>
              {topRating}
            </table>
          </div>
          {/* <>------------------------</> */}
          <div className="MevButtonContainer">
            <span
              className="addMevBlockerNetwork hover-target"
              onClick={addMEVButton}
            >
              Add MEV Blocker (Ethereum Mainnet) to MetaMask
            </span>
            <div className="tooltip">
              <p>MEV Blocker is your personal protection </p>
              <p>from front running and sandwich attacks</p>

              <p>for a broad spectrum of Ethereum transactions </p>
              <p>Add the RPC endpoint directly to your wallet</p>
              <p>Enjoy full, automatic protection from all types</p>

              <p>of MEV Get paid by searchers</p>
              <p>for your transactions</p>
            </div>
          </div>
          {/* <>------------------------</> */}
        </div>
      </div>
    </div>
  );
}
