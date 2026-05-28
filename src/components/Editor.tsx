import { useState, useCallback, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import {
  Code2,
  Type,
  Bold,
  Italic,
  Heading,
  List,
  ListOrdered,
  Quote,
  Link,
  Code,
  CheckSquare,
  SeparatorHorizontal,
} from 'lucide-react';
import type { EditorMode } from '@/types';

interface EditorProps {
  content: string;
  title: string;
  onChange: (value: string) => void;
  onTitleChange: (title: string) => void;
}

export default function Editor({ content, title, onChange, onTitleChange }: EditorProps) {
  const [mode, setMode] = useState<EditorMode>('wysiwyg');
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPos, setToolbarPos] = useState({ x: 0, y: 0 });

  // Floating toolbar on text selection (WYSIWYG mode only)
  useEffect(() => {
    if (mode !== 'wysiwyg') {
      setShowToolbar(false);
      return;
    }

    const handleSelection = () => {
      const sel = window.getSelection();
      if (sel && sel.toString().trim().length > 0) {
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setToolbarPos({
          x: rect.left + rect.width / 2,
          y: rect.top - 50,
        });
        setShowToolbar(true);
      } else {
        setShowToolbar(false);
      }
    };

    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, [mode]);

  const insertMarkdown = useCallback(
    (before: string, after: string = '') => {
      const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = content.substring(start, end);
      const replacement = before + selected + after;

      const newContent = content.substring(0, start) + replacement + content.substring(end);
      onChange(newContent);

      setTimeout(() => {
        textarea.focus();
        const newCursor = start + before.length + selected.length;
        textarea.setSelectionRange(newCursor, newCursor);
      }, 0);
    },
    [content, onChange]
  );

  const toolbarActions = [
    { icon: Bold, label: 'Bold', action: () => insertMarkdown('**', '**') },
    { icon: Italic, label: 'Italic', action: () => insertMarkdown('*', '*') },
    { icon: Heading, label: 'Heading', action: () => insertMarkdown('## ', '') },
    { icon: Code, label: 'Code', action: () => insertMarkdown('`', '`') },
    { icon: Link, label: 'Link', action: () => insertMarkdown('[', '](url)') },
    { icon: List, label: 'List', action: () => insertMarkdown('- ', '') },
    { icon: ListOrdered, label: 'Ordered', action: () => insertMarkdown('1. ', '') },
    { icon: CheckSquare, label: 'Task', action: () => insertMarkdown('- [ ] ', '') },
    { icon: Quote, label: 'Quote', action: () => insertMarkdown('> ', '') },
    { icon: SeparatorHorizontal, label: 'HR', action: () => insertMarkdown('\n---\n', '') },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Editor header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1f2937] bg-[#0a1120]/50">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="bg-transparent text-sm text-white font-medium outline-none placeholder:text-gray-600 w-full"
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMode('source')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all duration-200 ${
              mode === 'source'
                ? 'bg-[#1f2937] text-white'
                : 'text-gray-500 hover:text-gray-300 hover:bg-[#1f2937]/50'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Source
          </button>
          <button
            onClick={() => setMode('wysiwyg')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all duration-200 ${
              mode === 'wysiwyg'
                ? 'bg-[#1f2937] text-white'
                : 'text-gray-500 hover:text-gray-300 hover:bg-[#1f2937]/50'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            Visual
          </button>
        </div>
      </div>

      {/* Formatting toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-1.5 border-b border-[#1f2937] bg-[#0a1120]/30">
        {toolbarActions.map((action) => (
          <button
            key={action.label}
            onClick={action.action}
            title={action.label}
            className="p-1.5 rounded text-gray-500 hover:text-white hover:bg-[#1f2937] transition-all"
          >
            <action.icon className="w-3.5 h-3.5" />
          </button>
        ))}
        <div className="w-px h-4 bg-[#1f2937] mx-2" />
        <span className="text-[10px] text-gray-600 uppercase tracking-wider">
          {mode === 'source' ? 'Editing in Markdown' : 'Visual Editor'}
        </span>
      </div>

      {/* Editor area */}
      <div className="flex-1 overflow-hidden relative">
        <MDEditor
          value={content}
          onChange={(val) => onChange(val || '')}
          preview={mode === 'wysiwyg' ? 'live' : 'edit'}
          hideToolbar={true}
          height="100%"
          className="border-0 bg-transparent"
          textareaProps={{
            placeholder: 'Start writing...',
            style: {
              background: 'transparent',
              color: '#e5e7eb',
              fontFamily: "'JetBrains Mono', 'Menlo', monospace",
              fontSize: '14px',
              lineHeight: '1.7',
            },
          }}
        />

        {/* Floating bubble toolbar */}
        {showToolbar && mode === 'wysiwyg' && (
          <div
            className="fixed z-50 glass-panel rounded-lg px-2 py-1.5 flex items-center gap-1 shadow-xl"
            style={{
              left: toolbarPos.x,
              top: toolbarPos.y,
              transform: 'translateX(-50%)',
            }}
          >
            <button
              onClick={() => {
                insertMarkdown('**', '**');
                setShowToolbar(false);
              }}
              className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-[#1f2937] transition-all"
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                insertMarkdown('*', '*');
                setShowToolbar(false);
              }}
              className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-[#1f2937] transition-all"
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                insertMarkdown('`', '`');
                setShowToolbar(false);
              }}
              className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-[#1f2937] transition-all"
              title="Code"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                insertMarkdown('[', '](url)');
                setShowToolbar(false);
              }}
              className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-[#1f2937] transition-all"
              title="Link"
            >
              <Link className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1.5 border-t border-[#1f2937] bg-[#0a1120]/30">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-600">
            {content.split(/\s+/).filter(Boolean).length} words
          </span>
          <span className="text-[10px] text-gray-600">
            {content.length} chars
          </span>
        </div>
        <span className="text-[10px] text-gray-600">
          {mode === 'source' ? 'Markdown' : 'Rich Text'}
        </span>
      </div>
    </div>
  );
}
