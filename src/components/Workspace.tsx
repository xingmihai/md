import { useState, useCallback, useRef } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Sidebar from './Sidebar';
import Editor from './Editor';
import type { Document } from '@/types';

interface WorkspaceProps {
  documents: Document[];
  activeId: string;
  activeDoc: Document;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
  onTitleUpdate: (id: string, title: string) => void;
}

export default function Workspace({
  documents,
  activeId,
  activeDoc,
  onSelect,
  onCreate,
  onRename,
  onDelete,
  onUpdate,
  onTitleUpdate,
}: WorkspaceProps) {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(260);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = sidebarWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [sidebarWidth]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current) return;
      const diff = e.clientX - startX.current;
      const newWidth = Math.max(180, Math.min(400, startWidth.current + diff));
      setSidebarWidth(newWidth);
    },
    []
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Attach global mouse listeners for drag
  useState(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  });

  return (
    <div className="flex h-screen w-screen bg-[#050b14] animate-fadeIn">
      {/* Top gradient bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 gradient-brand z-50" />

      {/* Sidebar toggle */}
      <button
        onClick={() => setSidebarVisible(!sidebarVisible)}
        className="fixed bottom-4 left-4 z-40 p-2 rounded-lg bg-[#0a1120] border border-[#1f2937] text-gray-500 hover:text-white hover:border-gray-600 transition-all"
        title={sidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
      >
        {sidebarVisible ? (
          <PanelLeftClose className="w-4 h-4" />
        ) : (
          <PanelLeftOpen className="w-4 h-4" />
        )}
      </button>

      {/* Sidebar */}
      {sidebarVisible && (
        <>
          <div
            className="shrink-0 h-full"
            style={{ width: sidebarWidth }}
          >
            <Sidebar
              documents={documents}
              activeId={activeId}
              onSelect={onSelect}
              onCreate={onCreate}
              onRename={onRename}
              onDelete={onDelete}
            />
          </div>
          {/* Resize handle */}
          <div
            onMouseDown={handleMouseDown}
            className="w-1 shrink-0 cursor-col-resize hover:bg-blue-500/30 transition-colors relative"
            style={{ background: 'transparent' }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-8 rounded-full bg-gray-700 hover:bg-blue-500/50 transition-colors" />
          </div>
        </>
      )}

      {/* Editor area */}
      <div className="flex-1 min-w-0 h-full">
        <Editor
          content={activeDoc.content}
          title={activeDoc.title}
          onChange={(value) => onUpdate(activeDoc.id, value)}
          onTitleChange={(title) => onTitleUpdate(activeDoc.id, title)}
        />
      </div>
    </div>
  );
}
