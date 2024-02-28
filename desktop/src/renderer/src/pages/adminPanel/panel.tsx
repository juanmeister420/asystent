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

function AdminPanel(): JSX.Element {
  const { userDataContext, logout } = useAuth()

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
            minSize={15}
            maxSize={20}
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
            <div className="flex flex-col items-center justify-center h-full">
              <h1 className="text-4xl font-bold">Admin Panel</h1>
              <p className="text-2xl">Welcome, {userDataContext?.email}</p>
              <button onClick={logout} className="mt-4 bg-primary text-white px-4 py-2 rounded-md">
                Logout
              </button>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </div>
  )
}

export default AdminPanel
