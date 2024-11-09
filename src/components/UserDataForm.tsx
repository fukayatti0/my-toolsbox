// components/UserDataForm.tsx
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function UserDataForm() {
  const { data: session } = useSession()
  const [inputData, setInputData] = useState('')

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    const res = await fetch('/api/user-data')
    const data = await res.json()
    if (data) {
      setInputData(data)
    }
  }

  const saveData = async () => {
    await fetch('/api/user-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: inputData }),
    })
  }

  if (!session) return <div>Please sign in to use this feature.</div>

  return (
    <div>
      <input
        type="text"
        value={inputData}
        onChange={(e) => setInputData(e.target.value)}
        placeholder="Enter your data"
      />
      <button type="button" onClick={saveData}>Save Data</button>
    </div>
  )
}
