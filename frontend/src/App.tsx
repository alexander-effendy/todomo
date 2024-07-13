import { BrowserRouter } from 'react-router-dom';
import Pages from './Pages';
import './index.css';
import Navbar from '@/component/Navbar';

import {KindeProvider} from "@kinde-oss/kinde-auth-react";

function App() {
  return (
    <KindeProvider
		clientId={import.meta.env.VITE_KINDE_CLIENT_ID}
		domain={import.meta.env.VITE_KINDE_DOMAIN}
		redirectUri="http://localhost:5173"
		logoutUri="http://localhost:5173"
	>
      <BrowserRouter>
        <Navbar />
        <Pages />
      </BrowserRouter>
    </KindeProvider>
  )
}

export default App
