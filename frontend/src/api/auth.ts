import axios from 'axios';  // Ensure axios is imported correctlyimport { kinde } from 'kinde-sdk';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';

const {getToken} = useKindeAuth();

export const handleSignUp = async () => {
  console.log("frontend sign up api route being called")
  try {
    // Get token from Kinde
    const { getToken } = useKindeAuth();
    const token = await getToken();
    console.log('tokennnn is: ', token);

    // Send token to backend
    const response = await axios.post('http://localhost:3000/api/auth', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Handle the response
    console.log('User authenticated and added to the database:', response.data);
  } catch (error) {
    // Handle errors
    console.error('Error during signing up:', error);
  }
}