// import React, { useEffect, useState } from 'react'
// import { KeyringProvider, useKeyring } from '@w3ui/react-keyring'
// import { UploadsListProvider } from '@w3ui/react-uploads-list'
// import ContentPage from './ContentPage'
// import logo from '../logo.png'

// function IPFS () {
//     const [resetState, setResetState] = useState({ /* initial state */ });

//     useEffect(() => {
//         // Clear local storage (example)
//         localStorage.clear();

//         // Reset any application state (example)
//         setResetState({ /* new initial state */ });

//         // Any other reset or clearing actions go here
//       }, []);
//   return (
//     <KeyringProvider>
//       <IdentityLoader>
//         <UploadsListProvider>
//           <div className='vh-100 flex flex-column justify-center items-center sans-serif light-silver'>
//             <header>
//               <img src={logo} width='250' alt='logo' />
//             </header>
//             <ContentPage />
//           </div>
//         </UploadsListProvider>
//       </IdentityLoader>
//     </KeyringProvider>
//   )
// }

// function IdentityLoader ({ children }) {
//   const [, { loadAgent }] = useKeyring()
//   // eslint-disable-next-line
//   useEffect(() => { loadAgent() }, []) // try load default identity - once.
//   return children
// }

// export default IPFS;

import React, { useState } from 'react';
import { NFTStorage, File } from 'nft.storage';

// Paste your NFT.Storage API key into the quotes:
const NFT_STORAGE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGQyMzdlYTc3NzQ1MEM2NGFGMDdEZDQwODI4QTY0ZTgwN2FCODU2NmIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwMDMyMTg3ODA2NywibmFtZSI6Ik11c2ljQ2hlZiJ9.VhYCpMv_sg_J24YfaI7JoHoZpvpLx24tsKaFH6FN_Zo';

const IPFS = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [uploadResult, setUploadResult] = useState(null);
  const [loading, setLoading] = useState(false);

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
      alert('Please provide a file, name, and description.');
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
      console.error('Error uploading file:', error);
      alert('Failed to upload NFT.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
      <input
        type="file"
        onChange={handleFileChange}
        style={{ margin: '10px', width: '20%', padding: '8px' }}
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={handleNameChange}
        style={{ margin: '10px', width: '20%', padding: '8px' }}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={handleDescriptionChange}
        style={{ margin: '10px', width: '20%', padding: '8px', height: '100px' }}
      />
      <button
        onClick={uploadNFT}
        disabled={loading}
        style={{
          width: '10%',
          padding: '10px',
          margin: '10px',
          backgroundColor: 'blue',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'default' : 'pointer',
        }}
      >
        {loading ? 'Uploading...' : 'Upload Music'}
      </button>
      {uploadResult && (
        <div style={{ marginTop: '10px', color: 'green' }}>
          NFT Uploaded! CID: {uploadResult.ipnft}
        </div>
      )}
    </div>
  );

};

export default IPFS;
