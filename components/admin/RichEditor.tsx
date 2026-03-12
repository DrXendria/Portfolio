'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { useEffect } from 'react'

const tools = [
  { action: (e: any) => e.chain().focus().toggleBold().run(), label: 'B', title: 'Bold', active: (e: any) => e.isActive('bold') },
  { action: (e: any) => e.chain().focus().toggleItalic().run(), label: 'I', title: 'Italic', active: (e: any) => e.isActive('italic') },
  { action: (e: any) => e.chain().focus().toggleCode().run(), label: '</>', title: 'Code', active: (e: any) => e.isActive('code') },
  { action: (e: any) => e.chain().focus().toggleHeading({ level: 2 }).run(), label: 'H2', title: 'Heading 2', active: (e: any) => e.isActive('heading', { level: 2 }) },
  { action: (e: any) => e.chain().focus().toggleHeading({ level: 3 }).run(), label: 'H3', title: 'Heading 3', active: (e: any) => e.isActive('heading', { level: 3 }) },
  { action: (e: any) => e.chain().focus().toggleBulletList().run(), label: '•—', title: 'Bullet List', active: (e: any) => e.isActive('bulletList') },
  { action: (e: any) => e.chain().focus().toggleOrderedList().run(), label: '1.', title: 'Ordered List', active: (e: any) => e.isActive('orderedList') },
  { action: (e: any) => e.chain().focus().toggleBlockquote().run(), label: '❝', title: 'Blockquote', active: (e: any) => e.isActive('blockquote') },
  { action: (e: any) => e.chain().focus().toggleCodeBlock().run(), label: '⌨', title: 'Code Block', active: (e: any) => e.isActive('codeBlock') },
]

export default function RichEditor({ content, onChange }: { content: string; onChange: (c: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false }), Image],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: 'tiptap-content outline-none min-h-[300px] px-6 py-5 text-[rgba(232,244,248,0.7)] text-sm leading-relaxed' },
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) editor.commands.setContent(content)
  }, [content])

  return (
    <div className="border border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.02)]">
      <div className="flex flex-wrap gap-1 p-2 border-b border-[rgba(0,212,255,0.12)]">
        {tools.map(t => (
          <button key={t.label} type="button" title={t.title} onClick={() => t.action(editor)}
            className={`font-mono text-[10px] px-2.5 py-1.5 transition-all ${editor && t.active(editor) ? 'bg-[rgba(0,212,255,0.2)] text-accent' : 'text-[rgba(232,244,248,0.4)] hover:text-accent hover:bg-[rgba(0,212,255,0.08)]'}`}>
            {t.label}
          </button>
        ))}
        <button type="button" title="Add Image" className="font-mono text-[10px] px-2.5 py-1.5 text-[rgba(232,244,248,0.4)] hover:text-accent hover:bg-[rgba(0,212,255,0.08)]"
          onClick={() => { const url = prompt('Görsel URL:'); if (url && editor) editor.chain().focus().setImage({ src: url }).run() }}>
          🖼
        </button>
        <button type="button" title="Add Link" className="font-mono text-[10px] px-2.5 py-1.5 text-[rgba(232,244,248,0.4)] hover:text-accent hover:bg-[rgba(0,212,255,0.08)]"
          onClick={() => { const url = prompt('Link URL:'); if (url && editor) editor.chain().focus().setLink({ href: url }).run() }}>
          🔗
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}