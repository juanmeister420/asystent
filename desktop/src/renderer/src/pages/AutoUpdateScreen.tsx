import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@renderer/lib/authContext'
import instance from '@renderer/lib/axios'
import { Progress } from '@renderer/shadcn/components/ui/progress'
import { Loader } from 'lucide-react'
import { Button } from '@renderer/shadcn/components/ui/button'
import getRedirectPathFromRole from '@renderer/utils/getRedirectPathFromRole'

const updateMessages = {
  'checking-for-update': 'Sprawdzanie dostępności aktualizacji...',
  'update-available': 'Aktualizacja jest dostępna. Trwa pobieranie...',
  'update-not-available': 'Aplikacja jest aktualna. Trwa uruchamianie...',
  'update-downloaded': 'Aktualizacja pobrana, instalowanie...'
}

function AutoUpdateScreen() {
  const { setUserDataContext } = useAuth()
  const [updateMessage, setUpdateMessage] = useState('...')
  const [progress, setProgress] = useState(0)
  const [showProgress, setShowProgress] = useState(false)
  const [updateRequestSent, setUpdateRequestSent] = useState(false)
  const [updateComplete, setUpdateComplete] = useState(false)
  const [authLoaded, setAuthLoaded] = useState(false)
  const [authError, setAuthError] = useState({
    status: false,
    message: ''
  })

  const navigate = useNavigate()

  async function fetchUserInfo() {
    setAuthLoaded(false)
    setAuthError({ status: false, message: '' })

    try {
      const token = localStorage.getItem('token')
      if (!token) return navigate('/login', { replace: true, state: { verification_error: true } })

      const response = await instance.get('/auth/verify')
      if (response.status !== 200) throw new Error('Verification failed')

      setUserDataContext(response.data.user)
      const path = getRedirectPathFromRole(response.data.user.role)
      navigate(path, { replace: true })
    } catch (error) {
      console.error('Error fetching user info', error)
      localStorage.removeItem('token')

      setAuthError({
        status: true,
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setAuthLoaded(true)
    }
  }

  const handleUpdateMessage = (message) => {
    setUpdateMessage(updateMessages[message] || message)
    if (message === 'update-available') setShowProgress(true)
    else if (message === 'update-not-available') {
      if (window.api && typeof window.api.send === 'function') {
        window.api.send('resize', { width: 1200, height: 900 })
      }

      setUpdateComplete(true)

      fetchUserInfo()
    }
  }

  useEffect(() => {
    async function sendUpdateRequest() {
      if (!updateRequestSent && window.api?.send) {
        window.api.send('auto-update-start', Date.now())
        setUpdateRequestSent(true)
      }
    }

    sendUpdateRequest()

    if (window.api?.receive) {
      window.api.receive('auto-update', handleUpdateMessage)
      window.api.receive('auto-update-progress', (progress) => {
        setProgress(progress)
      })
    }

    return () => {
      if (window.api?.removeListener) {
        window.api.removeListener('auto-update', handleUpdateMessage)
        window.api.removeListener('auto-update-progress', () => {})
      }
    }
  }, [updateRequestSent]) // Include updateRequestSent in the dependency array if its changes should trigger the effect

  return (
    <>
      {!updateComplete && (
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
      )}
      {updateComplete && (
        <>
          {!authLoaded ? (
            <div className="flex items-center justify-center h-screen text-orange-600 bg-orange-50">
              <Loader size={48} className="animate-spin" />
            </div>
          ) : (
            <>
              {authError.status && (
                <div className="flex items-center justify-center h-screen text-orange-600 bg-orange-50 flex-col gap-4">
                  <p className="text-xl font-semibold">Wystąpił błąd podczas ładowania aplikacji</p>
                  <p>{authError.message}</p>

                  <Button onClick={fetchUserInfo} className="bg-orange-600 text-white">
                    Spróbuj ponownie
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  )
}

// Consider extracting components such as LoaderScreen and ErrorScreen for better readability and separation of concerns

export default AutoUpdateScreen
