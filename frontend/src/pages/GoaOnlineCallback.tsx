import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const GoaOnlineCallback = () => {
  const navigate     = useNavigate()
  const hasProcessed = useRef(false) // ← same pattern as UDPRedirection

  useEffect(() => {
    if (hasProcessed.current) return
    hasProcessed.current = true

    console.log("full url =", window.location.href)

    const params = new URLSearchParams(window.location.search)
    const code   = params.get('code')
    const error  = params.get('error')


    // if (error === 'access_denied') {
    //   navigate('/login?error=cancelled')
    //   return
    // }

    // if (!code) {
    //   navigate('/login?error=missing_code')
    //   return
    // }else{

    // }
    console.log("Goa online Token",code);

    console.log('code received:', code)
    navigate('/updateprofile')
  }, [])

  return (
    <div className='w-full flex items-center justify-center h-screen'>
      <p className='text-muted-foreground'>Completing login...</p>
    </div>
  )
}

export default GoaOnlineCallback