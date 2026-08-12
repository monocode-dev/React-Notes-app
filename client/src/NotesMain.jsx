import NotesGrid from './Notes/NotesGrid'
import NoteModal from './Notes/NoteModal'

export default function NotesMain({data, filteredCategory, onOpenNewNoteModal, onOpenEditNoteModal, onCloseModal, modalMode, categories, selectedNote, onAddNote, onEditNote, onDeleteNote}) {
  return (
    <main className="notes-main">
      <div className="notes-toolbar">
        <div className="toolbar-label">
          <span className="eyebrow">Viewing</span>
          <h1>All Notes</h1>
        </div>
        <button className="btn btn-primary" onClick={onOpenNewNoteModal}>+ New note</button>
      </div>

      <NotesGrid data={data} 
                  filteredCategory={filteredCategory}
                  categories={categories}
                  onEditNote={onEditNote}
                  onDeleteNote={onDeleteNote}
                  onOpenNewNoteModal={onOpenNewNoteModal}
                  onOpenEditNoteModal={onOpenEditNoteModal} />

      <NoteModal data={data}
                  onCloseModal={onCloseModal}
                  modalMode={modalMode} 
                  categories={categories} 
                  onAddNote={onAddNote}
                  onEditNote={onEditNote}
                  selectedNote={selectedNote} />
    </main>
  );
}