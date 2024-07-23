import MaxWidthWrapper from './MaxWidthWrapper';
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useEffect } from 'react';

const handleSignUp = async (getToken: any, user:any) => {
  const userInfo = {
    id: user.id,
    email: user.email,
    given_name: user.given_name,
    family_name: user.family_name
  };
  try {
    const token = await getToken();
    const response = await axios.post('http://localhost:3000/api/auth', userInfo, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('User authenticated and added to the database:', response.data);
  } catch (error) {
    console.error('Error during signing up:', error);
  }
}

const Navbar = () => {
  const { login, register, logout, isAuthenticated, user, getToken } = useKindeAuth();

  const handleRegister = async () => {
    register(); // kinde register
    await handleSignUp(getToken, user); // local db register
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
  }, [isAuthenticated, user, getToken])

  return (
    <nav className="grid place-items-center sticky z-[100] h-screen w-screen border-b border-gray-200 bg-white opacity-95 backdrop-filter backdrop-blur-md">
      <MaxWidthWrapper>
        <div className="grid place-items-center">
            <p>Hi {user?.given_name}!</p>
          
            {isAuthenticated ? (
              <Button onClick={handleLogout}>Sign Out</Button>
            ) : (
              <>
                <Button onClick={handleRegister}>Sign Up</Button>
                <Button onClick={handleLogin}>Login</Button>
              </>
          )}
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar;