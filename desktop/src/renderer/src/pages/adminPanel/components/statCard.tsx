import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@renderer/shadcn/components/ui/card'
import { DollarSign } from 'lucide-react'

type StatCardProps = {
  title: string
  data: string
  icon: ReactNode
  details?: ReactNode
}

export default function statCard(props: StatCardProps) {
  const { title, data, icon, details } = props
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
        <CardTitle className="text-lg font-medium text-neutral-600">{title}</CardTitle>
        <div className="h-10 w-10 rounded-full bg-orange-200 items-center justify-center flex">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-neutral-800">{data}</div>
        {details && <div className="text-sm text-neutral-400 mt-4">{details}</div>}
      </CardContent>
    </Card>
  )
}