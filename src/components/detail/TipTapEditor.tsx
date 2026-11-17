"use client"

// Synchronize initial content if updated from outside
/* TipTap Action Toolbar */ /* Bold */ /* Italic */ /* Strike */ /* Heading 2 */ /* Heading 3 */ /* Bullet List */ /* Ordered List */ /* Blockquote */ /* Undo */ /* Redo */ /* Editor Content Surface with Stylized TipTap Prose */

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useEffect } from "react"

export interface TipTapEditorProps {
  content?: string
  onChange: (html: string, text: string) => void
  placeholder?: string
  className?: string
}

export default function TipTapEditor({
  content = "",
  onChange,
  placeholder = "Viết cảm nhận chân thực của bạn về quán ăn, không gian, hương vị món ăn...",
  className = "",
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class:
          "min-h-[160px] sm:min-h-[200px] w-full p-3.5 text-xs sm:text-sm text-[#1E293B] font-medium leading-relaxed focus:outline-none",
      },
    },
    onUpdate: ({ editor }: { editor: any }) => {
      const html = editor.getHTML()
      const text = editor.getText()
      onChange(html, text)
    },
    immediatelyRender: false,
  })
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) {
    return (
      <div className="w-full h-44 rounded-xl border border-[#1E293B] bg-[#FAF8F5] animate-pulse flex items-center justify-center text-xs text-slate-400 font-bold">
        Đang khởi tạo trình soạn thảo...
      </div>
    )
  }

  const isEmpty = editor.getText().trim().length === 0

  return (
    <div
      className={`relative rounded-xl border border-[#1E293B] bg-white overflow-hidden shadow-[1px_1px_0px_#1E293B] focus-within:ring-2 focus-within:ring-[#E55067] ${className}`}
    >
      {}
      <div className="flex flex-wrap items-center gap-1 p-1.5 sm:p-2 bg-[#FAF8F5] border-b border-[#1E293B]/15 text-xs select-none">
        {}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
            editor.isActive("bold")
              ? "bg-[#FFE4E8] text-[#E55067] border border-[#1E293B] shadow-[0.5px_0.5px_0px_#1E293B]"
              : "text-[#1E293B] hover:bg-white hover:border hover:border-[#1E293B]/30"
          }`}
          title="In đậm (Ctrl+B)"
        >
          B
        </button>

        {}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded-lg text-xs italic font-bold transition-all cursor-pointer ${
            editor.isActive("italic")
              ? "bg-[#FFE4E8] text-[#E55067] border border-[#1E293B] shadow-[0.5px_0.5px_0px_#1E293B]"
              : "text-[#1E293B] hover:bg-white hover:border hover:border-[#1E293B]/30"
          }`}
          title="In nghiêng (Ctrl+I)"
        >
          I
        </button>

        {}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-2 py-1 rounded-lg text-xs line-through font-bold transition-all cursor-pointer ${
            editor.isActive("strike")
              ? "bg-[#FFE4E8] text-[#E55067] border border-[#1E293B] shadow-[0.5px_0.5px_0px_#1E293B]"
              : "text-[#1E293B] hover:bg-white hover:border hover:border-[#1E293B]/30"
          }`}
          title="Gạch ngang"
        >
          S
        </button>

        <span className="w-px h-4 bg-[#1E293B]/20 mx-0.5" />

        {}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-2 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
            editor.isActive("heading", { level: 2 })
              ? "bg-[#FFE4E8] text-[#E55067] border border-[#1E293B] shadow-[0.5px_0.5px_0px_#1E293B]"
              : "text-[#1E293B] hover:bg-white hover:border hover:border-[#1E293B]/30"
          }`}
          title="Tiêu đề mục lớn (H2)"
        >
          H2
        </button>

        {}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`px-2 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
            editor.isActive("heading", { level: 3 })
              ? "bg-[#FFE4E8] text-[#E55067] border border-[#1E293B] shadow-[0.5px_0.5px_0px_#1E293B]"
              : "text-[#1E293B] hover:bg-white hover:border hover:border-[#1E293B]/30"
          }`}
          title="Tiêu đề mục nhỏ (H3)"
        >
          H3
        </button>

        <span className="w-px h-4 bg-[#1E293B]/20 mx-0.5" />

        {}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            editor.isActive("bulletList")
              ? "bg-[#FFE4E8] text-[#E55067] border border-[#1E293B] shadow-[0.5px_0.5px_0px_#1E293B]"
              : "text-[#1E293B] hover:bg-white hover:border hover:border-[#1E293B]/30"
          }`}
          title="Danh sách gạch đầu dòng"
        >
          • List
        </button>

        {}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            editor.isActive("orderedList")
              ? "bg-[#FFE4E8] text-[#E55067] border border-[#1E293B] shadow-[0.5px_0.5px_0px_#1E293B]"
              : "text-[#1E293B] hover:bg-white hover:border hover:border-[#1E293B]/30"
          }`}
          title="Danh sách số"
        >
          1. List
        </button>

        {}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            editor.isActive("blockquote")
              ? "bg-[#FFE4E8] text-[#E55067] border border-[#1E293B] shadow-[0.5px_0.5px_0px_#1E293B]"
              : "text-[#1E293B] hover:bg-white hover:border hover:border-[#1E293B]/30"
          }`}
          title="Trích dẫn"
        >
          “ Quote
        </button>

        <span className="w-px h-4 bg-[#1E293B]/20 mx-0.5" />

        {}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="px-2 py-1 rounded-lg text-xs font-bold text-[#1E293B] hover:bg-white hover:border hover:border-[#1E293B]/30 disabled:opacity-30 cursor-pointer transition-all"
          title="Hoàn tác (Ctrl+Z)"
        >
          ↶
        </button>

        {}
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="px-2 py-1 rounded-lg text-xs font-bold text-[#1E293B] hover:bg-white hover:border hover:border-[#1E293B]/30 disabled:opacity-30 cursor-pointer transition-all"
          title="Làm lại (Ctrl+Y)"
        >
          ↷
        </button>
      </div>

      {}
      <div className="relative">
        {isEmpty && (
          <div className="pointer-events-none absolute top-3.5 left-3.5 text-xs sm:text-sm text-slate-400 font-medium italic">
            {placeholder}
          </div>
        )}
        <EditorContent editor={editor} />
      </div>

      <style jsx global>{`
        .tiptap h2 {
          font-size: 1.15rem;
          font-weight: 800;
          color: #1e293b;
          margin-top: 0.8rem;
          margin-bottom: 0.4rem;
        }
        .tiptap h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #1e293b;
          margin-top: 0.6rem;
          margin-bottom: 0.3rem;
        }
        .tiptap p {
          margin-bottom: 0.6rem;
          line-height: 1.6;
        }
        .tiptap ul {
          list-style-type: disc;
          padding-left: 1.25rem;
          margin-bottom: 0.6rem;
        }
        .tiptap ol {
          list-style-type: decimal;
          padding-left: 1.25rem;
          margin-bottom: 0.6rem;
        }
        .tiptap blockquote {
          border-left: 3px solid #ff5376;
          padding-left: 0.75rem;
          margin: 0.6rem 0;
          color: #475569;
          font-style: italic;
          background: #fff5ef;
          padding-top: 0.25rem;
          padding-bottom: 0.25rem;
          border-radius: 0 0.5rem 0.5rem 0;
        }
      `}</style>
    </div>
  )
}
