import type { Metadata } from 'next'
import AdminLayoutClient from '../admin/AdminLayoutClient'

export const metadata: Metadata = {
  title: 'Admin Panel',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}