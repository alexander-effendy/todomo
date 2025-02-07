// VITE_API_BASE_URL=https://todomo-production.up.railway.app/
// VITE_API_BASE_URL=http://localhost:3000

import MaxWidthWrapper from "@/component/MaxWidthWrapper";
import { Button } from '@/components/ui/button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useEffect, useState, useContext } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { getCategory, deleteCategory, renameCategory } from '@/api/category';
import { getSubcategory, postSubcategory, deleteSubcategory, renameSubcategory } from "@/api/subcategory";
import { postGeneralTasks } from "@/api/generalTask";
import { getTasks, postTasks, deleteTasks, renameTasks, checkTasks } from "@/api/task";
import DashboardIcon from '@mui/icons-material/Dashboard';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import AddCategoryModal from '@/component/Dialog/AddCategoryDialog';
import { Context } from "@/UseContext";

import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import Lottie from 'lottie-react';
import Todo from '@/asset/todo.json';

import CategoryList from '@/component/categoryList';
import GeneralTaskList from '@/component/generalTaskList';

import useMediaQuery from '@mui/material/useMediaQuery';

import Loader from '../component/Loader/Game';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

const Home = () => {

  const mobileScreen = useMediaQuery('(max-width:1366px)');

  // useContext
  const { currentCategory, setCurrentCategory, update, setUpdate, currentCategoryName, setCurrentCategoryName } = useContext(Context);

  // utils
  const { getToken, isAuthenticated, user } = useKindeAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // category
  const [categoryModalOpen, setCategoryModalOpen] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [categories, setCategories] = useState<any>([]);
  const [editCategoryActive, setEditCategoryActive] = useState<any>({});

  // subcategory (section)
  const [addSectionActive, setAddSectionActive] = useState<boolean>(false);
  const [currentAddSubcategory, setCurrentAddSubcategory] = useState<string>('');
  const [subCategories, setSubcategories] = useState<any>([]);
  const [editSubcategoryActive, setEditSubcategoryActive] = useState<any>({});
  const [newSubcategoryName, setNewSubcategoryName] = useState<string>('');

  // task
  // const [generalTasks, setGeneralTasks] = useState<any>([]);
  const [addTaskGeneralActive, setAddTaskGeneralActive] = useState<boolean>(false);
  const [tasks, setTasks] = useState<any>([]);
  const [currentAddTaskName, setCurrentAddTaskName] = useState<string>('');
  const [currentAddTaskSubcategory, setCurrentAddTaskSubcategory] = useState<Number>(-1);
  const [addTaskActive, setAddTaskActive] = useState<any>({});

  const openModal = () => setCategoryModalOpen(true);
  const closeModal = () => setCategoryModalOpen(false);

  // category functions
  const handleDeleteCategory = async (categoryId: Number) => {
    console.log(categoryId);
    const token = await getToken();
    await deleteCategory(token, categoryId);
    setUpdate(!update);
    setIsLoading(false);
    setCurrentCategory(-1);
  }

  const handleRenameCategory = (categoryId: any, categoryName: any) => {
    setNewCategoryName(categoryName);
    setEditCategoryActive((prev: any) => ({
      ...prev,
      [categoryId]: true,
    }));
  };

  const handleSaveCategoryName = async (categoryId: any) => {
    setIsLoading(true);
    const token = await getToken();
    await renameCategory(token, categoryId, newCategoryName);
    
    // After saving, set the edit mode to false
    setEditCategoryActive((prev: any) => ({
      ...prev,
      [categoryId]: false,
    }));
    setNewCategoryName('');
    setCurrentCategoryName(newCategoryName);
    setUpdate(!update);
    setIsLoading(false);
  };

  // subcategory functions
  const handleAddSubcategory = async () => {
    const token = await getToken();
    await postSubcategory(token, currentAddSubcategory, currentCategory);
    setUpdate(!update);
  }

  const handleDeleteSubcategory = async (subcategoryId: Number) => {
    console.log(subcategoryId);
    const token = await getToken();
    await deleteSubcategory(token, subcategoryId);
    console.log('delete sub')
    setUpdate(!update);
  }

  const handleRenameSubcategory = (subcategoryId: any, subcategoryName: any) => {
    setNewSubcategoryName(subcategoryName);
    setEditSubcategoryActive((prev: any) => ({
      ...prev,
      [subcategoryId]: true,
    }));
  };

  const handleSaveSubcategoryName = async (subcategoryId: any) => {
    setIsLoading(true);
    const token = await getToken();
    await renameSubcategory(token, subcategoryId, newSubcategoryName)
    
    // After saving, set the edit mode to false
    setEditSubcategoryActive((prev: any) => ({
      ...prev,
      [subcategoryId]: false,
    }));
    setNewSubcategoryName('');
    setIsLoading(false);
    setUpdate(!update);
  };

  const handleSaveSubcategoryNameEnter = (e: any, subCategoryId: any) => {
    if (e.key === 'Enter') handleSaveSubcategoryName(subCategoryId);
  }

  // task functions
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

  const [taskNewName, setTaskNewName] = useState<string>('');
  const [editTaskActive, setEditTaskActive] = useState<any>({});

  const handleDeleteTasks = async (taskId: Number) => {
    const token = await getToken();
    await deleteTasks(token, taskId);
    setUpdate(!update);
  }

  const handleRenameTask = (taskId: any, taskName: any) => {
    setTaskNewName(taskName);
    setEditTaskActive((prev: any) => ({
      ...prev,
      [taskId]: true,
    }));
  };

  const handleSaveTaskName = async (taskId: any) => {
    setIsLoading(true);
    const token = await getToken();
    await renameTasks(token, taskId, taskNewName)
    
    // After saving, set the edit mode to false
    setEditTaskActive((prev: any) => ({
      ...prev,
      [taskId]: false,
    }));
    setTaskNewName('');
    setUpdate(!update);
    setIsLoading(false);
  };

  const handleSaveTaskNameEnter = (e: any, taskId: any) => {
    if (e.key === 'Enter') handleSaveTaskName(taskId);
  }

  const handleCheckChange = async (taskId: Number | undefined) => {
    // frontend instant change
    const updatedTasks = tasks.map((task: any) => 
      task.id === taskId ? { ...task, task_status: !task.task_status } : task
    )
    setTasks(updatedTasks);

    // backend doing api under the hood
    const token = await getToken();
    await checkTasks(token, taskId);
    // setUpdate(!update);
  }

  

  // useEffects
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      if (isAuthenticated) {
        const token = await getToken();
        if (user) {
          const data = await getCategory(token, user.email);
          setCategories(data);
        }
      }
    };
    fetchCategories();
    setIsLoading(false);
  }, [isAuthenticated, getToken, update]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      if (isAuthenticated) {
        const token = await getToken();

        const [tasksData, subcategoriesData] = await Promise.all([
          getTasks(token, currentCategory),
          getSubcategory(token, currentCategory),
        ]);

        setSubcategories(subcategoriesData);
        // setGeneralTasks(generalTasksData);
        setTasks(tasksData);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [currentCategory, update]);

  return (
    <MaxWidthWrapper>
      <section className="w-full h-full">
        <AddCategoryModal isOpen={categoryModalOpen} openModal={openModal} closeModal={closeModal} />
        {isAuthenticated && user ? (
          <section className="flex h-full w-full">
            {/* sidebar */}
            {!mobileScreen ?
              <section className="border-r-[1px] border-gray-300 w-[350px] pr-[15px]">
                <section className="flex bg-red-200s">
                  <Button 
                    className="select-none mt-[10px] flex justify-start items-center w-full hover:bg-[#eff1f4]"
                    onClick={() => setCategoryModalOpen(true)}
                  >
                    <AddCircleIcon className="mr-[5px] text-[#4ca065]"/>
                    Add Category
                  </Button>
                </section>
              
                <div className="w-full h-[20px]"></div>
              
                <CategoryList 
                  isMobile={false}
                  categories={categories}
                  currentCategory={currentCategory}
                  setCurrentCategory={setCurrentCategory}
                  setCurrentCategoryName={setCurrentCategoryName}
                  handleRenameCategory={handleRenameCategory}
                  handleDeleteCategory={handleDeleteCategory}
                  editCategoryActive={editCategoryActive}
                  setEditCategoryActive={setEditCategoryActive}
                  handleSaveCategoryName={handleSaveCategoryName}
                  newCategoryName={newCategoryName}
                  setNewCategoryName={setNewCategoryName}
                  setIsLoading={setIsLoading}
                />
              </section> :
                <Sheet>
                  <SheetTrigger className="fixed top-[70px] left-[15px]"><DashboardIcon /></SheetTrigger>
                    <SheetContent>
                      <section className="flex">
                      <SheetClose>
                        <Button 
                          className="select-none flex justify-start items-center w-[200px] hover:bg-[#eff1f4]"
                          onClick={() => setCategoryModalOpen(true)}
                        > 
                          <AddCircleIcon className="mr-[5px] text-[#4ca065]"/>
                          Add Category
                        </Button>
                      </SheetClose>
                      
                      {/* <StorageIcon className="text-gray-300 mt-[16px] hover:cursor-pointer" /> */}
                    </section>
                
                    <div className="w-full h-[20px]"></div>
                    <SheetClose>
                      <CategoryList
                        isMobile={true}
                        categories={categories}
                        currentCategory={currentCategory}
                        setCurrentCategory={setCurrentCategory}
                        setCurrentCategoryName={setCurrentCategoryName}
                        handleRenameCategory={handleRenameCategory}
                        handleDeleteCategory={handleDeleteCategory}
                        editCategoryActive={editCategoryActive}
                        setEditCategoryActive={setEditCategoryActive}
                        handleSaveCategoryName={handleSaveCategoryName}
                        newCategoryName={newCategoryName}
                        setNewCategoryName={setNewCategoryName}
                        setIsLoading={setIsLoading}
                      />
                    </SheetClose>
                  </SheetContent>
                </Sheet>
            }
            

            {/* category content */}
            {currentCategory !== -1 &&
              <div className={`mt-[50px] flex-grow mx-auto ${mobileScreen ? 'max-w-[75%]' : 'max-w-[50%]'} bg-blue-200s`}>
                <section className="flex flex-col">
                  <span className="text-3xl font-bold mb-5">{currentCategoryName}</span>
                  {/* map existing tasks, empty if none */}
  
                  {isLoading && <Loader className="absolute top-1/2 left-1/2"/>}
                  
                  {/* general tasks */}
                  <GeneralTaskList
                    isMobile={mobileScreen}
                    addTaskGeneralActive={addTaskGeneralActive}
                    setAddTaskGeneralActive={setAddTaskGeneralActive}
                    setAddSectionActive={setAddSectionActive}
                    setCurrentAddTaskName={setCurrentAddTaskName}
                    handleAddGeneralTasks={handleAddGeneralTasks}
                    setIsLoading={setIsLoading}
                  />
                  {/* end of General Tasks */}

                  {/* map existing sections, empty if none */}
                  {subCategories.map((subCategory: any) => (
                    <div key={subCategory.id} className="select-none w-full mt-[30px]">
                      <div className="relative flex items-center">
                        <KeyboardArrowDownIcon className="absolute left-[-30px] top-[50%] transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        {editSubcategoryActive[subCategory.id] ?
                          <input
                            placeholder="insert new category name"
                            onBlur={() => handleSaveSubcategoryName(subCategory.id)}
                            value={newSubcategoryName}
                            onChange={(e) => setNewSubcategoryName(e.target.value)}
                            className="h-[30px] border-[2px] border-blue-500 w-full rounded-[7px] p-[7px]"
                            onKeyDown={(e) => handleSaveSubcategoryNameEnter(e, subCategory.id)}
                          />
                          :
                          <div className="group border-b-[1px] border-gray-300 w-full flex justify-between font-bold py-[10px]">
                            {subCategory.subcategory_name}
                            <DropdownMenu>
                            <DropdownMenuTrigger><MoreVertIcon className={`${mobileScreen ? 'visible' : 'invisible group-hover:visible'}`}/></DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuLabel>Edit Subcategory</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleRenameSubcategory(subCategory.id, subCategory.subcategory_name)}>Rename</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {handleDeleteSubcategory(subCategory.id); setIsLoading(true);}}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          </div>
                        }
                      </div>
                      
                      {/* map all the tasks that belong to this sub category */}
                      {tasks.filter((task: any) => task.subcategory === subCategory.id).map((task: any) => (
                       <div
                          key={task.id} 
                          className="hover:bg-[#fcfafa] group hover:cursor-pointer select-none justify-between flex py-[8px] border-b-[1px] border-gray-300 w-full"
                        >
                          {/* if checkbox clicked, remove generalTask? or mark it as done */}
                          {editTaskActive[task.id] ?
                            <input
                              placeholder="insert new category name"
                              onBlur={() => handleSaveTaskName(task.id)}
                              value={taskNewName}
                              onChange={(e) => setTaskNewName(e.target.value)}
                              className="h-[30px] border-blue-500 border-[2px] w-full rounded-[7px] p-[7px]"
                              onKeyDown={(e) => handleSaveTaskNameEnter(e, task.id)}
                            />
                            :
                            <div className="flex gap-[10px]">
                              <Checkbox className="mt-[5px]" 
                                checked={task.task_status}
                                onCheckedChange={() => handleCheckChange(task.id)}
                              />
                              {task.task_name}
                            </div>
                          }
                          <DropdownMenu>
                            <DropdownMenuTrigger><MoreVertIcon className={`${mobileScreen ? 'visible' : 'invisible group-hover:visible'}`}/></DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuLabel>Edit Task</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleRenameTask(task.id, task.task_name)}>Rename</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteTasks(task.id)}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                            handleAddSubcategory();
                            setIsLoading(true);
                          }}
                        >Add section</Button>
                      </section>
                    </div>
                  }
                  {!addSectionActive &&
                  <Button className={`w-full flex bg-none ${mobileScreen ? 'text-black' : 'text-white hover:text-black'} ${addSectionActive && 'text-black'}`}
                    onClick={() => { setAddSectionActive(true); setAddTaskActive(false)}}
                  >
                    <Separator asChild className="my-3 bg-background">
                      <div className={` ${mobileScreen ? 'oapcity-100' : 'opacity-0 hover:opacity-100'} visible py-3 flex items-center text-xs text-black uppercase before:flex-[1_1_0%] before:border-t before:border-gray-600 before:me-6 after:flex-[1_1_0%] after:border-t after:border-gray-600 after:ms-6 dark:before:border-gray-700 dark:after:border-gray-700 transition-opacity duration-300`}>
                        Add section
                      </div>
                    </Separator>
                  </Button>
                  }
                  <div className="w-full mt-[100px]"></div>
                </section>
              </div>
            }

            {currentCategory === -1 &&
              <div className="w-full h-full grid place-items-center">
                <Lottie className="my-auto" animationData={Todo} loop={true} />
                <div className="text-2xl font-bold">Open sidebar to start hehehe</div>
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