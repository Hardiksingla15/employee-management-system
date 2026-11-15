export default function SearchBar({ value, onChange, onSearch }) {
  function handleSubmit(event) {
    event.preventDefault();
    onSearch(value.trim());
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <label htmlFor="employee-search">Search by first name</label>
      <div className="search-bar__row">
        <input
          id="employee-search"
          type="search"
          placeholder="Enter a first name"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button className="btn" type="submit">
          Search
        </button>
      </div>
    </form>
  );
}
