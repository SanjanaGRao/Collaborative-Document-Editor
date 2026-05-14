'use client'

import { useState, useRef, useEffect } from 'react'
import { Download, FileText, FileJson } from 'lucide-react'
import { exportToPDF, exportToMarkdown } from '@/lib/export-utils'

interface ExportMenuProps {
  documentTitle: string
  documentContent: Record<string, unknown>
  editorRef: React.RefObject<HTMLDivElement>
}

export function ExportMenu({ documentTitle, documentContent, editorRef }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleExportPDF = async () => {
    if (editorRef.current) {
      await exportToPDF(editorRef.current, documentTitle)
      setIsOpen(false)
    }
  }

  const handleExportMarkdown = () => {
    exportToMarkdown(documentContent, documentTitle)
    setIsOpen(false)
  }

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(documentContent, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${documentTitle}.json`
    link.click()
    URL.revokeObjectURL(url)
    setIsOpen(false)
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="toolbar-button flex items-center gap-2"
        title="Export document"
      >
        <Download size={18} />
        Export
      </button>

      {isOpen && (
        <div className="export-menu">
          <button
            onClick={handleExportPDF}
            className="export-item"
          >
            <FileText size={16} />
            Export to PDF
          </button>
          <button
            onClick={handleExportMarkdown}
            className="export-item"
          >
            <FileText size={16} />
            Export to Markdown
          </button>
          <button
            onClick={handleExportJSON}
            className="export-item"
          >
            <FileJson size={16} />
            Export to JSON
          </button>
        </div>
      )}
    </div>
  )
}
