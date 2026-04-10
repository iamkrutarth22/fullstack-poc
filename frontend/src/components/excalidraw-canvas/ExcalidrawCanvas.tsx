import { Excalidraw, MainMenu } from '@excalidraw/excalidraw'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types'


import '@excalidraw/excalidraw/index.css'
import { useEffect, useState } from 'react'

const ExcalidrawCanvas = () => {
  const [api, setApi] = useState<ExcalidrawImperativeAPI|null>(null)


  useEffect(() => {
    if (api) {
      console.log('Excalidraw API is ready:', api)
    }
    
  }, [api])

  return (
    <div style={{ width: '100%', height: '450px' }}>
      <Excalidraw
        excalidrawAPI={api => setApi(api)}
        initialData={{
          appState: {
            viewBackgroundColor: '#15161a'
          }
        }}
        UIOptions={{
          canvasActions: {
            changeViewBackgroundColor: false,
            clearCanvas: false,
            export: false,
            loadScene: false,
            saveToActiveFile: false,
            saveAsImage: false,
            toggleTheme: false
          },
          tools: { image: false }
        }}
      >
        <MainMenu />
      </Excalidraw>
    </div>
  )
}

export default ExcalidrawCanvas
