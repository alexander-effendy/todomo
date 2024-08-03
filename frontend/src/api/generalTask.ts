import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getGeneralTasks = async (token: any, categoryId: any) => {
  // console.log('frontend trying to fetch general tasks');
  try {
    const response = await api.get(`/api/generalTasks?categoryId=${categoryId}`, {
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
    const response = await api.post('/api/generalTasks', { generalTaskName, generalTaskDescription, categoryId }, {
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

export const deleteGeneralTasks = async (token: any, taskId: Number | undefined) => {
  console.log('deleting general task with id: ', taskId);
  try {
    const response = await api.delete(`/api/generalTasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting general task:', error);
    throw error;
  }
};

export const renameGeneralTasks = async (token: string | undefined, generalTaskId: Number | undefined, newGeneralTaskName: string | undefined) => {
  try {
    const response = await api.put(`/api/generalTasks/${generalTaskId}`, { newGeneralTaskName }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};