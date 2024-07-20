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














// 'use client'

// import { useState, useEffect } from 'react'
// import { signIn, signOut, useSession } from 'next-auth/react'
// import axios from 'axios'

// interface Email {
//   id: string;
//   subject?: string;
//   from?: string;
//   snippet?: string;
// }

// const GoogleSignInButton = () => {
//   const { data: session } = useSession()
//   const [emails, setEmails] = useState<Email[]>([])

//   useEffect(() => {
//     if (session) {
//       fetchEmails()
//     }
//   }, [session])

//   const fetchEmails = async () => {
//     try {
//       const response = await axios.get<Email[]>('/api/emails')
//       setEmails(response.data)
//     } catch (error) {
//       console.error('Error fetching emails:', error)
//     }
//   }

//   if (session && session.user) {
//     return (
//       <div className="text-center">
//         <h1 className="text-4xl font-bold mb-4">Welcome, {session.user.name}!</h1>
//         <p className="text-xl mb-4">Your email is: {session.user.email}</p>
//         <button
//           onClick={() => signOut()}
//           className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Log out
//         </button>
//         <div className="mt-8">
//           <h2 className="text-2xl font-bold mb-4">Your Recent Emails</h2>
//           {emails.map((email) => (
//             <div key={email.id} className="border p-4 mb-4 rounded">
//               <h3 className="font-bold">{email.subject}</h3>
//               <p>From: {email.from}</p>
//               <p>{email.snippet}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     )
//   }

//   return (
//     <button
//       onClick={() => signIn('google')}
//       className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//     >
//       Sign in with Google
//     </button>
//   )
// }

// export default GoogleSignInButton










'use client'

import { useState, useEffect } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import axios from 'axios'

interface Email {
  id: string;
  subject?: string;
  from?: string;
  snippet?: string;
  category?: string;
}

const GoogleSignInButton = () => {
  const { data: session } = useSession()
  const [emails, setEmails] = useState<Email[]>([])
  const [openaiKey, setOpenaiKey] = useState('')
  const [isClassifying, setIsClassifying] = useState(false)

  useEffect(() => {
    const storedKey = localStorage.getItem('openaiKey')
    if (storedKey) setOpenaiKey(storedKey)
    
    if (session) {
      console.log("Session found, fetching emails")
      fetchEmails()
    }
  }, [session])

  const fetchEmails = async () => {
    try {
      console.log("Fetching emails from API")
      const response = await axios.get<Email[]>('/api/emails')
      console.log("Emails fetched:", response.data)
      setEmails(response.data)
      localStorage.setItem('emails', JSON.stringify(response.data))
    } catch (error) {
      console.error('Error fetching emails:', error)
    }
  }

  const handleOpenAIKeySubmit = () => {
    console.log("Saving OpenAI key to localStorage")
    localStorage.setItem('openaiKey', openaiKey)
  }

  const classifyEmails = async () => {
    setIsClassifying(true)
    try {
      console.log("Starting email classification")
      console.log("Emails to classify:", emails)
      console.log("OpenAI Key:", openaiKey)
      const response = await axios.post('/api/classify-emails', 
        { emails },
        { headers: { 'X-OpenAI-Key': openaiKey } }
      )
      console.log("Classification response:", response.data)
      setEmails(response.data)
      localStorage.setItem('emails', JSON.stringify(response.data))
    } catch (error) {
      console.error('Error classifying emails:', error)
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data)
      }
    } finally {
      setIsClassifying(false)
    }
  }

  if (session && session.user) {
    return (
      <div className="text-center">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Welcome, {session.user.name}!</h1>
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Log out
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={openaiKey}
            onChange={(e) => setOpenaiKey(e.target.value)}
            placeholder="Enter OpenAI API Key"
            className="mr-2 p-2 border rounded"
          />
          <button
            onClick={handleOpenAIKeySubmit}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Save Key
          </button>
        </div>
        <button
          onClick={classifyEmails}
          disabled={isClassifying}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 ${isClassifying ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isClassifying ? 'Classifying...' : 'Classify Emails'}
        </button>
        <div className="grid grid-cols-1 gap-4">
          {emails.map((email) => (
            <div key={email.id} className="border p-4 rounded">
              <h3 className="font-bold">{email.subject}</h3>
              <p>From: {email.from}</p>
              <p>{email.snippet}</p>
              <p className="mt-2">Category: {email.category || 'Unclassified'}</p>
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
      Login with Google
    </button>
  )
}

export default GoogleSignInButton