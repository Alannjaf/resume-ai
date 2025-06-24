import { Text, View } from '@react-pdf/renderer'
import { ReactElement } from 'react'

interface ParsedContent {
  elements: ReactElement[]
}

export const parseHtmlToPdf = (htmlContent: string, styles: any): ParsedContent => {
  if (!htmlContent || htmlContent.trim() === '') {
    return { elements: [] }
  }

  // Clean up the HTML content
  const cleanedHtml = htmlContent
    .replace(/<div>/g, '')
    .replace(/<\/div>/g, '\n')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .trim()

  // Parse the HTML and convert to React-PDF elements
  const elements: ReactElement[] = []
  let currentKey = 0

  // Split by major block elements
  const blocks = cleanedHtml.split(/(<\/?(?:p|ul|ol|li)[^>]*>)/i)
  
  let currentList: ReactElement[] = []
  let listType: 'ul' | 'ol' | null = null
  let listItemCounter = 0

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i].trim()
    if (!block) continue

    // Start of unordered list
    if (block.match(/^<ul/i)) {
      listType = 'ul'
      listItemCounter = 0
      currentList = []
      continue
    }

    // Start of ordered list
    if (block.match(/^<ol/i)) {
      listType = 'ol'
      listItemCounter = 0
      currentList = []
      continue
    }

    // End of list
    if (block.match(/^<\/(ul|ol)/i)) {
      if (currentList.length > 0) {
        elements.push(
          <View key={`list-${currentKey++}`} style={{ marginTop: 2, marginBottom: 2 }}>
            {currentList}
          </View>
        )
      }
      currentList = []
      listType = null
      continue
    }

    // List item
    if (block.match(/^<li/i)) {
      continue // Skip opening li tag
    }

    if (block.match(/^<\/li/i)) {
      continue // Skip closing li tag
    }

    // Process the actual content
    if (!block.match(/^<[^>]*>$/)) {
      if (listType) {
        // We're inside a list
        const listItemContent = parseInlineElements(block, styles)
        const prefix = listType === 'ul' ? '• ' : `${++listItemCounter}. `
        
        currentList.push(
          <View key={`list-item-${currentKey++}`} style={{ 
            flexDirection: 'row', 
            marginBottom: 1,
            paddingLeft: 8
          }}>
            <Text style={[styles.text, { minWidth: 12 }]}>{prefix}</Text>
            <View style={{ flex: 1 }}>
              {listItemContent}
            </View>
          </View>
        )
      } else {
        // Regular paragraph
        const paragraphContent = parseInlineElements(block, styles)
        if (paragraphContent.length > 0) {
          elements.push(
            <View key={`paragraph-${currentKey++}`} style={{ marginBottom: 2 }}>
              {paragraphContent}
            </View>
          )
        }
      }
    }
  }

  // Add any remaining list items
  if (currentList.length > 0) {
    elements.push(
      <View key={`list-final-${currentKey++}`} style={{ marginTop: 2, marginBottom: 2 }}>
        {currentList}
      </View>
    )
  }

  return { elements }
}

const parseInlineElements = (content: string, styles: any): ReactElement[] => {
  const elements: ReactElement[] = []
  let currentKey = 0

  // Remove paragraph tags
  const cleanContent = content.replace(/<\/?p[^>]*>/gi, '')

  // Split by inline formatting tags
  const parts = cleanContent.split(/(<\/?(?:strong|b|em|i)[^>]*>)/i)
  
  let isBold = false
  let isItalic = false

  for (const part of parts) {
    if (!part) continue

    if (part.match(/^<(strong|b)[^>]*>/i)) {
      isBold = true
      continue
    }
    
    if (part.match(/^<\/(strong|b)[^>]*>/i)) {
      isBold = false
      continue
    }
    
    if (part.match(/^<(em|i)[^>]*>/i)) {
      isItalic = true
      continue
    }
    
    if (part.match(/^<\/(em|i)[^>]*>/i)) {
      isItalic = false
      continue
    }

    // Regular text content
    if (!part.match(/^<[^>]*>$/)) {
      const textStyle = [styles.text]
      if (isBold) textStyle.push({ fontWeight: 'bold' })
      if (isItalic) textStyle.push({ fontStyle: 'italic' })

      elements.push(
        <Text key={`text-${currentKey++}`} style={textStyle}>
          {part}
        </Text>
      )
    }
  }

  return elements
}

// Helper function to strip HTML tags for plain text fallback
export const stripHtmlTags = (html: string): string => {
  if (!html) return ''
  
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim()
}