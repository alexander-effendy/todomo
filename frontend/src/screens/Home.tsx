import MaxWidthWrapper from "@/component/MaxWidthWrapper";
// import useMediaQuery from '@mui/material/useMediaQuery';
import { Button } from '@/components/ui/button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useEffect, useState, useContext } from 'react';

import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { getCategory } from '../api/category';


import AddCategoryModal from '@/component/Dialog/AddCategoryDialog';
import { Context } from "@/UseContext";
const Home = () => {

  const { currentCategory, setCurrentCategory, update, setUpdate } = useContext(Context);

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
            <section className="border-r-[1px] border-gray-300 w-[200px] pr-[10px]">
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
                      console.log(currentCategory);
                    }} 
                    className={`rounded-[5px] flex justify-start items-center hover:bg-[#eff1f4] ${category.id === currentCategory && 'bg-[#e0e2e6] hover:bg-[#e0e2e6]'}`}
                    key={category.id}>{category.category_name}
                  </Button>
                ))}
              </div>
            </section>
            
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