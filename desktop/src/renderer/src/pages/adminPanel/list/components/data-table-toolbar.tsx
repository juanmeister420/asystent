import { Cross } from 'lucide-react'
import { Table } from '@tanstack/react-table'

import { Button } from '@renderer/shadcn/components/ui/button'
import { Input } from '@renderer/shadcn/components/ui/input'
import { DataTableViewOptions } from './data-table-view-options'

import { statusy } from './data'
import { DataTableFacetedFilter } from './data-table-faceted-filter'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Wyszukaj po NIP..."
          value={(table.getColumn('nip')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            console.log(table.getColumn('nip'))
            table.getColumn('nip')?.setFilterValue(event.target.value)
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Status"
            options={statusy}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
