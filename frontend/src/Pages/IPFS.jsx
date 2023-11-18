import React, { useEffect, useState } from 'react'
import { KeyringProvider, useKeyring } from '@w3ui/react-keyring'
import { UploadsListProvider } from '@w3ui/react-uploads-list'
import ContentPage from './ContentPage'
import logo from '../logo.png'

function IPFS () {
    const [resetState, setResetState] = useState({ /* initial state */ });

    useEffect(() => {
        // Clear local storage (example)
        localStorage.clear();

        // Reset any application state (example)
        setResetState({ /* new initial state */ });

        // Any other reset or clearing actions go here
      }, []);
  return (
    <KeyringProvider>
      <IdentityLoader>
        <UploadsListProvider>
          <div className='vh-100 flex flex-column justify-center items-center sans-serif light-silver'>
            <header>
              <img src={logo} width='250' alt='logo' />
            </header>
            <ContentPage />
          </div>
        </UploadsListProvider>
      </IdentityLoader>
    </KeyringProvider>
  )
}

function IdentityLoader ({ children }) {
  const [, { loadAgent }] = useKeyring()
  // eslint-disable-next-line
  useEffect(() => { loadAgent() }, []) // try load default identity - once.
  return children
}

export default IPFS;
