import { useAuth } from '@renderer/lib/authContext'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@renderer/shadcn/components/ui/resizable'
import { TooltipProvider } from '@renderer/shadcn/components/ui/tooltip'
import { Sidebar } from './components/sidebar'
import { useState } from 'react'
import { cn } from '@renderer/shadcn/components/ui/utils'

import { Archive, Database, DollarSign, MessageCircle, MessageSquare, User } from 'lucide-react'
import StatCard from './components/statCard'

function AdminPanel(): JSX.Element {
  // const { userDataContext, logout } = useAuth()

  function getCookieValue(a: string) {
    const b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)')
    return b ? b.pop() : ''
  }

  const layout = getCookieValue('react-resizable-panels:layout')
  const collapsed = getCookieValue('react-resizable-panels:collapsed')

  const defaultLayout = layout ? JSON.parse(layout) : [255, 500]
  const defaultCollapsed = collapsed ? JSON.parse(collapsed) : false

  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  return (
    <div className="w-screen h-screen bg-orange-50 flex flex-col">
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup
          direction="horizontal"
          onLayout={(sizes: number[]) => {
            document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`
          }}
          className="h-full items-stretch"
        >
          <ResizablePanel
            defaultSize={defaultLayout[0]}
            collapsedSize={4}
            collapsible={true}
            minSize={10}
            maxSize={15}
            onCollapse={() => {
              setIsCollapsed(true)
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`
            }}
            onExpand={() => {
              setIsCollapsed(false)
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`
            }}
            className={cn(isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out')}
          >
            <Sidebar isCollapsed={isCollapsed} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
            <div className="w-full h-full p-12 space-y-12">
              <h1 className="text-2xl font-semibold text-neutral-800">Statystyki</h1>
              <div className="grid grid-cols-3 gap-12 gap-y-24">
                <StatCard
                  title="Użytkownicy"
                  data="12"
                  icon={<User className="h-4 w-4 text-orange-600" />}
                  details="Wszyscy użytkownicy"
                />
                <StatCard
                  title="Serwisy"
                  data="5"
                  icon={<Database className="h-4 w-4 text-orange-600" />}
                  details="Wszystkie serwisy"
                />
                <StatCard
                  title="Pytania"
                  data="100"
                  icon={<Archive className="h-4 w-4 text-orange-600" />}
                  details="Wszystkie pytania"
                />
                <StatCard
                  title="Odpowiedzi"
                  data="1000"
                  icon={<MessageSquare className="h-4 w-4 text-orange-600" />}
                  details="Wszystkie odpowiedzi"
                />
                <StatCard
                  title="Komentarze"
                  data="10000"
                  icon={<MessageCircle className="h-4 w-4 text-orange-600" />}
                  details="Wszystkie komentarze"
                />
                <StatCard title="Transakcje" data="100000" icon={<DollarSign />} />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </div>
  )
}

export default AdminPanel
