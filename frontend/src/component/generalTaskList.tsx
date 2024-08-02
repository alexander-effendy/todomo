import React from 'react';
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from '@/components/ui/button';
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface GeneralTaskListProps {
  generalTasks: any[];
  addTaskGeneralActive: boolean;
  setAddTaskGeneralActive: (status: boolean) => void;
  setAddSectionActive: (status: boolean) => void;
  setCurrentAddTaskName: (name: string) => void;
  handleAddGeneralTasks: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

const generalTaskList: React.FC<GeneralTaskListProps> = React.memo(({ generalTasks, addTaskGeneralActive, setAddTaskGeneralActive, setAddSectionActive, setCurrentAddTaskName, handleAddGeneralTasks, setIsLoading }) => (
    <div className="w-full">
      {/* general tasks */}
      {generalTasks.map((generalTask: any) => (
        <div 
          key={generalTask.id} 
          className="select-none flex gap-[10px] mt-[15px] pb-[10px] border-b-[1px] border-gray-300 w-full"
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
)

export default generalTaskList;