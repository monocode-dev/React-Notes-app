import CategoryItem from "./CategoryItem"

export default function CategoryList({data, selectedCategory, onSelectCategory, onDeleteCategory}) {
  return (
    <ul className="category-list">
      <li className={`category-item ${selectedCategory === 'all' ? 'is-active' : ''}`} style={{ '--cat-color': '#8A7F6C' }}>
        <button className="category-tab" onClick={() => onSelectCategory('all')}>
          <span className="tab-dot" aria-hidden="true"></span>
          <span className="tab-label">All notes</span>
        </button>
      </li>
      {data.map((category) => (
        <CategoryItem 
          key={category.id} 
          id={category.id} 
          title={category.title} 
          isActive={selectedCategory === category.id}
          onSelectCategory={() => onSelectCategory(category.id)} 
          onDeleteCategory={onDeleteCategory} />
      ))}
    </ul>
  );
}