import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { documentActions } from '@/store/documentSlice'
import { documentActions } from '@/store/doucumentSlice'
import {
  getDocuments,
  createDocument,
  getDocumentById
} from '@/services/api/documentApis'
import { useDocumentSync } from '@/hooks/useDocumentSync'
// import CustomEditor from '@/components/CustomEditor'
import CustomEditor from '@/components/document-editor/CustomEditor'
// import ExcalidrawCanvas from '@/components/ExcalidrawCanvas'
import ExcalidrawCanvas from '@/components/excalidraw-canvas/ExcalidrawCanvas'
import SideMenu from '@/components/document-editor/SideMenu'

type Document = {
  id: string
  title: string
  content: any
  version: number
  updatedAt: string
}

const Workspace = () => {
  const dispatch = useDispatch()

  const activeDocument = useSelector(
    (state: any) => state.document.activeDocument
  )
  console.log('activeDocument', activeDocument)
  const saveStatus = useSelector((state: any) => state.document.saveStatus)

  const [documents, setDocuments] = useState<Document[]>([])

  useDocumentSync()

  useEffect(() => {
    console.log('component mounted, fetching documents')
    const fetchDocuments = async () => {
      const docs = await getDocuments()
      setDocuments(docs.documents)

      if (docs.documents.length > 0 && !activeDocument) {
        const first = docs.documents[0]
        dispatch(
          documentActions.setActiveDocument({
            id: first.id,
            title: first.title,
            content: first.content ?? {
              mode: 'text',
              text: { type: 'doc', content: [] },
              diagram: { elements: [], appState: {} }
            },
            version: first.version,
            isDirty: false
          })
        )
      }
    }
    fetchDocuments()
  }, [])

  const handleNewDocument = async () => {
    const response = await createDocument({
      title: 'Untitled',
      content: {
        mode: 'text',
        text: { type: 'doc', content: [] },
        diagram: { elements: [], appState: {} }
      }
    })
    const newDoc = response.document
    setDocuments(prev => [newDoc, ...prev])
    dispatch(
      documentActions.setActiveDocument({
        id: newDoc.id,
        title: newDoc.title,
        content: newDoc.content,
        version: newDoc.version,
        isDirty: false
      })
    )
  }

  const handleSelectDoc = async (doc: Document) => {
    console.log('selecting doc', doc)
    const fresh = await getDocumentById(doc.id)
    dispatch(
      documentActions.setActiveDocument({
        id: fresh.id,
        title: fresh.title,
        content: fresh.content ?? {
          mode: 'text',
          text: { type: 'doc', content: [] },
          diagram: { elements: [], appState: {} }
        },
        version: fresh.version,
        isDirty: false
      })
    )
  }

  const saveStatusMap = {
    idle: '',
    saving: 'Saving...',
    saved: 'Saved ✓',
    error: 'Save failed',
    conflict: 'Conflict — reload page'
  }

  const saveStatusLabel =
    saveStatusMap[saveStatus as keyof typeof saveStatusMap] ?? ''

  if (!activeDocument) return <div className='p-10'>Loading...</div>

  return (
    <div className='flex h-screen w-screen overflow-hidden'>
      <SideMenu
        documents={documents}
        handleNewDocument={handleNewDocument}
        handleSelectDoc={handleSelectDoc}
      />

      {/* Main area */}
      <div className='flex flex-col flex-1 overflow-hidden'>
        {/* Top bar */}
        <div className='flex items-center justify-between px-6 py-3 border-b border-border'>
          <input
            className='text-lg font-display bg-transparent outline-none border-none w-full'
            value={activeDocument.title}
            onChange={e =>
              dispatch(documentActions.updateTitle(e.target.value))
            }
            placeholder='Untitled'
          />
          <div className='flex items-center gap-4 shrink-0'>
            {saveStatusLabel && (
              <span className='text-xs text-muted-foreground'>
                {saveStatusLabel}
              </span>
            )}
            <div className='flex items-center border border-border rounded-md overflow-hidden text-sm'>
              <button
                onClick={() => dispatch(documentActions.setMode('text'))}
                className={`px-3 py-1 ${
                  activeDocument.content.mode === 'text'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary'
                }`}
              >
                Text
              </button>
              <button
                onClick={() => dispatch(documentActions.setMode('diagram'))}
                className={`px-3 py-1 ${
                  activeDocument.content.mode === 'diagram'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary'
                }`}
              >
                Diagram
              </button>
            </div>
          </div>
        </div>

        {/* Editor area */}
        <div className='flex-1 overflow-auto'>
          {activeDocument.content.mode === 'text' ? (
            <div className='max-w-3xl mx-auto p-8 h-full'>
              <CustomEditor
                content={JSON.stringify(
                  activeDocument.content?.text ?? { type: 'doc', content: [] }
                )}
                onChange={content =>
                  dispatch(documentActions.updateTextContent(content))
                }
              />
            </div>
          ) : (
            <ExcalidrawCanvas
              key={activeDocument.id} 
              initialData={{
                elements: activeDocument.content?.diagram?.elements ?? [],
                files: activeDocument.content?.diagram?.files ?? {}
              }}
              onChange={(elements, files) =>
                dispatch(
                  documentActions.updateDiagramContent({ elements, files })
                )
              }
            />
            // <></>
          )}
        </div>
      </div>
    </div>
  )
}

export default Workspace
