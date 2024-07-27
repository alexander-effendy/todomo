import MaxWidthWrapper from "@/component/MaxWidthWrapper";
// import useMediaQuery from '@mui/material/useMediaQuery';

import { useEffect, useState } from 'react';

import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { getCategory, postCategory } from '../api/category';

const Home = () => {

  // const smallScreen = useMediaQuery('(max-width:600px)');
  // const mediumScreen = useMediaQuery('(max-width:1000px)');
  // const bigScreen = useMediaQuery('(max-width:1500px)');
  // const largeScreen = useMediaQuery('(max-width:2000px)');

  const { getToken, isAuthenticated, user } = useKindeAuth();
  const [categories, setCategories] = useState<any>([]);

  const [categoryInput, setCategoryInput] = useState<string>('');
  const [update, setUpdate] = useState<boolean>(true);
  useEffect(() => {
    const fetchCategories = async () => {
      if (isAuthenticated) {
        const token = await getToken();
        if (user) {
          const data = await getCategory(token, user.email);
          console.log(data);
          setCategories(data);
          setUpdate(!update);
        }
      }
    };
    fetchCategories();
  }, [isAuthenticated, getToken]);

  useEffect(() => {

  }, [update])

  const handleAddCategory = async () => {
    if (categoryInput.length < 3) {
      alert('Category name length cannot be short than 3 letters');
      return;
    }
    if (!user) return;
    const token = await getToken();
    const newCategory = await postCategory(token, categoryInput, user.email);
    setCategories([...categories, newCategory]);
    setCategoryInput('');
  }

  return (
    <MaxWidthWrapper>
      <section className="w-full h-full grid place-items-center">
        <div>New Category Name: 
          <input 
            value={categoryInput} 
            onChange={(e) => {setCategoryInput(e.target.value); console.log(categoryInput);}} 
            className="border-[1px] border-black" 
          />
        </div>
        <button 
          onClick={() => {
            handleAddCategory();
          }} 
          className="bg-black text-white p-10">Add category</button>
        <div>Categories:</div>
        {categories.map((category: any) => (
          <div key={category.id}>category: {category.category_name}</div>
        ))}
        
      </section>
    </MaxWidthWrapper>
    
  )
}

export default Home;