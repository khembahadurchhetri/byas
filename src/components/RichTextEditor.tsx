"use client";

import { useEffect } from "react";

import Color from "@tiptap/extension-color";
import {
  TextStyle,
} from "@tiptap/extension-text-style";

import {
  EditorContent,
  useEditor,
} from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react";

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (
    value: string
  ) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
    ],

    content: value,

    immediatelyRender: false,

    editorProps: {
      attributes: {
        class:
          "min-h-[260px] px-4 py-4 text-gray-800 outline-none leading-7",
      },
    },

    onUpdate({
      editor,
    }) {
      onChange(
        editor.getHTML()
      );
    },
  });

  useEffect(() => {
    if (!editor) return;

    const current =
      editor.getHTML();

    if (current !== value) {
      editor.commands.setContent(
        value || "",
        {
          emitUpdate: false,
        }
      );
    }
  }, [
    value,
    editor,
  ]);

  if (!editor) {
    return (
      <div className="min-h-[260px] rounded-xl border bg-white p-4 text-sm text-gray-400">
        Loading editor...
      </div>
    );
  }

  const buttonClass = (
    active = false
  ) =>
    `rounded-lg p-2 transition ${
      active
        ? "bg-green-700 text-white"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-300 bg-white">

      {/* TOOLBAR */}

      <div className="flex flex-wrap items-center gap-1 border-b bg-gray-50 p-2">

        <button
          type="button"
          title="Bold"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
          className={buttonClass(
            editor.isActive(
              "bold"
            )
          )}
        >
          <Bold size={17} />
        </button>

        <button
          type="button"
          title="Italic"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
          className={buttonClass(
            editor.isActive(
              "italic"
            )
          )}
        >
          <Italic size={17} />
        </button>

        <div className="mx-1 h-6 w-px bg-gray-300" />

        {/* COLOR */}

        <label
          title="Text Color"
          className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 hover:bg-gray-100"
        >
          <span className="text-xs font-semibold text-gray-600">
            Color
          </span>

          <input
            type="color"
            onChange={(e) =>
              editor
                .chain()
                .focus()
                .setColor(
                  e.target.value
                )
                .run()
            }
            className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent p-0"
          />
        </label>

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .unsetColor()
              .run()
          }
          className="rounded-lg px-2 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100"
        >
          Reset Color
        </button>

        <div className="mx-1 h-6 w-px bg-gray-300" />

        {/* HEADINGS */}

        <button
          type="button"
          title="Heading 2"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run()
          }
          className={buttonClass(
            editor.isActive(
              "heading",
              {
                level: 2,
              }
            )
          )}
        >
          <Heading2
            size={18}
          />
        </button>

        <button
          type="button"
          title="Heading 3"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 3,
              })
              .run()
          }
          className={buttonClass(
            editor.isActive(
              "heading",
              {
                level: 3,
              }
            )
          )}
        >
          <Heading3
            size={18}
          />
        </button>

        <div className="mx-1 h-6 w-px bg-gray-300" />

        {/* LISTS */}

        <button
          type="button"
          title="Bullet List"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
          className={buttonClass(
            editor.isActive(
              "bulletList"
            )
          )}
        >
          <List
            size={18}
          />
        </button>

        <button
          type="button"
          title="Numbered List"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
          className={buttonClass(
            editor.isActive(
              "orderedList"
            )
          )}
        >
          <ListOrdered
            size={18}
          />
        </button>

        <button
          type="button"
          title="Quote"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBlockquote()
              .run()
          }
          className={buttonClass(
            editor.isActive(
              "blockquote"
            )
          )}
        >
          <Quote
            size={18}
          />
        </button>

        <div className="mx-1 h-6 w-px bg-gray-300" />

        {/* UNDO / REDO */}

        <button
          type="button"
          title="Undo"
          disabled={
            !editor
              .can()
              .chain()
              .focus()
              .undo()
              .run()
          }
          onClick={() =>
            editor
              .chain()
              .focus()
              .undo()
              .run()
          }
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
        >
          <Undo2
            size={18}
          />
        </button>

        <button
          type="button"
          title="Redo"
          disabled={
            !editor
              .can()
              .chain()
              .focus()
              .redo()
              .run()
          }
          onClick={() =>
            editor
              .chain()
              .focus()
              .redo()
              .run()
          }
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
        >
          <Redo2
            size={18}
          />
        </button>
      </div>

      {/* EDITOR */}

      <EditorContent
        editor={editor}
      />
    </div>
  );
}