import axios from 'axios';

export const getGeneralTasks = async (token: any, categoryId: any) => {
  console.log('frontend trying to fetch general tasks');
  try {
    const response = await axios.get(`http://localhost:3000/api/generalTasks?categoryId=${categoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log('Categories retrieved:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during fetching categories:', error);
  }
}

export const postGeneralTasks = async (token: any, generalTaskName: string, generalTaskDescription:string, categoryId: Number | undefined) => {
  try {
    const response = await axios.post('http://localhost:3000/api/generalTasks', { generalTaskName, generalTaskDescription, categoryId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log('Category added', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during adding category:', error);
  }
}