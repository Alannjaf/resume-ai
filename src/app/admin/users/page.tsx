import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/admin'
import { UserManagement } from '@/components/admin/UserManagement'

export default async function AdminUsersPage() {
  const admin = await isAdmin()
  
  if (!admin) {
    redirect('/dashboard')
  }

  return <UserManagement />
}