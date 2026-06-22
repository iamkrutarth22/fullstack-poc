import type { IAuthentication } from '@/models/IStore'
import { logoutHandler } from '@/services/api'
import { authLoginActions } from '@/store/authSlice'
import { useMutation } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'

type Document = {
  id: string
  title: string
  content: any
  version: number
  updatedAt: string
}

const SideMenu = ({
  documents,
  handleNewDocument,
  handleSelectDoc
}: {
  documents: Document[]
  handleNewDocument: () => void
  handleSelectDoc: (doc: Document) => void
}) => {
  const dispatch = useDispatch()
  const refreshToken = useSelector(
    (state: { authLogin: IAuthentication }) => state.authLogin.refreshToken
  )

  const activeDocument = useSelector(
    (state: any) => state.document.activeDocument
  )

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: logoutHandler,
    onSuccess: () => {
      dispatch(authLoginActions.logout())
      window.location.href = '/login'
    }
  })

  return (
    <div className='w-60 border-r border-border flex flex-col p-4 gap-4'>
      {/* <span className='font-display text-xl'>Folio</span> */}
      <button
        onClick={handleNewDocument}
        className='w-full text-sm bg-primary text-primary-foreground rounded px-3 py-2'
      >
        + New Document
      </button>

      <div className='text-sm text-muted-foreground'>Your Documents</div>
      <div className='flex flex-col gap-1 flex-1 overflow-y-auto no-scrollbar'>
        {documents.map(doc => (
          <button
            key={doc.id}
            onClick={() => handleSelectDoc(doc)}
            className={`text-left text-sm px-3 py-2 rounded truncate ${
              activeDocument?.id === doc.id
                ? 'bg-secondary font-medium'
                : 'hover:bg-secondary/50'
            }`}
          >
            {doc.title || 'Untitled'}
          </button>
        ))}
      </div>
      <button
        onClick={() => logout(refreshToken!)}
        disabled={isLoggingOut}
        className='text-sm text-muted-foreground hover:text-foreground'
      >
        {isLoggingOut ? 'Logging out...' : 'Log out'}
      </button>
    </div>
  )
}

export default SideMenu
