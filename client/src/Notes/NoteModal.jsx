import { useState, useEffect } from "react";

export default function NoteModal({onCloseModal, modalMode, categories, onAddNote, onEditNote, selectedNote}) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')

  useEffect(()=>{
    if(modalMode === 'new'){
      setTitle('');
      setCategory('');
      setContent('');

    }else if(modalMode === 'edit'){
      setTitle(selectedNote.title || '');
      setContent(selectedNote.content || '');
    }
  }, [selectedNote, modalMode])

  function handleSubmit(e){
    e.preventDefault();
    onAddNote({title: title, category: Number(category), content: content});
    onCloseModal();
  };

  function handleEditSubmit(e){
    e.preventDefault();
    onEditNote({id: selectedNote.id, title: title, content: content});
    onCloseModal();
  }
  
    return (
    <>
      {modalMode === null ? null : (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{modalMode === 'new' ? 'New note' : 'Edit note'}</h2>
              <button className="icon-btn" onClick={onCloseModal}>×</button>
            </div>
            <form className="modal-form" onSubmit={modalMode === 'new' ? handleSubmit : handleEditSubmit}>
              <label>Title</label>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />

              {modalMode === 'new' && (
                <>
                  <label>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="" disabled>Choose a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.title}</option>
                    ))}
                  </select>
                </>
              )}

              <label>Content</label>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
              ></textarea>

              <div className="modal-actions">
                <div className="modal-actions-right">
                  <button type="button" className="btn btn-ghost" onClick={onCloseModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save note</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}