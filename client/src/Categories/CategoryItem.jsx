import getCategoryColor from '../categoryColor'

export default function CategoryItem({id, title, isActive, onSelectCategory, onDeleteCategory}) {
  const color = getCategoryColor(id);
  return (
    <li className={`category-item ${isActive ? 'is-active' : ''}`} style={{ '--cat-color': color }}>
      <button className="category-tab" onClick={onSelectCategory}>
        <span className="tab-dot" aria-hidden="true"></span>
        <span className="tab-label">{title}</span>
      </button>
      <button className="category-delete-btn" onClick={() => onDeleteCategory(id)} aria-label={`Delete ${title}`}>×</button>
    </li>
  );
}