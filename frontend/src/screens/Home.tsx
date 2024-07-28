import MaxWidthWrapper from "@/component/MaxWidthWrapper";
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
  const [addSectionActive, setAddSectionActive] = useState<boolean>(false);
  const [addTaskActive, setAddTaskActive] = useState<boolean>(false);

  const openModal = () => setCategoryModalOpen(true);
  const closeModal = () => setCategoryModalOpen(false);

  const { getToken, isAuthenticated, user } = useKindeAuth();
  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (isAuthenticated) {
        const token = await getToken();
        if (user) {
          const data = await getCategory(token, user.email);
          setCategories(data);
        }
      }
    };
    fetchCategories();
  }, [isAuthenticated, getToken, update]);

  useEffect(() => {
    // void
  }, [])

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
                  <Button className="mt-5 text-gray-400 items-start pl-0 hover:text-black"
                    onClick={() => {setAddTaskActive(true); setAddSectionActive(false)}}
                  >       
                    <AddCircleIcon className="mr-[5px]"/>
                    <div className="my-auto">Add task</div>
                  </Button>
                </div>

                {addTaskActive &&
                  <div className="p-[10px] mt-[10px] w-full border-[2px] border-gray-400 rounded-[10px]">
                    <input className="mb-[10px] focus:outline-none px-[15px] w-full mt-[10px]" placeholder="Task name"></input>
                    <section className="flex justify-end gap-2 border-t-[1px] border-gray-400 pt-3">
                      <Button className="bg-gray-100 rounded-[5px] hover:bg-gray-300" onClick={() => setAddTaskActive(false)}>Cancel</Button>
                      <Button className="bg-green-200 rounded-[5px] hover:bg-green-300">Add section</Button>
                    </section>
                  </div>
                }

                {/* map existing sections, empty if none */}

                {addSectionActive &&
                  <div className="p-[10px] mt-[10px] w-full border-[2px] border-gray-400 rounded-[10px]">
                    <input className="mb-[10px] focus:outline-none px-[15px] w-full mt-[10px]" placeholder="Section name"></input>
                    <section className="flex justify-end gap-2 border-t-[1px] border-gray-400 pt-3">
                      <Button className="bg-gray-100 rounded-[5px] hover:bg-gray-300" onClick={() => setAddSectionActive(false)}>Cancel</Button>
                      <Button className="bg-green-200 rounded-[5px] hover:bg-green-300">Add section</Button>
                    </section>
                  </div>
                }
                {!addSectionActive &&
                <Button className={`w-full flex bg-none text-white hover:text-black ${addSectionActive && 'text-black'}`}
                  onClick={() => { setAddSectionActive(true); setAddTaskActive(false)}}
                >
                  <Separator asChild className="my-3 bg-background">
                    <div className="opacity-0 hover:opacity-100 visible py-3 flex items-center text-xs text-black uppercase before:flex-[1_1_0%] before:border-t before:border-gray-600 before:me-6 after:flex-[1_1_0%] after:border-t after:border-gray-600 after:ms-6 dark:before:border-gray-700 dark:after:border-gray-700 transition-opacity duration-300">
                      Add section
                    </div>
                  </Separator>
                </Button>
                }
                
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