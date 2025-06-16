import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/admin'
import { UserManagement } from '@/components/admin/UserManagement'

// Force dynamic rendering since this uses auth
export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const admin = await isAdmin()
  
  if (!admin) {
    redirect('/dashboard')
  }

  return <UserManagement />
}