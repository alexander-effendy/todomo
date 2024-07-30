import MaxWidthWrapper from "@/component/MaxWidthWrapper";
import { Button } from '@/components/ui/button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useEffect, useState, useContext } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { getCategory, deleteCategory, renameCategory } from '@/api/category';
import { getSubcategory, postSubcategory } from "@/api/subcategory";
import { getGeneralTasks, postGeneralTasks } from "@/api/generalTask";
import { getTasks, postTasks } from "@/api/task";

import AssignmentIcon from '@mui/icons-material/Assignment';
import AddCategoryModal from '@/component/Dialog/AddCategoryDialog';
import { Context } from "@/UseContext";

import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Lottie from 'lottie-react';
import Todo from '@/asset/todo.json';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

const Home = () => {

  const { currentCategory, setCurrentCategory, update, setUpdate, currentCategoryName, setCurrentCategoryName } = useContext(Context);

  const [categoryModalOpen, setCategoryModalOpen] = useState<boolean>(false);
  const [addSectionActive, setAddSectionActive] = useState<boolean>(false);
  const [addTaskGeneralActive, setAddTaskGeneralActive] = useState<boolean>(false);

  const [currentAddSubcategory, setCurrentAddSubcategory] = useState<string>('');
  const [generalTasks, setGeneralTasks] = useState<any>([]);
  const [tasks, setTasks] = useState<any>([]);

  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const openModal = () => setCategoryModalOpen(true);
  const closeModal = () => setCategoryModalOpen(false);

  const { getToken, isAuthenticated, user } = useKindeAuth();

  const [categories, setCategories] = useState<any>([]);
  const [subCategories, setSubcategories] = useState<any>([]);
  // const [currentAddTaskId, setCurrentAddTaskId] = useState<Number>(-1);
  const [currentAddTaskName, setCurrentAddTaskName] = useState<string>('');
  const [editCategoryActive, setEditCategoryActive] = useState<any>({});
  const [currentAddTaskSubcategory, setCurrentAddTaskSubcategory] = useState<Number>(-1);

  const handleAddSubcategory = async () => {
    const token = await getToken();
    await postSubcategory(token, currentAddSubcategory, currentCategory);
    setUpdate(!update);
  }

  const handleDeleteCategory = async (categoryId: Number) => {
    console.log(categoryId);
    const token = await getToken();
    await deleteCategory(token, categoryId);
    setUpdate(!update);
  }

  const handleRenameCategory = (categoryId: any, categoryName: any) => {
    setNewCategoryName(categoryName);
    setEditCategoryActive((prev: any) => ({
      ...prev,
      [categoryId]: true,
    }));
  };

  const handleSaveCategoryName = async (categoryId: any) => {
    // Your logic to save the new category name
    // For now, we just log it
    // console.log(newCategoryName[categoryId]);
    console.log(newCategoryName);
    // call api here
    const token = await getToken();
    await renameCategory(token, categoryId, newCategoryName)
    
    // After saving, set the edit mode to false
    setEditCategoryActive((prev: any) => ({
      ...prev,
      [categoryId]: false,
    }));
    setNewCategoryName('');
    setUpdate(!update);
  };

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
    const fetchSubcategories = async () => {
      if (isAuthenticated) {
        const token = await getToken();
        const data = await getSubcategory(token, currentCategory);
        setSubcategories(data);
      }
    };

    const fetchGeneralTasks = async () => {
      const token = await getToken();
      const data = await getGeneralTasks(token, currentCategory);
      setGeneralTasks(data);
    };

    const fetchTasks = async () => {
      const token = await getToken();
      if (currentCategory !== -1) {
        const data = await getTasks(token, currentCategory);
        setTasks(data);
      }
    };

    fetchSubcategories();
    fetchGeneralTasks();
    fetchTasks();    
  }, [currentCategory, update]);

  const [addTaskActive, setAddTaskActive] = useState<any>({});

  const handleAddTaskClick = async (id: any) => {
    setCurrentAddTaskSubcategory(id);
    setAddTaskActive((prevState: any) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
    const token = await getToken();
    if (currentAddTaskName.length > 0) {
      await postTasks(token, currentAddTaskName, false, 'alex momo', currentAddTaskSubcategory, currentCategory);
      setCurrentAddTaskName('');
    }
    setUpdate(!update);
  };

  const handleAddGeneralTasks = async () => {
    const token = await getToken();
    console.log(currentCategory);
    await postGeneralTasks(token, currentAddTaskName, 'alex nehimomo', currentCategory);
    setUpdate(!update);
  }

  return (
    <MaxWidthWrapper>
      <section className="w-full h-full">
        <AddCategoryModal isOpen={categoryModalOpen} openModal={openModal} closeModal={closeModal} />
        {isAuthenticated && user ? (
          <section className="flex h-full w-full">
            {/* sidebar */}
            <section className="border-r-[1px] border-gray-300 w-[300px] pr-[15px]">
              <Button 
                className="select-none mt-[10px] flex justify-start items-center w-full hover:bg-[#eff1f4]"
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
                    setCurrentCategoryName(category.category_name);
                  }}
                  className={`group rounded-[5px] flex justify-between items-center hover:bg-[#eff1f4] ${category.id === currentCategory && 'bg-[#e0e2e6] hover:bg-[#e0e2e6]'}`}
                  key={category.id}
                >
                  <div className="flex items-center">
                    <AssignmentIcon className="text-[#b1b4b7] mr-[5px]" />
                    {editCategoryActive[category.id] ?
                      <input 
                        placeholder="insert new category name" 
                        onBlur={() => handleSaveCategoryName(category.id)}
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="h-[30px]"
                      />
                      :
                      <div>{category.category_name}</div>
                    }
                    
                  </div>
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <MoreHorizIcon className="invisible group-hover:visible justify-end" />
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem onClick={() => handleRenameCategory(category.id, category.category_name)} className="hover:font-bold">Rename</ContextMenuItem>
                      <ContextMenuItem onClick={() => handleDeleteCategory(category.id)} className="hover:font-bold">Delete</ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </Button>
                ))}
              </div>
            </section>

            {/* category content */}
            {currentCategory !== -1 &&
              <div className="mt-[50px] flex-grow mx-auto max-w-[900px] bg-blue-20s0">
                <section className="flex flex-col items-start">
                  <span className="text-3xl font-bold mb-5">{currentCategoryName}</span>
                  {/* map existing tasks, empty if none */}
                  {/* general tasks */}
                  {generalTasks.map((generalTask: any) => (
                    <div 
                      key={generalTask.id} 
                      className="select-none flex gap-[10px] mt-[15px] h-[35px] border-b-[1px] border-gray-300 w-full"
                    >
                      {/* if checkbox clicked, remove generalTask? or mark it as done */}
                      <Checkbox className="mt-[5px]"/>
                    {generalTask.task_name}
                    </div>
                  ))}

                  {addTaskGeneralActive || 
                    <div>
                      <Button className="mt-5 text-gray-400 items-start pl-0 hover:text-black"
                        onClick={() => {setAddTaskGeneralActive(true); setAddSectionActive(false)}}
                      >       
                        <AddCircleIcon className="mr-[5px]"/>
                        <div className="my-auto">Add task</div>
                      </Button>
                    </div>
                  }

                  {addTaskGeneralActive &&
                    <div className="select-none p-[10px] mt-[10px] w-full rounded-[10px]">
                      <input 
                        className="mb-[10px] border-[2px] rounded-[7px] border-gray-400 h-[35px] focus:outline-none px-[15px] w-full mt-[10px]" 
                        placeholder="Insert task name"
                        onChange={(e) => {
                          setCurrentAddTaskName(e.target.value)
                        }}
                      >
                        
                      </input>
                      <section className="flex justify-end gap-2 pt-3">
                        <Button className="bg-gray-100 rounded-[5px] hover:bg-gray-300" onClick={() => setAddTaskGeneralActive(false)}>Cancel</Button>
                        <Button className="bg-green-200 rounded-[5px] hover:bg-green-300" 
                          onClick={() => {
                            setAddTaskGeneralActive(false);
                            handleAddGeneralTasks();
                          }}
                        >
                          Add tasks
                        </Button>
                      </section>
                    </div>
                  }

                  {/* end of General Tasks */}

                  {/* map existing sections, empty if none */}
                  {subCategories.map((subCategory: any) => (
                    <div key={subCategory.id} className="w-full mt-[30px]">
                      <div className="relative flex items-center">
                        <KeyboardArrowDownIcon className="absolute left-[-30px] top-[50%] transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <div className="border-b-[1px] border-gray-300 w-full font-bold">
                          {subCategory.subcategory_name}
                        </div>
                      </div>
                      
                      {/* map all the tasks that belong to this sub category */}
                      {/* tasks contains all tasks that belong to this category */}
                      {/* map it according to the relevant subcategory */}
                      {tasks.filter((task: any) => task.subcategory === subCategory.id).map((task: any) => (
                        <div 
                        key={task.id} 
                        className="flex gap-[10px] mt-[15px] h-[35px] border-b-[1px] border-gray-300 w-full"
                      >
                        {/* if checkbox clicked, remove generalTask? or mark it as done */}
                        <Checkbox className="mt-[5px]"/>
                      {task.task_name}
                      </div>
                      ))}
                                          
                      {addTaskActive[subCategory.id] ||
                        <div className="select-none">
                          <Button
                            className="mt-5 text-gray-400 items-start pl-0 hover:text-black"
                            onClick={() => handleAddTaskClick(subCategory.id)}
                          >
                            <AddCircleIcon className="mr-[5px]" />
                            <div className="my-auto">Add task</div>
                          </Button>
                        </div>
                      }
                      

                      {addTaskActive[subCategory.id] && (
                        <div className="select-none p-[10px] mt-[10px] w-full border-[2px] border-gray-400 rounded-[10px]">
                          <input
                            className="mb-[10px] focus:outline-none px-[15px] w-full mt-[10px]"
                            placeholder="Task name"
                            onChange={(e) => setCurrentAddTaskName(e.target.value)}
                          />
                          <section className="flex justify-end gap-2 border-t-[1px] border-gray-400 pt-3">
                            <Button
                              className="bg-gray-100 rounded-[5px] hover:bg-gray-300"
                              onClick={() => handleAddTaskClick(subCategory.id)}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="bg-green-200 rounded-[5px] hover:bg-green-300"
                              onClick={() => handleAddTaskClick(subCategory.id)}
                            >
                              Add task
                            </Button>
                          </section>
                        </div>
                      )}
                    </div>
                  ))}


                  {addSectionActive &&
                    <div className="select-none p-[10px] mt-[10px] w-full border-[2px] border-gray-400 rounded-[10px]">
                      <input
                        onChange={(e) => {
                          setCurrentAddSubcategory(e.target.value);
                          console.log(currentAddSubcategory);
                        }} 
                        className="select-none mb-[10px] focus:outline-none px-[15px] w-full mt-[10px]" placeholder="Section name"></input>
                      <section className="flex justify-end gap-2 border-t-[1px] border-gray-400 pt-3">
                        <Button className="bg-gray-100 rounded-[5px] hover:bg-gray-300" onClick={() => setAddSectionActive(false)}>Cancel</Button>
                        <Button className="bg-green-200 rounded-[5px] hover:bg-green-300" 
                          onClick={() => {
                            setAddSectionActive(false);
                            // send req api here
                            handleAddSubcategory();
                          }}
                        >Add section</Button>
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
            }

            {currentCategory === -1 &&
              <div className="w-full h-full grid place-items-center">
                <Lottie className="my-auto" animationData={Todo} loop={true} />
              </div>
            }
            
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