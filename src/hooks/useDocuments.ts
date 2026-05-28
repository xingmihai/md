import { useState, useCallback } from 'react';
import type { Document } from '@/types';

const INITIAL_DOCUMENTS: Document[] = [
  {
    id: '1',
    title: 'README.md',
    content: `# Welcome to Synapse

Synapse is a **modern Markdown editor** designed for developers and technical writers.

## Features

- \u2705 **WYSIWYG editing** - See your formatting as you type
- \u2705 **Source mode** - Edit raw Markdown with syntax highlighting
- \u2705 **File management** - Organize your documents in the sidebar
- \u2705 **Dark theme** - Easy on the eyes for long writing sessions

## Getting Started

1. Create a new document from the sidebar
2. Start writing in the editor
3. Toggle between **Visual** and **Source** modes

## Code Example

\`\`\`typescript
const greeting = "Hello, Synapse!";
console.log(greeting);
\`\`\`

## Links

- [Markdown Guide](https://www.markdownguide.org)
- [Synapse Docs](#)

> *Write. Preview. Publish.*
`,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: '2',
    title: 'todo-list.md',
    content: `# Todo List

## Today
- [ ] Review pull requests
- [ ] Update documentation
- [x] Fix sidebar styling

## This Week
- [ ] Add export functionality
- [ ] Implement search
- [ ] Keyboard shortcuts

## Notes
> Remember to test on different screen sizes!
`,
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 7200000,
  },
  {
    id: '3',
    title: 'project-ideas.md',
    content: `# Project Ideas

## Synapse Enhancements

### Phase 1
1. **Cloud sync** - Save documents to the cloud
2. **Collaboration** - Real-time editing with others
3. **Templates** - Pre-built document templates

### Phase 2
- Plugin system
- Custom themes
- API integration

## Random Ideas

| Priority | Idea | Status |
|----------|------|--------|
| High | Dark mode polish | Done |
| Medium | Export to PDF | Planned |
| Low | Mobile app | Backlog |
`,
    createdAt: Date.now() - 259200000,
    updatedAt: Date.now() - 18000000,
  },
];

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);
  const [activeId, setActiveId] = useState<string>('1');

  const activeDoc = documents.find((d) => d.id === activeId) || documents[0];

  const createDocument = useCallback(() => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title: 'untitled.md',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setDocuments((prev) => [newDoc, ...prev]);
    setActiveId(newDoc.id);
    return newDoc;
  }, []);

  const updateDocument = useCallback((id: string, updates: Partial<Document>) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates, updatedAt: Date.now() } : d))
    );
  }, []);

  const renameDocument = useCallback((id: string, title: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, title, updatedAt: Date.now() } : d))
    );
  }, []);

  const deleteDocument = useCallback(
    (id: string) => {
      setDocuments((prev) => {
        const filtered = prev.filter((d) => d.id !== id);
        if (activeId === id && filtered.length > 0) {
          setActiveId(filtered[0].id);
        }
        return filtered;
      });
    },
    [activeId]
  );

  return {
    documents,
    activeId,
    activeDoc,
    setActiveId,
    createDocument,
    updateDocument,
    renameDocument,
    deleteDocument,
  };
}
