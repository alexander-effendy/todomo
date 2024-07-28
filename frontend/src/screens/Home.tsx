import MaxWidthWrapper from "@/component/MaxWidthWrapper";
// import useMediaQuery from '@mui/material/useMediaQuery';
import { Button } from '@/components/ui/button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useEffect, useState, useContext } from 'react';

import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { getCategory } from '../api/category';

import AssignmentIcon from '@mui/icons-material/Assignment';
import AddCategoryModal from '@/component/Dialog/AddCategoryDialog';
import { Context } from "@/UseContext";

import { Separator } from "@/components/ui/separator"

const Home = () => {

  const { currentCategory, setCurrentCategory, update, currentCategoryName, setCurrentCategoryName } = useContext(Context);

  const [categoryModalOpen, setCategoryModalOpen] = useState<boolean>(false);

  const openModal = () => setCategoryModalOpen(true);
  const closeModal = () => setCategoryModalOpen(false);

  // const smallScreen = useMediaQuery('(max-width:600px)');
  // const mediumScreen = useMediaQuery('(max-width:1000px)');
  // const bigScreen = useMediaQuery('(max-width:1500px)');
  // const largeScreen = useMediaQuery('(max-width:2000px)');

  const { getToken, isAuthenticated, user } = useKindeAuth();
  const [categories, setCategories] = useState<any>([]);

  // const [update, setUpdate] = useState<boolean>(true);
  useEffect(() => {
    const fetchCategories = async () => {
      if (isAuthenticated) {
        const token = await getToken();
        if (user) {
          const data = await getCategory(token, user.email);
          // console.log(data);
          setCategories(data);
        }
      }
    };
    fetchCategories();
  }, [isAuthenticated, getToken, update]);

  useEffect(() => {
    // void
  }, [])

  // const handleAddCategory = async () => {
  //   if (categoryInput.length < 3) {
  //     alert('Category name length cannot be short than 3 letters');
  //     return;
  //   }
  //   if (!user) return;
  //   const token = await getToken();
  //   const newCategory = await postCategory(token, categoryInput, user.email);
  //   setCategories([...categories, newCategory]);
  //   setCategoryInput('');
  // }

  return (
    <MaxWidthWrapper>
      <section className="w-full h-full">
        <AddCategoryModal isOpen={categoryModalOpen} openModal={openModal} closeModal={closeModal} />
        {isAuthenticated && user ? (
          <section className="flex h-full w-full">
            {/* sidebar */}
            <section className="border-r-[1px] border-gray-300 w-[300px] pr-[15px]">
              <Button 
                className="mt-[10px] flex justify-start items-center w-full hover:bg-[#eff1f4]"
                onClick={() => setCategoryModalOpen(true)}
              >
                <AddCircleIcon className="mr-[5px] text-[#4ca065]"/>
                Add Category
              </Button>
              <div className="w-full h-[20px]"></div>
              <div className="flex flex-col">
                {categories.map((category: any) => (
                  <Button 
                    onClick={() => {
                      setCurrentCategory(category.id);
                      setCurrentCategoryName(category.category_name)
                      console.log(currentCategory);
                    }}
                    className={`rounded-[5px] flex justify-start items-center hover:bg-[#eff1f4] ${category.id === currentCategory && 'bg-[#e0e2e6] hover:bg-[#e0e2e6]'}`}
                    key={category.id}><AssignmentIcon className="text-[#b1b4b7] mr-[5px]"/> {category.category_name}
                  </Button>
                ))}
              </div>
            </section>

            {/* category content */}
            <div className="mt-[50px] flex-grow mx-auto max-w-[900px] bg-blue-20s0">
              <section className="flex flex-col items-start">
                <span className="text-3xl font-bold">{currentCategoryName}</span>
                {/* map existing tasks, empty if none */}
                <div>
                  <Button className="text-gray-400 items-start pl-0 hover:text-black">       
                    <AddCircleIcon className="mr-[5px]"/>
                    <div className="my-auto">Add task</div>
                  </Button>
                </div>

                {/* map existing sections, empty if none */}
                <Button className="w-full flex bg-none text-white hover:text-black">
                  <Separator asChild className="my-3 bg-background">
                    <div className="opacity-0 hover:opacity-100 visible py-3 flex items-center text-xs text-black uppercase before:flex-[1_1_0%] before:border-t before:border-gray-600 before:me-6 after:flex-[1_1_0%] after:border-t after:border-gray-600 after:ms-6 dark:before:border-gray-700 dark:after:border-gray-700 transition-opacity duration-300">
                      Add section
                    </div>
                  </Separator>
                </Button>
              </section>
              
            </div>

            
          </section>
        ) : (
          <section className="w-full h-full grid place-items-center text-2xl font-bold">
            <div>
              Hello there!
            </div>
          </section>
        )}
      </section>
    </MaxWidthWrapper>
  )
};

export default Home;