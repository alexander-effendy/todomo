import { createContext, useState, Dispatch, SetStateAction, ReactNode } from 'react';

interface ContextType {
  currentCategory: Number | undefined;
  setCurrentCategory: Dispatch<SetStateAction<Number | undefined>>;
  currentCategoryName: string | undefined;
  setCurrentCategoryName: Dispatch<SetStateAction<string | undefined>>;
  currentCategoryInput: string | undefined;
  setCurrentCategortyInput: Dispatch<SetStateAction<string | undefined>>;
  update: boolean | undefined;
  setUpdate: Dispatch<SetStateAction<boolean | undefined>>;
}

const placeholderFunction = () => {
  // placeholder function
};

const defaultContextValue: ContextType = {
  currentCategory: -1,
  setCurrentCategory: placeholderFunction,
  currentCategoryName: '',
  setCurrentCategoryName: placeholderFunction,
  currentCategoryInput: '',
  setCurrentCategortyInput: placeholderFunction,
  update: false,
  setUpdate: placeholderFunction
};

export const Context = createContext<ContextType>(defaultContextValue);

export const ContextProvider = ({ children }: {children: ReactNode}) => {
  const [currentCategory, setCurrentCategory] = useState<Number | undefined>(-1);
  const [currentCategoryName, setCurrentCategoryName] = useState<string | undefined>('');
  const [currentCategoryInput, setCurrentCategortyInput] = useState<string | undefined>('');
  const [update, setUpdate] = useState<boolean | undefined>(false);

  return (
    <Context.Provider
      value={{
        currentCategory,
        setCurrentCategory,
        currentCategoryName,
        setCurrentCategoryName,
        currentCategoryInput,
        setCurrentCategortyInput,
        update,
        setUpdate
      }}>
      {children}
    </Context.Provider>
  );
};