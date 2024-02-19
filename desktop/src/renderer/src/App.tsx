import { useState, useEffect } from 'react'
import { Button } from '@renderer/shadcn/components/ui/button'

function App(): JSX.Element {
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  return (
    <>
      <h1 className="text-3xl font-bold underline text-green-600">
        width: {width} height: {height}
      </h1>
      <Button variant="default">Primary</Button>
    </>
  )
}

export default App
