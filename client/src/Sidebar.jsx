import CategoryList from "./Categories/CategoryList"
import NewCategoryForm from "./Categories/NewCategoryForm"

export default function Sidebar({data, selectedCategory, onSelectCategory, onAddCategory, onDeleteCategory, isOpen, onClose}) {
  return (
    <aside className={`category-sidebar ${isOpen ? 'is-open' : ''}`}>
      <div className="sidebar-heading">
      <button className="icon-btn sidebar-close" onClick={onClose} aria-label="Close categories">×</button>
        <h2>Categories</h2>
        <span className="count-chip">{data.length}</span>
      </div>
      <CategoryList data={data} selectedCategory={selectedCategory} onSelectCategory={(id) => { onSelectCategory(id); onClose(); }} onDeleteCategory={onDeleteCategory} />
      <NewCategoryForm onAddCategory={onAddCategory} />
    </aside>
  );
}