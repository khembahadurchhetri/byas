"use client";

import { useEffect } from "react";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  variant?: "content" | "title" | "compact";
}

export default function RichTextEditor({
  value,
  onChange,
  variant = "content",
}: Props) {
  const isTitle = variant === "title";

  const isCompact = variant === "compact";

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    immediatelyRender: false,

    content: value,

    editorProps: {
      attributes: {
        class: isTitle
          ? "min-h-[90px] px-4 py-3 text-2xl font-bold leading-tight text-gray-900 outline-none [&_p]:my-1 [&_h1]:text-4xl [&_h1]:font-bold [&_h2]:text-3xl [&_h2]:font-bold"
          : isCompact
            ? "min-h-[130px] px-4 py-3 text-sm leading-6 text-gray-800 outline-none [&_h1]:mt-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold [&_p]:my-2 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-green-600 [&_blockquote]:bg-green-50 [&_blockquote]:px-3 [&_blockquote]:py-2"
            : "min-h-[300px] px-5 py-4 text-[15px] leading-7 text-gray-800 outline-none [&_h1]:mb-4 [&_h1]:mt-6 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mb-3 [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_p]:my-3 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-7 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-7 [&_li]:my-1 [&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-green-600 [&_blockquote]:bg-green-50 [&_blockquote]:px-4 [&_blockquote]:py-2 [&_blockquote]:italic",
      },
    },

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "", {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="rounded-xl border bg-white p-5 text-sm text-gray-400">
        Loading editor...
      </div>
    );
  }

  const buttonClass = (active = false) =>
    `flex h-9 w-9 items-center justify-center rounded-lg transition ${
      active ? "bg-green-700 text-white" : "text-gray-600 hover:bg-gray-200"
    }`;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b bg-gray-50 p-2">
        <button
          type="button"
          title="Bold"
          className={buttonClass(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={17} />
        </button>

        <button
          type="button"
          title="Italic"
          className={buttonClass(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={17} />
        </button>

        <button
          type="button"
          title="Underline"
          className={buttonClass(editor.isActive("underline"))}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon size={17} />
        </button>

        <Divider />

        {isTitle ? (
          <>
            <button
              type="button"
              title="Large Title"
              className={buttonClass(editor.isActive("heading", { level: 1 }))}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              <Heading1 size={18} />
            </button>

            <button
              type="button"
              title="Medium Title"
              className={buttonClass(editor.isActive("heading", { level: 2 }))}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              <Heading2 size={18} />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              title="Heading 1"
              className={buttonClass(editor.isActive("heading", { level: 1 }))}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              <Heading1 size={18} />
            </button>

            <button
              type="button"
              title="Heading 2"
              className={buttonClass(editor.isActive("heading", { level: 2 }))}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              <Heading2 size={18} />
            </button>

            <button
              type="button"
              title="Heading 3"
              className={buttonClass(editor.isActive("heading", { level: 3 }))}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
            >
              <Heading3 size={18} />
            </button>

            <Divider />

            <button
              type="button"
              title="Bullet List"
              className={buttonClass(editor.isActive("bulletList"))}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List size={18} />
            </button>

            <button
              type="button"
              title="Numbered List"
              className={buttonClass(editor.isActive("orderedList"))}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered size={18} />
            </button>

            <button
              type="button"
              title="Quote"
              className={buttonClass(editor.isActive("blockquote"))}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <Quote size={18} />
            </button>
          </>
        )}

        <Divider />

        <button
          type="button"
          title="Align Left"
          className={buttonClass(editor.isActive({ textAlign: "left" }))}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft size={18} />
        </button>

        <button
          type="button"
          title="Align Center"
          className={buttonClass(editor.isActive({ textAlign: "center" }))}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter size={18} />
        </button>

        <button
          type="button"
          title="Align Right"
          className={buttonClass(editor.isActive({ textAlign: "right" }))}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight size={18} />
        </button>

        <Divider />

        <label className="flex h-9 cursor-pointer items-center gap-2 rounded-lg px-2 text-xs font-semibold text-gray-600 hover:bg-gray-200">
          Color
          <input
            type="color"
            className="h-6 w-6 cursor-pointer border-0 bg-transparent p-0"
            onChange={(e) =>
              editor.chain().focus().setColor(e.target.value).run()
            }
          />
        </label>

        <button
          type="button"
          className="h-9 rounded-lg px-2 text-xs font-semibold text-gray-500 hover:bg-gray-200"
          onClick={() => editor.chain().focus().unsetColor().run()}
        >
          Reset
        </button>

        {!isTitle && (
          <>
            <Divider />

            <button
              type="button"
              className={buttonClass()}
              onClick={() => editor.chain().focus().undo().run()}
            >
              <Undo2 size={18} />
            </button>

            <button
              type="button"
              className={buttonClass()}
              onClick={() => editor.chain().focus().redo().run()}
            >
              <Redo2 size={18} />
            </button>
          </>
        )}
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

function Divider() {
  return <div className="mx-1 h-6 w-px bg-gray-300" />;
}
