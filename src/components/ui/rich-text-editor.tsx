'use client'

import * as React from "react"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { cn } from "@/lib/utils"
import { Bold, Italic, List, ListOrdered } from "lucide-react"

export interface RichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

const RichTextEditor = React.forwardRef<HTMLDivElement, RichTextEditorProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, value = '', onChange, placeholder: _placeholder, disabled = false }, ref) => {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          bulletList: {
            HTMLAttributes: {
              class: 'list-disc list-inside ml-4'}},
          orderedList: {
            HTMLAttributes: {
              class: 'list-decimal list-inside ml-4'}}}),
      ],
      content: value,
      onUpdate: ({ editor }) => {
        onChange?.(editor.getHTML())
      },
      editable: !disabled,
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class: 'prose prose-sm focus:outline-none min-h-[100px] max-w-none'}}})

    React.useEffect(() => {
      if (!editor) return
      
      // Avoid unnecessary updates
      const currentContent = editor.getHTML()
      if (currentContent !== value) {
        editor.commands.setContent(value || '', false, {
          preserveWhitespace: true})
      }
    }, [editor, value])

    React.useEffect(() => {
      if (editor) {
        editor.setEditable(!disabled)
      }
    }, [editor, disabled])

    // Cleanup on unmount
    React.useEffect(() => {
      return () => {
        if (editor) {
          editor.destroy()
        }
      }
    }, [editor])

    return (
      <div className={cn("rounded-lg border border-gray-200 overflow-hidden", className)} ref={ref}>
        <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50/50">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={cn(
              "p-1.5 rounded hover:bg-gray-200/80 transition-colors",
              editor?.isActive('bold') && "bg-gray-200"
            )}
            disabled={disabled}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={cn(
              "p-1.5 rounded hover:bg-gray-200/80 transition-colors",
              editor?.isActive('italic') && "bg-gray-200"
            )}
            disabled={disabled}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={cn(
              "p-1.5 rounded hover:bg-gray-200/80 transition-colors",
              editor?.isActive('bulletList') && "bg-gray-200"
            )}
            disabled={disabled}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={cn(
              "p-1.5 rounded hover:bg-gray-200/80 transition-colors",
              editor?.isActive('orderedList') && "bg-gray-200"
            )}
            disabled={disabled}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
        </div>
        {editor && (
          <EditorContent
            editor={editor}
            className={cn(
              "px-3 py-2 text-sm",
              disabled && "opacity-50",
              "[&_.ProseMirror]:min-h-[100px] [&_.ProseMirror]:focus:outline-none",
              "[&_.ProseMirror_p]:my-1 [&_.ProseMirror_ul]:my-2 [&_.ProseMirror_ol]:my-2",
              "[&_.ProseMirror_li]:my-0.5 [&_.ProseMirror_li_p]:my-0"
            )}
          />
        )}
      </div>
    )
  }
)

RichTextEditor.displayName = "RichTextEditor"

export { RichTextEditor }