import { Button } from '@/components/ui/button'
import { useState } from 'react'

const Counter = () => {
  const [count, setCount] = useState(0)
  const increment = () => setCount(count + 1)
  const decrement = () => setCount(0)

  const testAPI = async () => {
    try {
      const data = await fetch(
        'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json'
      )
      const res = await data.json()
      console.log('yooooooooooooo', data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className={`p-2 flex flex-col gap-2 ${count >= 108 ? 'bg-green-900' : 'bg-black'} h-screen`} >
      <p className='text-2xl w-[118px] border border-gray-500 rounded bg-gray-800 text-white text-center'>
        {count}
      </p>
      <div className='space-x-2'>
        <Button onClick={increment} className='border border-green-600'>
          +
        </Button>
        <Button
          onClick={decrement}
          variant='destructive'
          className='border border-red-300'
        >
          Reset
        </Button>
      </div>
      <Button onClick={testAPI} className='border w-30 bg-blue-600 hover:bg-blue-700 border-blue-700'>
        Test API
      </Button>
    </div>
  )
}

export default Counter
