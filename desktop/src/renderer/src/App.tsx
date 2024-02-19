import { useEffect, useState } from 'react'

function App(): JSX.Element {
  const [updateMessage, setUpdateMessage] = useState('Sprawdzanie aktualizacji...')

  return (
    <div className="w-screen h-screen bg-orange-50 flex text-center items-center">
      <div className="text-6xl font-semibold text-neutral-800 w-full flex flex-col gap-5">
        <div className="">
          <span className="text-orange-600">m</span>Asystent
        </div>
        <p className="text-xl font-normal text-neutral-800">{updateMessage}</p>
      </div>
    </div>
  )
}

export default App
