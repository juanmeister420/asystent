import instance from '@renderer/lib/axios'
import { useEffect, useState } from 'react'

import { DataTable } from './components/data-table'
import { columns } from './components/columns'

interface SerwisListProps {
  id: string
  company_name: string
  nip: number
  phone_number: string
  email: string
  status: 'active' | 'pending' | 'blocked'
  total_shop: number
}

function AdminPanel(): JSX.Element {
  const [data, setData] = useState<SerwisListProps[]>([])
  const [error, setError] = useState({
    status: false,
    message: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (!loading) return

      try {
        setError({
          status: false,
          message: ''
        })
        const response = await instance.get('/serwisy/list')
        await response.data.map((item: any) => {
          setData((prev) => [
            ...prev,
            {
              id: item.id,
              company_name: item.company,
              nip: item.nip,
              phone_number: item.phone,
              email: item.email,
              status: item.status,
              total_shop: item.total_shop
            }
          ])
        })
        await setLoading(false)
      } catch (error: any) {
        setError({
          status: true,
          message: error.message
        })
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="grid grid-cols-12 px-24 py-12 ">
      <div className="col-span-12">
        <h1 className="text-3xl font-bold">Lista serwisów</h1>
      </div>
      <div className="col-span-12">
        {error.status && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">{error.message}</span>
          </div>
        )}
      </div>
      <div className="col-span-12">
        {loading && <p>Ładowanie...</p>}
        {!loading && data.length === 0 && <p>Brak danych do wyświetlenia.</p>}
        {!loading && data.length > 0 && <DataTable data={data} columns={columns} />}
      </div>
    </div>
  )
}

export default AdminPanel
