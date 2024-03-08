import { Inbox } from 'lucide-react'
import StatCard from './components/statCard'

function AdminPanelHome(): JSX.Element {
  return (
    <div className="grid grid-cols-12 md:px-4 md:py-2 lg:px-8 lg:py-4 xl:px-16 xl:py-8 gap-4 h-auto">
      <div className="xl:col-span-4 lg:col-span-6 md:col-span-12">
        <StatCard
          title="Total Users"
          value="1,200"
          icon={<Inbox className="text-blue-600" />}
          color="bg-blue-200"
          footer="Updated 3 minutes ago"
        />
      </div>
      <div className="xl:col-span-4 lg:col-span-6 md:col-span-12">
        <div className="bg-red-400 text-2xl">2</div>
      </div>
      <div className="xl:col-span-4 lg:col-span-6 md:col-span-12">
        <div className="bg-blue-400 text-2xl">3</div>
      </div>
    </div>
  )
}

export default AdminPanelHome
