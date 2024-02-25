import { useAuth } from '@renderer/lib/authContext'

function HomeScreen(): JSX.Element {
  const { userData } = useAuth()
  return (
    <div className="w-screen h-screen bg-orange-50 flex text-center items-center">
      <div className="text-6xl font-semibold text-neutral-800 w-full flex flex-col gap-5">
        <div className="">
          <span className="text-orange-600">m</span>Asystent - Strona Główna
          {userData && (
            <p className="text-xl font-normal text-neutral-400">Witaj, {userData.email}!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomeScreen
