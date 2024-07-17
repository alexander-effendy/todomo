import { Link } from 'react-router-dom';

import { buttonVariants } from "@/components/ui/button";
import MaxWidthWrapper from './MaxWidthWrapper';
import { ArrowRight } from "lucide-react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Button } from '@/components/ui/button';
const Navbar = () => {

  // const { getUser } = getKindeServerSession();
  const isAdmin = false;

  const { login, register, logout, user, isAuthenticated } = useKindeAuth();

  const handleRegister = () => {
    register();
    console.log('registerrrr');
  }
  const handleLogin = () => login();
  const handleLogout = () => logout();

  return (
    <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white opacity-95 backdrop-filter backdrop-blur-md">
      <MaxWidthWrapper>

        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link to="/" className="flex z-40 font-semibold">
            todo<span className="text-green-600">mo</span>
          </Link>

          <div className="h-full flex items-center space-x-4">
            {/* if user logged in, then got logout button */}
            {isAuthenticated ? (
              <>
                <Button onClick={handleLogout} className={buttonVariants({
                  size: 'sm', 
                  variant: 'ghost',
                })}>
                  Sign Out
                </Button>

                {isAdmin ? (
                  <Button onClick={handleLogout} className={buttonVariants({
                    size: 'sm', 
                    variant: 'ghost',
                  })}>
                    Dashboard
                  </Button>
                ) : null}
                <Link to="/configure/upload" className={buttonVariants({
                  size: 'sm', 
                  className: "hidden sm:flex items-center gap-1",
                })}>
                  Add Task
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            ) : (
              <>
                <Button onClick={handleRegister} className={buttonVariants({
                  size: 'sm', 
                  variant: 'ghost',
                })}>
                  Sign Up
                </Button>
                <Button onClick={handleLogin} className={buttonVariants({
                  size: 'sm', 
                  variant: 'ghost',
                })}>
                  Login
                </Button>
                
                <div className="h-8 w-px bg-zinc-200 hidden sm:block" />

                <Link to="/configure/upload" className={buttonVariants({
                  size: 'sm', 
                  className: "hidden sm:flex items-center gap-1",
                })}>
                  Add Task
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar;