import React, { useContext, useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from '@/components/ui/button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { deleteGeneralTasks } from '@/api/generalTask';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { Context } from "@/UseContext";
import { getGeneralTasks, renameGeneralTasks, checkGeneralTasks } from '@/api/generalTask';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface GeneralTaskListProps {
  isMobile: boolean;
  addTaskGeneralActive: boolean;
  setAddTaskGeneralActive: (status: boolean) => void;
  setAddSectionActive: (status: boolean) => void;
  setCurrentAddTaskName: (name: string) => void;
  handleAddGeneralTasks: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

const generalTaskList: React.FC<GeneralTaskListProps> = React.memo(({ isMobile, addTaskGeneralActive, setAddTaskGeneralActive, setAddSectionActive, setCurrentAddTaskName, handleAddGeneralTasks, setIsLoading }) => {
  const { getToken } = useKindeAuth();

  const { update, setUpdate, currentCategory } = useContext(Context);

  const [taskNewName, setTaskNewName] = useState<string>('');
  const [editGeneralTaskActive, setEditGeneralTaskActive] = useState<any>({});

  const handleRenameGeneralTask = (taskId: any, taskName: any) => {
    setTaskNewName(taskName);
    setEditGeneralTaskActive((prev: any) => ({
      ...prev,
      [taskId]: true,
    }));
  };

  const handleSaveGeneralTaskName = async (taskId: any) => {
    setIsLoading(true);
    const token = await getToken();
    await renameGeneralTasks(token, taskId, taskNewName);
    
    // After saving, set the edit mode to false
    setEditGeneralTaskActive((prev: any) => ({
      ...prev,
      [taskId]: false,
    }));
    setTaskNewName('');
    setUpdate(!update);
    setIsLoading(false);
  };

  const handleDeleteGeneralTask = async (taskId: Number) => {
    const token = await getToken();
    await deleteGeneralTasks(token, taskId);
    setUpdate(!update);
  }

  const handleSaveTaskNameEnter = (e: any, taskId: any) => {
    if (e.key === 'Enter') handleSaveGeneralTaskName(taskId);
  }

  const [tasks, setTasks] = useState<any>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = await getToken();
      const fetchedTasks = await getGeneralTasks(token, currentCategory)
      setTasks(fetchedTasks)
    }
    fetchTasks();
    console.log(tasks);
  }, [currentCategory, update])

  const handleCheckChange = async (taskId: Number | undefined) => {

    // frontend (instant UI update)
    const updatedTasks = tasks.map((task: any) => 
      task.id === taskId ? { ...task, task_status: !task.task_status } : task
    )
    setTasks(updatedTasks)

    // backend doing api call under the hood without the user knowing
    const token = await getToken();
    await checkGeneralTasks(token, taskId);
    // setUpdate(!update);
  }

  return (
    <div className="w-full ">
      {/* general tasks */}
      {tasks.map((generalTask: any) => (
        <div
          key={generalTask.id} 
          className="hover:bg-[#fcfafa] group hover:cursor-pointer select-none justify-between flex py-[8px] border-b-[1px] border-gray-300 w-full"
        >
          {/* if checkbox clicked, remove generalTask? or mark it as done */}
          {editGeneralTaskActive[generalTask.id] ?
            <input
              placeholder="insert new category name"
              onBlur={() => handleSaveGeneralTaskName(generalTask.id)}
              value={taskNewName}
              onChange={(e) => setTaskNewName(e.target.value)}
              onKeyDown={(e) => handleSaveTaskNameEnter(e, generalTask.id)}
              className="h-[30px] border-blue-500 border-[2px] w-full rounded-[7px] p-[7px]"
            />
            :
            <div className="flex gap-[10px] w-full">
              <Checkbox 
                checked={generalTask.task_status}
                onCheckedChange={() => handleCheckChange(generalTask.id)}
                className="flex my-auto"
              />
              <div className="flex justify-between w-full">
              {generalTask.task_name}
              <DropdownMenu>
                <DropdownMenuTrigger><MoreVertIcon className={`${isMobile ? 'visible' : 'invisible group-hover:visible'} `}/></DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Edit Task</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleRenameGeneralTask(generalTask.id, generalTask.task_name)}>Rename</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteGeneralTask(generalTask.id)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </div>
            </div>
          }
          
          
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
                setIsLoading(true);
              }}
            >
              Add tasks
            </Button>
          </section>
        </div>
      }
      {/* end of General Tasks */}
    </div>
  )
})
export default generalTaskList;