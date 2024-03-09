import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@renderer/shadcn/components/ui/badge'
import { Checkbox } from '@renderer/shadcn/components/ui/checkbox'

import { statusy } from './data'
import { SerwisListProps } from './data'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<SerwisListProps>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: true
  },
  {
    accessorKey: 'company_name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nazwa Firmy" />,
    cell: ({ row }) => <div className="w-[120px]">{row.getValue('company_name')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue('status')
      const statusLabel = statusy.find((s) => s.value === status)?.label ?? statusy[0].label

      return <Badge variant="outline">{statusLabel}</Badge>
    },
    enableSorting: false,
    enableHiding: true
  },
  {
    accessorKey: 'nip',
    header: ({ column }) => <DataTableColumnHeader column={column} title="NIP" />,
    cell: ({ row }) => <div className="w-[120px] font-bold">{row.getValue('nip')}</div>,
    enableSorting: false,
    enableHiding: false

    // Create a filter function
    // filterFn: (rows, id, value) => {

    // }
  },

  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <div className="w-[120px]">{row.getValue('email')}</div>,
    enableSorting: false,
    enableHiding: true
  },
  {
    accessorKey: 'phone_number',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Telefon" />,
    cell: ({ row }) => <div className="w-[120px]">{row.getValue('phone_number')}</div>,
    enableSorting: false,
    enableHiding: true
  },

  {
    accessorKey: 'total_shop',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Liczba Sklepów" />,
    cell: ({ row }) => (
      <div className="w-[50px] font-bold text-orange-600">{row.getValue('total_shop')}</div>
    ),
    enableSorting: true,
    enableHiding: true
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
]
