'use client'

import { useState, useEffect } from 'react';
import { useGoogleOneTapLogin, useGoogleLogin, googleLogout } from '@react-oauth/google';
import axios from 'axios';

const GoogleSignInButton = () => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const handleLoginSuccess = async (response: any) => {
    try {
      let userInfo;
      if (response.access_token) {
        // Manual login
        userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${response.access_token}` } }
        );
      } 
    //   else if (response.credential) {
    //     // One Tap login
    //     userInfo = { data: JSON.parse(atob(response.credential.split('.')[1])) };
    //   }

      if (userInfo) {
        console.log(userInfo.data);
        setUser({
          name: userInfo.data.name,
          email: userInfo.data.email,
        });
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    onError: (error) => console.log('Manual Login Failed:', error)
  });

//   useGoogleOneTapLogin({
//     onSuccess: handleLoginSuccess,
//     onError: () => console.log('One Tap Login Failed'),
//   });

  const handleLogout = () => {
    googleLogout();
    setUser(null);
  };

  if (user) {
    return (
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome, {user.name}!</h1>
        <p className="text-xl mb-4">Your email is: {user.email}</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => login()}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Sign in with Google
    </button>
  );
};

export default GoogleSignInButton;