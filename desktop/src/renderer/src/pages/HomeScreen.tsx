import { useAuth } from '@renderer/lib/authContext'

function HomeScreen(): JSX.Element {
  const { userDataContext, logout } = useAuth()
  return (
    <div className="w-screen h-screen bg-orange-50 flex text-center items-center">
      <div className="text-6xl font-semibold text-neutral-800 w-full flex flex-col gap-5">
        <div className="">
          <span className="text-orange-600">m</span>Asystent - Strona Główna
          <p className="text-xl font-normal text-neutral-400">Witaj, {userDataContext?.email}!</p>
          <button
            className="bg-orange-600 text-white px-3 py-2 rounded-md text-lg"
            onClick={() => logout()}
          >
            Wyloguj
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomeScreen
