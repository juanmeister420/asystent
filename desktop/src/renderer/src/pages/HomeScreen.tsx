import instance from '@renderer/lib/axios'
import { useEffect, useState } from 'react'

function HomeScreen(): JSX.Element {
  return (
    <div className="w-screen h-screen bg-orange-50 flex text-center items-center">
      <div className="text-6xl font-semibold text-neutral-800 w-full flex flex-col gap-5">
        <div className="">
          <span className="text-orange-600">m</span>Asystent - Strona Główna
        </div>
      </div>
    </div>
  )
}

export default HomeScreen
