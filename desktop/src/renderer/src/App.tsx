import { useEffect, useState } from 'react'

function App(): JSX.Element {
  const [updateMessage, setUpdateMessage] = useState('...')

  useEffect(() => {
    // Define a handler for update messages
    const handleUpdateMessage = (message: string) => {
      setUpdateMessage(message)
    }

    // Check if the api object is available on window and has a receive method
    if (window.api && typeof window.api.receive === 'function') {
      window.api.receive('auto-update', handleUpdateMessage)
    }

    // Cleanup listener on component unmount
    return () => {
      // Assuming you have a method to remove listeners in your preload script
      if (window.api && typeof window.api.removeListener === 'function') {
        window.api.removeListener('auto-update', handleUpdateMessage)
      }
    }
  }, [])

  return (
    <div className="w-screen h-screen bg-orange-50 flex text-center items-center">
      <div className="text-6xl font-semibold text-neutral-800 w-full flex flex-col gap-5">
        <p className="text-2xl font-thin text-orange-600">Firma Monkiewicz 🛒 (New Update 1.0.3)</p>
        <div className="">
          <span className="text-orange-600">m</span>Asystent
        </div>
        <p className="text-xl font-normal text-neutral-800">{updateMessage}</p>
      </div>
    </div>
  )
}

export default App
