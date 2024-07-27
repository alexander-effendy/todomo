import axios from 'axios';

export const getCategory = async (token: any, userEmail: any) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/categories?email=${userEmail}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Categories retrieved:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during fetching categories:', error);
  }
}

export const postCategory = async (token: any, name: string, userEmail: string | null) => {
  try {
    console.log('ding ding')
    const response = await axios.post('http://localhost:3000/api/categories', { name, userEmail }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Category added', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during adding category:', error);
  }
}
