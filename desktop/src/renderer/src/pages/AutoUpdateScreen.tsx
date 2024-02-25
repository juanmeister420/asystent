import { useAuth } from '@renderer/lib/authContext'
import { Progress } from '@renderer/shadcn/components/ui/progress'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const update_messages = {
  'checking-for-update': 'Sprawdzanie dostępności aktualizacji...',
  'update-available': 'Aktualizacja jest dostępna. Trwa pobieranie...',
  'update-not-available': 'Aplikacja jest aktualna. Trwa uruchamianie...',
  'update-downloaded': 'Aktualizacja pobrana, instalowanie...'
}

function AutoUpdateScreen(): JSX.Element {
  const [updateMessage, setUpdateMessage] = useState('...')
  const [progress, setProgress] = useState(0)
  const [showProgress, setShowProgress] = useState(false)
  const [updateRequestSent, setUpdateRequestSent] = useState(false)

  const navigate = useNavigate()
  const { userData } = useAuth()

  async function navigateAfterCheck() {
    if (userData) {
      navigate('/home', { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
  }

  const handleUpdateMessage = (message: string) => {
    switch (message) {
      case 'update-available':
        setUpdateMessage(update_messages[message])
        setShowProgress(true)
        break
      case 'update-not-available':
        setUpdateMessage(update_messages[message])
        setTimeout(async () => {
          // Send IPC message to resize window before navigating
          if (window.api && typeof window.api.send === 'function') {
            window.api.send('resize', { width: 1200, height: 900 }) // Adjust width and height as needed
          }
          navigateAfterCheck()
        }, 1500)
        break
      default:
        setUpdateMessage(update_messages[message] || message)
    }
  }

  const handleProgressUpdate = (progress: number) => {
    setProgress(progress)
  }

  function sendUpdateRequest() {
    if (updateRequestSent) return
    if (window.api && typeof window.api.send === 'function') {
      setUpdateRequestSent(true)

      window.api.send('auto-update-start', null)
    }
  }
  useEffect(() => {
    sendUpdateRequest()

    if (window.api && typeof window.api.receive === 'function') {
      window.api.receive('auto-update', handleUpdateMessage)
      window.api.receive('auto-update-progress', handleProgressUpdate)
    }

    return () => {
      if (window.api && typeof window.api.removeListener === 'function') {
        window.api.removeListener('auto-update', handleUpdateMessage)
        window.api.removeListener('auto-update-progress', handleProgressUpdate)
      }
    }
  }, [])

  return (
    <div className="w-screen h-screen bg-orange-50 flex text-center items-center">
      <div className="text-6xl font-semibold text-neutral-800 w-full flex flex-col gap-5">
        <p className="text-2xl font-thin text-orange-600">Firma Monkiewicz</p>
        <div className="">
          <span className="text-orange-600">m</span>Asystent
        </div>
        <p className="text-xl font-normal text-neutral-400">{updateMessage}</p>
        {showProgress && (
          <div className="w-1/3 mx-auto text-xl">
            <Progress
              className="w-full bg-transparent border-2 border-orange-600"
              value={progress}
            />
            <span className="text-neutral-400">{progress}%</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default AutoUpdateScreen
