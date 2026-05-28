import { useState, useCallback } from 'react';
import NetworkMeshBackground from './components/NetworkMeshBackground';
import AuthCard from './components/AuthCard';
import Workspace from './components/Workspace';
import { useDocuments } from './hooks/useDocuments';
import type { ViewMode } from './types';

export default function App() {
  const [view, setView] = useState<ViewMode>('connect');
  const {
    documents,
    activeId,
    activeDoc,
    setActiveId,
    createDocument,
    updateDocument,
    renameDocument,
    deleteDocument,
  } = useDocuments();

  const handleConnect = useCallback(() => {
    setView('workspace');
  }, []);

  const handleUpdateContent = useCallback(
    (id: string, content: string) => {
      updateDocument(id, { content });
    },
    [updateDocument]
  );

  const handleUpdateTitle = useCallback(
    (id: string, title: string) => {
      updateDocument(id, { title });
    },
    [updateDocument]
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050b14]">
      {/* Background - always rendered for smooth transition */}
      <NetworkMeshBackground />

      {/* Connect View */}
      {view === 'connect' && (
        <div className="relative z-10 animate-fadeIn">
          <AuthCard onConnect={handleConnect} />
        </div>
      )}

      {/* Workspace View */}
      {view === 'workspace' && (
        <div className="relative z-10 animate-slideUp">
          <Workspace
            documents={documents}
            activeId={activeId}
            activeDoc={activeDoc}
            onSelect={setActiveId}
            onCreate={createDocument}
            onRename={renameDocument}
            onDelete={deleteDocument}
            onUpdate={handleUpdateContent}
            onTitleUpdate={handleUpdateTitle}
          />
        </div>
      )}
    </div>
  );
}
