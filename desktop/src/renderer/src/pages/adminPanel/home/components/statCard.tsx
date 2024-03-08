import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@renderer/shadcn/components/ui/card'

export default function StatCard({
  title,
  value,
  icon,
  color,
  footer
}: {
  title: string
  value: string
  icon: React.ReactNode
  color: string
  footer: string
}) {
  return (
    <Card className="flex flex-col items-center justify-center">
      <CardHeader className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100">
        <div className="text-3xl text-gray-500">{icon}</div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <CardTitle className="text-2xl font-bold">{value}</CardTitle>
        <CardDescription className="text-sm text-gray-500">{title}</CardDescription>
      </CardContent>
      <CardFooter className="text-sm text-gray-500">{footer}</CardFooter>
    </Card>
  )
}
