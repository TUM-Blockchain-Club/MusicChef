import React, { createContext, useContext, useState } from "react";

const Web3ModalContext = createContext(null);

export const Web3ModalProvider = ({ children }) => {
  const [web3Modal, setWeb3Modal] = useState(null);

  return (
    <Web3ModalContext.Provider value={{ web3Modal, setWeb3Modal }}>
      {children}
    </Web3ModalContext.Provider>
  );
};

export const useWeb3Modal = () => useContext(Web3ModalContext);
