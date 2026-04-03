import { getDocuments } from '@/services/api/documentApis'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authLoginActions } from "@/store/authSlice"
import { logoutHandler } from '@/services/api'
import { useMutation } from '@tanstack/react-query'
import type { IAuthentication } from '@/models/IStore'

const Workspace = () => {
  const [documents, setDocuments] = useState([])
  const dispatch = useDispatch()
  const refreshToken = useSelector((state: { authLogin: IAuthentication }) => state.authLogin.refreshToken)

  const { mutate, isPending } = useMutation({
    mutationFn: logoutHandler,
    onSuccess: () => {
      dispatch(authLoginActions.logout())
      window.location.href = '/login'
    },
  })

  useEffect(() => {
    const fetchDocuments = async () => {
      const docs = await getDocuments()
      console.log(docs.documents)
      setDocuments(docs.documents)
    }
    fetchDocuments()
  }, [])

  const logout = () => {
    mutate(refreshToken!);
  }

  return (
    <>
      <div>
        <h1>Workspace</h1>
        <button onClick={logout} disabled={isPending}>
          {isPending ? 'Logging out...' : 'Log out'}
        </button>
      </div>
      {documents.map((doc: any) => (
        <div key={doc.id}>
          <h2>{doc.title}</h2>
        </div>
      ))}
    </>
  )
}

export default Workspace