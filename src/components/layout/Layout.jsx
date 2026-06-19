import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout({ onNewLead, leads, stages }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar onNewLead={onNewLead} leads={leads} stages={stages} />
      <main className="flex-1 ml-[260px] min-h-screen">
        <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
