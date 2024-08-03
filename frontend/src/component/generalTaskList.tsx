import React, { useContext, useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from '@/components/ui/button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { deleteGeneralTasks } from '@/api/generalTask';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { Context } from "@/UseContext";
import { renameGeneralTasks } from '@/api/generalTask';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface GeneralTaskListProps {
  generalTasks: any[];
  addTaskGeneralActive: boolean;
  setAddTaskGeneralActive: (status: boolean) => void;
  setAddSectionActive: (status: boolean) => void;
  setCurrentAddTaskName: (name: string) => void;
  handleAddGeneralTasks: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

const generalTaskList: React.FC<GeneralTaskListProps> = React.memo(({ generalTasks, addTaskGeneralActive, setAddTaskGeneralActive, setAddSectionActive, setCurrentAddTaskName, handleAddGeneralTasks, setIsLoading }) => {
  const { getToken } = useKindeAuth();

  const { update, setUpdate } = useContext(Context);

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
    await renameGeneralTasks(token, taskId, taskNewName)
    
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

  return (
    <div className="w-full ">
      {/* general tasks */}
      {generalTasks.map((generalTask: any) => (
        <div
          key={generalTask.id} 
          className="group hover:cursor-pointer select-none justify-between flex mt-[15px] pb-[10px] border-b-[1px] border-gray-300 w-full"
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
            <div className="flex gap-[10px]">
              <Checkbox className="mt-[5px]"/>
              {generalTask.task_name}
            </div>
          }
          
          <DropdownMenu>
          <DropdownMenuTrigger><MoreVertIcon className={`invisible group-hover:visible`}/></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Edit Task</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleRenameGeneralTask(generalTask.id, generalTask.task_name)}>Rename</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteGeneralTask(generalTask.id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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