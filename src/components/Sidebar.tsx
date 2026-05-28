import { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Search,
  Plus,
  MoreVertical,
  Trash2,
  Edit3,
  Clock,
  X,
} from 'lucide-react';
import type { Document } from '@/types';

interface SidebarProps {
  documents: Document[];
  activeId: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export default function Sidebar({
  documents,
  activeId,
  onSelect,
  onCreate,
  onRename,
  onDelete,
}: SidebarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    docId: string;
  } | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const renameRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renamingId && renameRef.current) {
      renameRef.current.focus();
      renameRef.current.select();
    }
  }, [renamingId]);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    function handleClickOutside() {
      setContextMenu(null);
    }
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  const filteredDocs = searchQuery
    ? documents.filter(
        (d) =>
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : documents;

  const handleContextMenu = (e: React.MouseEvent, docId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, docId });
  };

  const startRename = (doc: Document) => {
    setRenamingId(doc.id);
    setRenameValue(doc.title);
    setContextMenu(null);
  };

  const confirmRename = () => {
    if (renamingId && renameValue.trim()) {
      onRename(renamingId, renameValue.trim());
    }
    setRenamingId(null);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return 'now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0a1120] border-r border-[#1f2937]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-[#1f2937]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md gradient-brand flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Files
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setSearchOpen(!searchOpen);
              if (searchOpen) setSearchQuery('');
            }}
            className="p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-[#1f2937] transition-all"
          >
            {searchOpen ? <X className="w-3.5 h-3.5" /> : <Search className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onCreate}
            className="p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-[#1f2937] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="px-3 py-2 border-b border-[#1f2937]">
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full bg-[#050b14] text-white text-xs px-3 py-2 rounded border border-[#1f2937] focus:border-blue-500/50 outline-none placeholder:text-gray-600 transition-all"
          />
        </div>
      )}

      {/* Document list */}
      <div className="flex-1 overflow-y-auto scrollbar-dark">
        {filteredDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-600">
            <Search className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-xs">No files found</p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelect(doc.id)}
              onContextMenu={(e) => handleContextMenu(e, doc.id)}
              className={`group flex items-center gap-2.5 px-3 py-2.5 cursor-pointer transition-all duration-150 border-l-2 ${
                doc.id === activeId
                  ? 'bg-[#111827] border-l-blue-500'
                  : 'border-l-transparent hover:bg-[#0d1525]'
              }`}
            >
              <FileText
                className={`w-4 h-4 shrink-0 ${
                  doc.id === activeId ? 'text-blue-400' : 'text-gray-600'
                }`}
              />
              <div className="flex-1 min-w-0">
                {renamingId === doc.id ? (
                  <input
                    ref={renameRef}
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={confirmRename}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') confirmRename();
                      if (e.key === 'Escape') setRenamingId(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-[#050b14] text-white text-xs px-2 py-1 rounded border border-blue-500/50 outline-none"
                  />
                ) : (
                  <>
                    <p
                      className={`text-xs truncate ${
                        doc.id === activeId ? 'text-white' : 'text-gray-400'
                      }`}
                    >
                      {doc.title}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock className="w-2.5 h-2.5 text-gray-600" />
                      <span className="text-[10px] text-gray-600">
                        {formatTime(doc.updatedAt)}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleContextMenu(e, doc.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-600 hover:text-white hover:bg-[#1f2937] transition-all"
              >
                <MoreVertical className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* New file button */}
      <div className="px-3 py-2 border-t border-[#1f2937]">
        <button
          onClick={onCreate}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-md text-xs text-gray-500 hover:text-white hover:bg-[#1f2937] transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          New Document
        </button>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          className="fixed z-50 glass-panel rounded-lg py-1 w-40 shadow-xl"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => {
              const doc = documents.find((d) => d.id === contextMenu.docId);
              if (doc) startRename(doc);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-[#1f2937] transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Rename
          </button>
          <button
            onClick={() => {
              onDelete(contextMenu.docId);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
