import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@renderer/shadcn/components/ui/resizable'
import { TooltipProvider } from '@renderer/shadcn/components/ui/tooltip'
import { Sidebar } from './sidebar'
import { useEffect, useState } from 'react'
import { cn } from '@renderer/shadcn/components/ui/utils'

import { Outlet } from 'react-router-dom'

function AdminPanelLayout(): JSX.Element {
  // const { userDataContext, logout } = useAuth()

  const defaultLayout = [255, 500]
  const defaultCollapsed = false

  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  useEffect(() => {
    if (window.api && typeof window.api.send === 'function') {
      window.api.send('fullscreen', null)
    }
  }, [])

  return (
    <div className="w-screen min-h-screen bg-orange-50 flex flex-col p-0 m-0">
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup direction="horizontal" className="h-full items-stretch">
          <ResizablePanel
            defaultSize={defaultLayout[0]}
            collapsedSize={4}
            collapsible={true}
            minSize={10}
            maxSize={15}
            onCollapse={() => {
              setIsCollapsed(true)
              localStorage.setItem('react-resizable-panels:collapsed', 'true')
            }}
            onExpand={() => {
              setIsCollapsed(false)
              localStorage.setItem('react-resizable-panels:collapsed', 'false')
            }}
            onAbort={() => {
              localStorage.setItem('react-resizable-panels:collapsed', `${isCollapsed}`)
            }}
            className={cn(isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out')}
          >
            <Sidebar isCollapsed={isCollapsed} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
            <Outlet />
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </div>
  )
}

export default AdminPanelLayout
