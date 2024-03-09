import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from 'lucide-react'

export const statusy = [
  {
    label: 'Active',
    value: 'active',
    icon: ArrowDownIcon
  },
  {
    label: 'Czeka',
    value: 'pending',
    icon: ArrowRightIcon
  },
  {
    label: 'Blocked',
    value: 'blocked',
    icon: ArrowUpIcon
  }
]

export interface SerwisListProps {
  id: string
  company_name: string
  nip: number
  phone_number: string
  email: string
  status: 'active' | 'pending' | 'blocked'
  total_shop: number
}
