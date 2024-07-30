import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getTasks = async (token: any, categoryId: any) => {
  try {
    const response = await api.get(`/api/tasks?categoryId=${categoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error during fetching categories:', error);
  }
}

export const postTasks = async (token: any, taskName: string, taskStatus: boolean, taskDescription:string, subcategoryId: Number | undefined, categoryId: Number | undefined) => {
  try {
    const response = await api.post('/api/tasks', { taskName, taskStatus, taskDescription, subcategoryId, categoryId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error during adding task:', error);
  }
}