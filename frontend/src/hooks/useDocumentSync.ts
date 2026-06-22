import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { documentActions } from '@/store/doucumentSlice'
import { updateDocument } from '@/services/api/documentApis'
import type { IActiveDocument } from '@/models/IDocument'

export const useDocumentSync = (syncInterval = 30000) => {
  const dispatch = useDispatch()

  const activeDocument: IActiveDocument | null = useSelector(
    (state: any) => state.document.activeDocument
  )

  const docRef = useRef(activeDocument)

  useEffect(() => {
    docRef.current = activeDocument
  }, [activeDocument])

  useEffect(() => {
    const sync = async () => {
      const doc = docRef.current
      if (!doc || !doc.isDirty) return

      try {
        dispatch(documentActions.setSaveStatus('saving'))
        const response = await updateDocument({
          id: doc.id,
          title: doc.title,
          content: doc.content,
          version: doc.version,
        })
        dispatch(documentActions.markClean(response.document.version))
        dispatch(documentActions.setSaveStatus('saved'))
        setTimeout(() => dispatch(documentActions.setSaveStatus('idle')), 2000)
      } catch (err: any) {
        if (err?.response?.status === 409) {
          dispatch(documentActions.setSaveStatus('conflict'))
        } else {
          dispatch(documentActions.setSaveStatus('error'))
        }
      }
    }

    const interval = setInterval(sync, syncInterval)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleBeforeUnload = async () => {
      const doc = docRef.current
      if (!doc || !doc.isDirty) return
      await updateDocument({
        id: doc.id,
        title: doc.title,
        content: doc.content,
        version: doc.version,
      })
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])
}