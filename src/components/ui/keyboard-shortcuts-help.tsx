'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, Keyboard, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface KeyboardShortcutsHelpProps {
  isOpen: boolean
  onClose: () => void
}

export function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  const { t } = useLanguage()
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)
  }, [])

  const shortcuts = [
    {
      key: 'Enter',
      description: t ? t('keyboardShortcuts.enterNext') : 'Move to next field or section',
      icon: <ArrowRight className="h-4 w-4" />
    },
    {
      key: 'Tab',
      description: t ? t('keyboardShortcuts.tabNext') : 'Navigate between fields',
      icon: <ArrowRight className="h-4 w-4" />
    },
    {
      key: 'Shift + Tab',
      description: t ? t('keyboardShortcuts.shiftTabPrev') : 'Navigate to previous field',
      icon: <ArrowLeft className="h-4 w-4" />
    },
    {
      key: 'Shift + Enter',
      description: t ? t('keyboardShortcuts.shiftEnterSave') : 'Save current progress',
      icon: <RotateCcw className="h-4 w-4" />
    },
    {
      key: `${isMac ? 'Cmd' : 'Ctrl'} + Enter`,
      description: t ? t('keyboardShortcuts.ctrlEnterPreview') : 'Open preview modal',
      icon: <ArrowRight className="h-4 w-4" />
    },
    {
      key: 'Escape',
      description: t ? t('keyboardShortcuts.escapePrev') : 'Go back or close modal',
      icon: <ArrowLeft className="h-4 w-4" />
    },
    {
      key: 'F1',
      description: t ? t('keyboardShortcuts.f1Help') : 'Show this help or preview',
      icon: <Keyboard className="h-4 w-4" />
    },
    {
      key: `${isMac ? 'Cmd' : 'Ctrl'} + 1-9`,
      description: t ? t('keyboardShortcuts.ctrlNumbers') : 'Jump to specific section',
      icon: <ArrowRight className="h-4 w-4" />
    }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Keyboard className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold">
                {t ? t('keyboardShortcuts.title') : 'Keyboard Shortcuts'}
              </h2>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <p className="text-gray-600 mb-6">
            {t ? t('keyboardShortcuts.description') : 
             'Use these keyboard shortcuts to navigate the resume builder more efficiently:'}
          </p>

          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {shortcut.icon}
                    <span className="text-gray-800">{shortcut.description}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {shortcut.key.split(' + ').map((key, keyIndex) => (
                      <React.Fragment key={keyIndex}>
                        {keyIndex > 0 && <span className="text-gray-400 mx-1">+</span>}
                        <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
                          {key}
                        </kbd>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Tips Section */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              {t ? t('keyboardShortcuts.tips.title') : 'Pro Tips:'}
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• {t ? t('keyboardShortcuts.tips.focus') : 'Use Tab to move forward, Shift+Tab to move backward through fields'}</li>
              <li>• {t ? t('keyboardShortcuts.tips.enter') : 'Press Enter on the last field to automatically move to the next section'}</li>
              <li>• {t ? t('keyboardShortcuts.tips.save') : 'Your progress is automatically saved as you type'}</li>
              <li>• {t ? t('keyboardShortcuts.tips.sections') : 'Use Ctrl/Cmd + number keys to quickly jump between sections'}</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-center">
            <Button onClick={onClose}>
              {t ? t('common.gotIt') : 'Got it!'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}