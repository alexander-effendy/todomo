import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getSubcategory = async (token: any, categoryId: any) => {
  // console.log('frontend trying to fetch subcategory');
  try {
    const response = await api.get(`/api/subcategories?categoryId=${categoryId}`, {
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

export const postSubcategory = async (token: any, subcategoryName: string, categoryId: Number | undefined) => {
  try {
    // console.log('frontend trying to add sub category');
    // console.log(subcategoryName, categoryId);
    const response = await api.post('/api/subcategories', { subcategoryName, categoryId }, {
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

export const deleteSubcategory = async (token: string | undefined, subcategoryId: Number | undefined) => {
  console.log('frontend deleting sub');
  try {
    const response = await api.delete(`/api/subcategories/${subcategoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    throw error;
  }
};


export const renameSubcategory = async (token: string | undefined, subcategoryId: Number | undefined, newSubcategoryName: string | undefined) => {
  try {
    const response = await api.put(`/api/subcategories/${subcategoryId}`, { newSubcategoryName }, {
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