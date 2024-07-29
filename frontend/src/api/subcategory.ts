import axios from 'axios';

export const getSubcategory = async (token: any, categoryId: any) => {
  console.log('frontend trying to fetch subcategory');
  try {
    const response = await axios.get(`http://localhost:3000/api/subcategories?categoryId=${categoryId}`, {
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
    console.log('frontend trying to add sub category');
    console.log(subcategoryName, categoryId);
    const response = await axios.post('http://localhost:3000/api/subcategories', { subcategoryName, categoryId }, {
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