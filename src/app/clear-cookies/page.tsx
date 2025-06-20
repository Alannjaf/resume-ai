'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ClearCookiesPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Clear localStorage and sessionStorage
    localStorage.clear()
    sessionStorage.clear()
    
    // Redirect to home
    setTimeout(() => {
      router.push('/')
    }, 1000)
  }, [router])
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Clearing session data...</h1>
        <p>You will be redirected to the home page.</p>
      </div>
    </div>
  )
}