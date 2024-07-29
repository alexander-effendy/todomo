import axios from 'axios';

export const getTasks = async (token: any, categoryId: any) => {
  console.log('frontend trying to fetch general tasks');
  try {
    const response = await axios.get(`http://localhost:3000/api/tasks?categoryId=${categoryId}`, {
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

export const postTasks = async (token: any, taskName: string, taskStatus: boolean, taskDescription:string, subcategoryId: Number | undefined, categoryId: Number | undefined) => {
  console.log('frontend posting tasks');
  console.log(taskName, taskDescription, taskStatus, subcategoryId, categoryId);
  try {
    const response = await axios.post('http://localhost:3000/api/tasks', { taskName, taskStatus, taskDescription, subcategoryId, categoryId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log('Category added', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during adding task:', error);
  }
}