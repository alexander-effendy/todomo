import axios from 'axios';  // Ensure axios is imported correctlyimport { kinde } from 'kinde-sdk';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';

// Create an axios instance with the base URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const handleSignUp = async () => {
    try {
    // Get token from Kinde
    const { getToken, user } = useKindeAuth();
    const token = await getToken();

    console.log('user is: ', user);


    // Send token to backend
    await api.post('/api/auth', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Handle the response
    // alert(`user added to database!` + response.data);
  } catch (error) {
    // Handle errors
    // alert('error during signing up');
    console.error('Error during signing up:', error);
  }
}