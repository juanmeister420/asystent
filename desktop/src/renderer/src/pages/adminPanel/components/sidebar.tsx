import { Tooltip, TooltipContent, TooltipTrigger } from '@renderer/shadcn/components/ui/tooltip'
import { Link } from 'react-router-dom'
import { cn } from '@renderer/shadcn/components/ui/utils'
import { buttonVariants } from '@renderer/shadcn/components/ui/button'
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  LucideIcon,
  MessagesSquare,
  PenBox,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2
} from 'lucide-react'
import { Separator } from '@renderer/shadcn/components/ui/separator'
import { useAuth } from '@renderer/lib/authContext'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@renderer/shadcn/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@renderer/shadcn/components/ui/avatar'

interface SidebarLinks {
  title: string
  label: string
  icon: LucideIcon
  variant: 'default' | 'ghost'
}

type SidebarLink = SidebarLinks[]

const links: SidebarLink = [
  {
    title: 'Strona Główna',
    label: '',
    icon: Inbox,
    variant: 'default'
  },
  {
    title: 'Dodaj Serwis',
    label: '',
    icon: File,
    variant: 'ghost'
  },
  {
    title: 'Lista Serwisów',
    label: '',
    icon: Send,
    variant: 'ghost'
  },
  {
    title: 'Dodaj Pytanie',
    label: '',
    icon: ArchiveX,
    variant: 'ghost'
  },
  {
    title: 'Baza Pytań',
    label: '',
    icon: Trash2,
    variant: 'ghost'
  },
  {
    title: 'Statystyki',
    label: '',
    icon: Archive,
    variant: 'ghost'
  }
]

export function Sidebar({ isCollapsed }) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2 "
    >
      <div
        className={cn(
          'flex h-[52px] items-center justify-center',
          isCollapsed ? 'h-[52px]' : 'px-2'
        )}
      >
        <h1 className="text-2xl font-bold text-orange-600">
          m<span className="text-neutral-800">{isCollapsed ? 'A' : 'Asystent'}</span>
        </h1>
      </div>
      <Separator />

      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  to="#"
                  className={cn(
                    buttonVariants({ variant: link.variant, size: 'icon' }),
                    'h-9 w-9',
                    link.variant === 'default' &&
                      'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && <span className="ml-auto text-muted-foreground">{link.label}</span>}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              to="#"
              className={cn(
                buttonVariants({ variant: link.variant, size: 'sm' }),
                link.variant === 'default' &&
                  'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
                'justify-start'
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    'ml-auto',
                    link.variant === 'default' && 'text-background dark:text-white'
                  )}
                >
                  {link.label}
                </span>
              )}
            </Link>
          )
        )}
      </nav>

      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Moje Konto</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Ustawienia</DropdownMenuItem>
          <DropdownMenuItem>Wyloguj</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </div>
  )
}
