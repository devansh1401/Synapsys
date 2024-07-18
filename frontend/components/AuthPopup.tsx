'use client'

import { useEffect } from 'react'
import { signIn, useSession } from "next-auth/react"

export default function AuthPopup() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn('google')
    }
  }, [status])

  if (session) {
    return (
      <div className="fixed top-5 right-5 bg-white p-4 rounded shadow">
        <p>Logged in as: {session.user?.name}</p>
        <p>Email: {session.user?.email}</p>
      </div>
    )
  }

  return null
}