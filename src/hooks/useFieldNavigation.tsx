'use client'

import { useCallback, useRef } from 'react'

export interface FieldNavigationConfig {
  scrollBehavior?: ScrollBehavior
  scrollOffset?: number
  focusDelay?: number
}

export function useFieldNavigation(config: FieldNavigationConfig = {}) {
  const {
    scrollBehavior = 'smooth',
    scrollOffset = 100,
    focusDelay = 100
  } = config

  const fieldRefs = useRef<Map<string, HTMLElement>>(new Map())

  const registerField = useCallback((fieldId: string, element: HTMLElement | null) => {
    if (element) {
      fieldRefs.current.set(fieldId, element)
    } else {
      fieldRefs.current.delete(fieldId)
    }
  }, [])

  const focusNext = useCallback((currentFieldId: string, fieldOrder: string[]) => {
    const currentIndex = fieldOrder.indexOf(currentFieldId)
    if (currentIndex === -1 || currentIndex === fieldOrder.length - 1) {
      return false // No next field or current field not found
    }

    const nextFieldId = fieldOrder[currentIndex + 1]
    const nextElement = fieldRefs.current.get(nextFieldId)
    
    if (nextElement) {
      // Scroll to the field first
      const rect = nextElement.getBoundingClientRect()
      const scrollTop = window.pageYOffset + rect.top - scrollOffset
      
      window.scrollTo({
        top: scrollTop,
        behavior: scrollBehavior
      })

      // Focus the field after scroll
      setTimeout(() => {
        if (nextElement instanceof HTMLInputElement || 
            nextElement instanceof HTMLTextAreaElement ||
            nextElement instanceof HTMLSelectElement) {
          nextElement.focus()
        } else {
          // Try to find a focusable element within
          const focusable = nextElement.querySelector('input, textarea, select, [contenteditable="true"]') as HTMLElement
          if (focusable) {
            focusable.focus()
          }
        }
      }, focusDelay)

      return true
    }

    return false
  }, [scrollBehavior, scrollOffset, focusDelay])

  const focusPrevious = useCallback((currentFieldId: string, fieldOrder: string[]) => {
    const currentIndex = fieldOrder.indexOf(currentFieldId)
    if (currentIndex <= 0) {
      return false // No previous field or current field not found
    }

    const prevFieldId = fieldOrder[currentIndex - 1]
    const prevElement = fieldRefs.current.get(prevFieldId)
    
    if (prevElement) {
      // Scroll to the field first
      const rect = prevElement.getBoundingClientRect()
      const scrollTop = window.pageYOffset + rect.top - scrollOffset
      
      window.scrollTo({
        top: scrollTop,
        behavior: scrollBehavior
      })

      // Focus the field after scroll
      setTimeout(() => {
        if (prevElement instanceof HTMLInputElement || 
            prevElement instanceof HTMLTextAreaElement ||
            prevElement instanceof HTMLSelectElement) {
          prevElement.focus()
        } else {
          // Try to find a focusable element within
          const focusable = prevElement.querySelector('input, textarea, select, [contenteditable="true"]') as HTMLElement
          if (focusable) {
            focusable.focus()
          }
        }
      }, focusDelay)

      return true
    }

    return false
  }, [scrollBehavior, scrollOffset, focusDelay])

  return {
    registerField,
    focusNext,
    focusPrevious,
    fieldRefs: fieldRefs.current
  }
}