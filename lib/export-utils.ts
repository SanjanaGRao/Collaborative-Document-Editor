import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import TurndownService from 'turndown'

export async function exportToPDF(
  element: HTMLElement,
  filename: string
) {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 10
    const availableWidth = pageWidth - 2 * margin
    const availableHeight = pageHeight - 2 * margin

    const imgWidth = availableWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = margin

    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight)
    heightLeft -= availableHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + margin
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight)
      heightLeft -= availableHeight
    }

    pdf.save(`${filename}.pdf`)
  } catch (err) {
    console.error('Error exporting to PDF:', err)
  }
}

export function exportToMarkdown(
  content: Record<string, unknown>,
  filename: string
) {
  try {
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      bulletListMarker: '-',
      codeBlockStyle: 'fenced',
    })

    // Convert content to HTML first
    const html = convertContentToHTML(content)
    const markdown = turndownService.turndown(html)

    const dataBlob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.md`
    link.click()
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Error exporting to Markdown:', err)
  }
}

function convertContentToHTML(content: Record<string, unknown>): string {
  if (
    !content.content ||
    !Array.isArray(content.content)
  ) {
    return '<p>No content</p>'
  }

  const contentArray = content.content as Array<Record<string, unknown>>
  return contentArray
    .map(node => {
      if (node.type === 'heading') {
        const level = node.attrs?.level || 1
        const text = getTextFromNode(node)
        return `<h${level}>${text}</h${level}>`
      } else if (node.type === 'paragraph') {
        const text = getTextFromNode(node)
        return `<p>${text}</p>`
      } else if (node.type === 'bulletList' || node.type === 'orderedList') {
        const tag = node.type === 'bulletList' ? 'ul' : 'ol'
        const items = (node.content as Array<Record<string, unknown>>) || []
        const itemsHTML = items
          .map(item => `<li>${getTextFromNode(item)}</li>`)
          .join('')
        return `<${tag}>${itemsHTML}</${tag}>`
      } else if (node.type === 'codeBlock') {
        const text = getTextFromNode(node)
        return `<pre><code>${text}</code></pre>`
      } else if (node.type === 'blockquote') {
        const text = getTextFromNode(node)
        return `<blockquote>${text}</blockquote>`
      }
      return ''
    })
    .join('')
}

function getTextFromNode(node: Record<string, unknown>): string {
  if (!node.content) {
    return ''
  }

  if (Array.isArray(node.content)) {
    return node.content
      .map(item => {
        if (typeof item === 'object' && item !== null && 'text' in item) {
          const textNode = item as Record<string, unknown>
          let text = String(textNode.text || '')

          if (textNode.marks) {
            const marks = textNode.marks as Array<Record<string, unknown>>
            marks.forEach(mark => {
              if (mark.type === 'bold') {
                text = `<strong>${text}</strong>`
              } else if (mark.type === 'italic') {
                text = `<em>${text}</em>`
              } else if (mark.type === 'underline') {
                text = `<u>${text}</u>`
              } else if (mark.type === 'code') {
                text = `<code>${text}</code>`
              }
            })
          }

          return text
        }
        return ''
      })
      .join('')
  }

  return ''
}
