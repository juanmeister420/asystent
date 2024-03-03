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
import { Card, CardContent, CardHeader, CardTitle } from '@renderer/shadcn/components/ui/card'

import {
  Archive,
  Database,
  DollarSign,
  MessageCircle,
  MessageSquare,
  Users,
  User,
  ThumbsUp,
  CheckCircle2,
  XCircle
} from 'lucide-react'
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

  if (window.api && typeof window.api.send === 'function') {
    window.api.send('fullscreen', null)
  }

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
            <div className="px-28 py-12 space-y-12">
              <h1 className="text-3xl font-semibold text-neutral-800">Statystyki Sprzedaży</h1>
              <div className="grid grid-cols-3 gap-x-24 gap-y-24">
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
                <StatCard
                  title="Transakcje"
                  data="100000"
                  icon={<DollarSign className="h-4 w-4 text-orange-600" />}
                />
              </div>
            </div>
            <div className="px-28 space-y-12">
              <h1 className="text-3xl font-semibold text-neutral-800">Statystyki Ogólne</h1>
              <div className="grid grid-cols-3 gap-x-24 gap-y-24">
                {/* Card 1 */}
                <Card className="rounded-2xl shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
                    <CardTitle className="text-xl font-medium text-orange-600 underline">
                      Firma Monkiewicz Agnieszka Monkiewicz
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-base text-neutral-400 mt-4">Dołączono 13.02.2024r.</div>
                    <div className="flex w-full justify-between flex-row mt-4 text-neutral-600 font-bold ">
                      <div className="flex flex-row items-center gap-2">
                        <Users /> 123 sklepy
                      </div>
                      <div className="flex flex-row items-center gap-2">
                        <DollarSign /> 123,456zł / miesiąc
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Card 2 */}
                <Card className="rounded-2xl shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
                    <CardTitle className="text-xl font-medium text-neutral-800 ">
                      Jak zmienić nagłówek?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-base text-neutral-400 mt-4">
                      Najczęsciej zadawane pytanie
                    </div>
                    <div className="flex w-full justify-between flex-row mt-4 text-neutral-600 font-bold ">
                      <div className="flex flex-row items-center gap-2">
                        <Users /> 123456
                      </div>
                      <div className="flex flex-row items-center gap-2">
                        <ThumbsUp /> 123
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Card 3 */}
                <Card className="rounded-2xl shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
                    <CardTitle className="text-xl font-medium text-neutral-800 ">
                      Rozwiązane Problemy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-base text-neutral-400 mt-4">
                      Aby zobaczyć, które problemy nie zostały rozwiązane,{' '}
                      <a className="underline text-neutral-600">KLIKNIJ TUTAJ</a>
                    </div>
                    <div className="flex w-full justify-between flex-row mt-4 font-bold ">
                      <div className="flex flex-row items-center gap-2 text-green-600">
                        <CheckCircle2 /> 12345667
                      </div>
                      <div className="flex flex-row items-center gap-2 text-red-600">
                        <XCircle /> 123
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </div>
  )
}

export default AdminPanel
