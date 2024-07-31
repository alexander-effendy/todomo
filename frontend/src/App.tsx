import { BrowserRouter } from 'react-router-dom';
import Pages from './Pages';
import './index.css';
import Navbar from '@/component/Navbar';
import { ContextProvider } from '@/UseContext';

import { KindeProvider } from "@kinde-oss/kinde-auth-react";

const onRedirectCallback = (user: any, app_state: any) => {
  console.log('redirect callback function called' + { user, app_state });
};

function App() {
  return (
    <KindeProvider
		clientId={import.meta.env.VITE_KINDE_CLIENT_ID}
		domain={import.meta.env.VITE_KINDE_DOMAIN}
		redirectUri={import.meta.env.VITE_REDIRECT_URI}
		logoutUri={import.meta.env.VITE_LOGOUT_URI}
    // redirectUri='localhost:5173'
    // logoutUri='localhost:5173'
    onRedirectCallback={onRedirectCallback}
	>
    <ContextProvider>
      <BrowserRouter>
        <div className="flex flex-col h-screen">
        <Navbar />
        <div className="h-full flex-grow">
          <Pages />
        </div>
        </div>
      </BrowserRouter>
    </ContextProvider>
    
  </KindeProvider>
  )
}

export default App
