import { useState } from 'react';

export default function NewCategoryForm({onAddCategory}) {
  const [title, setTitle] = useState('');

  function handleSubmit(e){
    e.preventDefault();
    onAddCategory(title);
    setTitle('');
  }

  return (
    <form className="new-category-form" onSubmit={handleSubmit}>
      <input 
        type="text"
        className="new-category-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New category…"
        maxLength="24"
      />
      <button type="submit" className="btn btn-brass btn-icon">+</button>
    </form>
  );
}