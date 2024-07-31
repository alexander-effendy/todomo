import React from 'react';
import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import AssignmentIcon from '@mui/icons-material/Assignment';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

interface CategoryListProps {
  categories: any[];
  currentCategory: Number | undefined;
  setCurrentCategory: (id: number) => void;
  setCurrentCategoryName: (name: string) => void;
  handleRenameCategory: (id: number, name: string) => void;
  handleDeleteCategory: (id: number) => void;
  editCategoryActive: { [key: number]: boolean };
  setEditCategoryActive: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>;
  handleSaveCategoryName: (id: number) => void;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = React.memo(({ categories, currentCategory, setCurrentCategory, setCurrentCategoryName, handleRenameCategory, handleDeleteCategory, editCategoryActive, handleSaveCategoryName, newCategoryName, setNewCategoryName }) => (
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
));

export default CategoryList;
