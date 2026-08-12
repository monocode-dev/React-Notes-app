import NoteCard from "./NoteCard"

export default function NotesGrid({data, filteredCategory, categories, onEditNote, onDeleteNote, onOpenNewNoteModal, onOpenEditNoteModal}) {
  const filteredData = data.filter((note) => {
    if (filteredCategory === 'all') return true;
    return note.category_id == filteredCategory;
  });

  if (filteredData.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-title">Nothing filed here yet</p>
        <p className="empty-subtitle">Notes you add to this category will show up here.</p>
      </div>
    );
  }

  return (
    <div className="notes-grid">
      {filteredData.map((note) => {
        const cat = categories.find((c) => c.id === note.category_id);
        return (
          <NoteCard key={note.id}
                    id={note.id}
                    title={note.title}
                    category={note.category_id}
                    categoryTitle={cat?.title}
                    content={note.content}
                    onOpenEditNoteModal={onOpenEditNoteModal}
                    onDeleteNote={onDeleteNote}/>
        );
      })}
    </div>
  );
}