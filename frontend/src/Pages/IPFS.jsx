import React, { useEffect, useState } from "react";
import { NFTStorage, File } from "nft.storage";
import { ethers } from "ethers";
import ABI from "../DAO_metadata.json";
import { useAccount, useWalletClient, useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import { useWeb3Modal } from "../Components/Web3ModalProvider";
import ensRegistryABI from "../DAO_metadata.json";
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
  const { web3Modal } = useWeb3Modal();
  const { walletClient: walletClient } = useWalletClient()

  // const contract = useContract({
  //   address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
  //   abi: ensRegistryABI,
  //   walletClient,
  // })
  // const { data } = useContractRead({
  //   address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
  //   abi: ensRegistryABI,
  //   functionName: 'getHunger',
  // })
  // const calldatas = ['hello', 'world'].map(data => ethers.utils.formatBytes32String(data));

  const { config } = usePrepareContractWrite({
    address: '0xc9b712f32a2b079edf75ead858ef04af7e7f9d38',
    abi: ensRegistryABI,
    functionName: 'propose',
    from: "0x890bb55136B71898357716b2Eb13c6eCFeda04E5",
    args: [["0x890bb55136B71898357716b2Eb13c6eCFeda04E5"],0,,"This is a test proposal"],
  })

// const {config} = usePrepareContractWrite({
//     address: '0x2f195b81b588f0274e3b67b5ba86fee240b3b3b1',
//     abi: ensRegistryABI.output.abi,
//     functionName: 'updateMessage',
//     from: "0x890bb55136B71898357716b2Eb13c6eCFeda04E5",
//     args: ["T"],
//   })

  const { write } = useContractWrite(config)

  useEffect(() => {
    // const asyncFunction = async () => {
    //   if (uploadResult) {
    //     await sendToContract(uploadResult.ipnft);
    //   }
    // };

    // asyncFunction();
  });

  // , () => {
  // sendToContract(storedNFT.ipnft);
  // }

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
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload NFT.");
    } finally {
      setLoading(false);
    }
  };

  const sendToContract = async (cid) => {
    const web3Provider = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(web3Provider);
    console.log("provider: ", provider);
    console.log("web3Provider: ", web3Provider);

    const signer = provider.getSigner();

    // CONTRACT ADDRESS
    const contractAddress = "0x69de373d17189b1ccfce499488422a5095ae0f0d";
    const contractABI = ABI.output.abi;
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const to = address;
    const uri = "https://ipfs.io/ipfs/" + cid;

    try {
      const transferCalldata = contract.interface.encodeFunctionData(
        "safeMint",
        [to, uri]
      );
      const tx = await contract.propose(
        // TOKEN ADDRESS
        ["0x8a96d0c8576a2b8f0855f1a8b3c3063ca0830889"],
        [0],
        [],
        ""
      );
      await tx.wait();
      console.log(`Transaction successful with hash: ${tx.hash}`);
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
    <button onClick={() => write()}>Feed</button>
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
