import MaxWidthWrapper from './MaxWidthWrapper';
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useEffect } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});


const Navbar = () => {

  const smallScreen = useMediaQuery('(max-width:820px)');
  const mobileScreen = useMediaQuery('(max-width:530px)');

  const { login, register, logout, isAuthenticated, user, getToken } = useKindeAuth();

  const handleRegister = async () => {
    register();
    await handleSignUp(getToken, user);
  }

  const handleLogin = () => login();
  const handleLogout = () => logout();

  useEffect(() => {
    const registerAndSignUp = async () => {
      if (isAuthenticated && user && getToken) {
        await handleSignUp(getToken, user);
      }
    };
    registerAndSignUp();
  }, [isAuthenticated, user, getToken]);

  return (
    <nav className="grid place-items-center sticky z-[100] border-b border-gray-200 bg-white opacity-95 backdrop-filter backdrop-blur-md">
      <MaxWidthWrapper>
        <div className="select-none flex h-14 items-center justify-between border-b border-zinc-200">
          <div className="flex z-40 font-semibold text-[18px]">
          todo<span className="text-green-600">mo</span>
          </div>        
          {isAuthenticated ? (
            <div className="flex items-center">
              <div>Welcome <span className="font-bold">{user?.given_name}</span>!</div>
              <div className="h-8 w-px bg-zinc-200 hidden sm:block ml-4" />
              <Button className="hover:underline" onClick={handleLogout}>Sign Out</Button>
            </div>
          ) : (
            <div>
              {smallScreen ?
                <div className="flex">
                  <Select>
                    <SelectTrigger className="w-[170px]">
                      <SelectValue placeholder="Our Services" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="apple">Features</SelectItem>
                        <SelectItem value="banana">For Teams</SelectItem>
                        <SelectItem value="blueberry">Resources</SelectItem>
                        <SelectItem value="grapes" onClick={handleLogin}>Login</SelectItem>
                        <SelectItem value="pineapple" onClick={handleRegister}>Sign Up</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {mobileScreen ||
                  <div className="flex">
                    <Button className="hover:underline" onClick={handleLogin}>Login</Button>
                    <Button className="bg-[#e14438] hover:bg-[#c7362b] rounded-[5px] h-[35px] text-white" onClick={handleRegister}>Start for free</Button>
                  </div>
                  }
                 
                </div> :
                <div>
                  <Button className="hover:underline" onClick={handleRegister}>Features</Button>
                  <Button className="hover:underline" onClick={handleRegister}>For Teams</Button>
                  <Button className="hover:underline" onClick={handleRegister}>Resources</Button>
                  <Button className="hover:underline" onClick={handleRegister}>Pricing</Button>
                  <Button className="hover:underline" onClick={handleLogin}>Login</Button>
                  <Button className="bg-[#e14438] hover:bg-[#c7362b] rounded-[5px] h-[35px] text-white" onClick={handleRegister}>Start for free</Button>
                </div>
              }
            </div>
          )}
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar;

// helpers
const handleSignUp = async (getToken: any, user:any) => {
  const userInfo = {
    id: user.id,
    email: user.email,
    given_name: user.given_name,
    family_name: user.family_name
  };
  try {
    const token = await getToken();
    const response = await api.post('/api/auth', userInfo, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('User authenticated and will be inserted into database if new. Otherwise no.', response.data);
  } catch (error) {
    console.error('Error during signing up:', error);
  }
}