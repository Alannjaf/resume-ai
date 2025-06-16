import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/admin'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

// Force dynamic rendering since this uses auth
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const admin = await isAdmin()
  
  if (!admin) {
    redirect('/dashboard')
  }

  return <AdminDashboard />
}