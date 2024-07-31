import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getCategory = async (token: any, userEmail: any) => {
  try {
    const response = await api.get(`/api/categories?email=${userEmail}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    alert('error during fetchign catefgory')
    console.error('Error during fetching categories:', error);
  }
}

export const postCategory = async (token: any, name: string, userEmail: string | null) => {
  
  try {
    const response = await api.post('/api/categories', { name, userEmail }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log('Category added', response.data);
    return response.data;
  } catch (error) {
    alert('error during adding category: ' + error);
    console.error('Error during adding category:', error);
  }
}

export const deleteCategory = async (token: string | undefined, categoryId: Number | undefined) => {
  console.log('frontend trying to delete category');
  console.log(categoryId);
  console.log(token);
  try {
    const response = await api.delete(`/api/categories/${categoryId}`, {
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

export const renameCategory = async (token: string | undefined, categoryId: Number | undefined, newCategoryName: string | undefined) => {
  console.log('frontend trying to rename category');
  console.log(categoryId);
  console.log(token);
  try {
    const response = await api.put(`/api/categories/${categoryId}`, { newCategoryName }, {
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