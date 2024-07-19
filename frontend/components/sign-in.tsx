// 'use client'

// import { useState, useEffect } from 'react';
// import { useGoogleOneTapLogin, useGoogleLogin, googleLogout } from '@react-oauth/google';
// import axios from 'axios';

// const GoogleSignInButton = () => {
//   const [user, setUser] = useState<{ name: string; email: string } | null>(null);

//   const handleLoginSuccess = async (response: any) => {
//     try {
//       let userInfo;
//       if (response.access_token) {
//         // Manual login
//         userInfo = await axios.get(
//           'https://www.googleapis.com/oauth2/v3/userinfo',
//           { headers: { Authorization: `Bearer ${response.access_token}` } }
//         );
//       } 
//     //   else if (response.credential) {
//     //     // One Tap login
//     //     userInfo = { data: JSON.parse(atob(response.credential.split('.')[1])) };
//     //   }

//       if (userInfo) {
//         console.log(userInfo.data);
//         setUser({
//           name: userInfo.data.name,
//           email: userInfo.data.email,
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching user info:', error);
//     }
//   };

//   const login = useGoogleLogin({
//     onSuccess: handleLoginSuccess,
//     onError: (error) => console.log('Manual Login Failed:', error)
//   });

// //   useGoogleOneTapLogin({
// //     onSuccess: handleLoginSuccess,
// //     onError: () => console.log('One Tap Login Failed'),
// //   });

//   const handleLogout = () => {
//     googleLogout();
//     setUser(null);
//   };

//   if (user) {
//     return (
//       <div className="text-center">
//         <h1 className="text-4xl font-bold mb-4">Welcome, {user.name}!</h1>
//         <p className="text-xl mb-4">Your email is: {user.email}</p>
//         <button
//           onClick={handleLogout}
//           className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Log out
//         </button>
//       </div>
//     );
//   }

//   return (
//     <button
//       onClick={() => login()}
//       className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//     >
//       Sign in with Google
//     </button>
//   );
// };

// export default GoogleSignInButton;

'use client'

import { useState, useEffect } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import axios from 'axios'

interface Email {
  id: string;
  subject?: string;
  from?: string;
  snippet?: string;
}

const GoogleSignInButton = () => {
  const { data: session } = useSession()
  const [emails, setEmails] = useState<Email[]>([])

  useEffect(() => {
    if (session) {
      fetchEmails()
    }
  }, [session])

  const fetchEmails = async () => {
    try {
      const response = await axios.get<Email[]>('/api/emails')
      setEmails(response.data)
    } catch (error) {
      console.error('Error fetching emails:', error)
    }
  }

  if (session && session.user) {
    return (
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome, {session.user.name}!</h1>
        <p className="text-xl mb-4">Your email is: {session.user.email}</p>
        <button
          onClick={() => signOut()}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Log out
        </button>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Recent Emails</h2>
          {emails.map((email) => (
            <div key={email.id} className="border p-4 mb-4 rounded">
              <h3 className="font-bold">{email.subject}</h3>
              <p>From: {email.from}</p>
              <p>{email.snippet}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => signIn('google')}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Sign in with Google
    </button>
  )
}

export default GoogleSignInButton