import React, { useEffect, useState } from "react";
import { NFTStorage, File, Token } from "nft.storage";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { useWeb3Modal } from "../Components/Web3ModalProvider";
import DAO from "../DAO_metadata.json";
import MyToken from "../MyToken_metadata.json"

// import Web3 from "web3";

// const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'));

// const number = 100; // Your number here
// const calldatas = [web3.utils.numberToHex(number)];

// Paste your NFT.Storage API key into the quotes:
const NFT_STORAGE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGQyMzdlYTc3NzQ1MEM2NGFGMDdEZDQwODI4QTY0ZTgwN2FCODU2NmIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwMDMyNDAyMDI5MSwibmFtZSI6Ik11c2ljQ2hlZiJ9.2DO7fLSDQLO61Vkd-b8eqqrpnFHz27l16VHe0ssnfmM";

const IPFS = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [uploadResult, setUploadResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { address, isConnecting, isDisconnected } = useAccount();

// DAO address: "0x991b9e8614ce3F0321CECc4B8bBe281922dA1744"
// Token address: "0x991b9e8614ce3F0321CECc4B8bBe281922dA1744"
// MusicNFT: "0x88bFeAF0B4E6CbA01e6C8FCdbB9DeDF973692342"

// Base token: 0x46a9ca28133e93923cbc9efb9846534aaeaf15d0
// Base DAO: 0x69de373d17189b1ccfce499488422a5095ae0f0d

  let args = [
    ["0x890bb55136B71898357716b2Eb13c6eCFeda04E5"], // targets
    [0], // values
    ["0xa9059cbb0000000000000000000000003f5047bdb647dc39c88625e17bdbffee905a9f4400000000000000000000000000000000000000000000011c9a62d04ed0c80000"], // calldatas
    "proposal details" // description
  ];

  const { config: proposeConfig } = usePrepareContractWrite({
    address: '0x69de373d17189b1ccfce499488422a5095ae0f0d',
    abi: DAO.output.abi,
    functionName: 'propose',
    from: address,
    args: args,
  });

  console.log("Address: ", address);
  const { config: approveConfig } = usePrepareContractWrite({
    address: '0x46a9ca28133e93923cbc9efb9846534aaeaf15d0',
    abi: MyToken.output.abi,
    functionName: 'approve',
    from: address,
    args: ["0x69de373d17189b1ccfce499488422a5095ae0f0d", 100000],
  });

  const {write: approveWrite}= useContractWrite(approveConfig)
  const {write: proposeWrite}= useContractWrite(proposeConfig)


  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const uploadNFT = async () => {
    if (!file || !name || !description) {
      alert("Please provide a file, name, and description.");
      return;
    }

    setLoading(true);
    try {
      const nftStorageClient = new NFTStorage({ token: NFT_STORAGE_KEY });
      const storedNFT = await nftStorageClient.store({
        image: new File([file], file.name, { type: file.type }),
        name,
        description,
      });

      setUploadResult(storedNFT);

      // Call sendToContract function with the CID of the uploaded NFT
      if (storedNFT && storedNFT.ipnft) {
        await sendToContract(storedNFT.ipnft);
      }

    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload NFT.");
    } finally {
      setLoading(false);
    }
  };

  const sendToContract = async (cid) => {


    // CONTRACT ADDRESS
    const uri = "https://ipfs.io/ipfs/" + cid;
    args[3] = uri;
    try {
     await proposeWrite();
    } catch (error) {
      console.error("Error making proposal:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      <button onClick={() => approveWrite()}>Approve allowance</button>
      <input
        type="file"
        onChange={handleFileChange}
        style={{ margin: "10px", width: "20%", padding: "8px" }}
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={handleNameChange}
        style={{ margin: "10px", width: "20%", padding: "8px" }}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={handleDescriptionChange}
        style={{
          margin: "10px",
          width: "20%",
          padding: "8px",
          height: "100px",
        }}
      />
      <button
        onClick={uploadNFT}
        disabled={loading}
        style={{
          width: "10%",
          padding: "10px",
          margin: "10px",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "default" : "pointer",
        }}
      >
        {loading ? "Uploading..." : "Upload Music"}
      </button>
      {uploadResult && (
        <div style={{ marginTop: "10px", color: "green" }}>
          NFT Uploaded! CID: {uploadResult.ipnft}
        </div>
      )}
    </div>
  );
};

export default IPFS;
