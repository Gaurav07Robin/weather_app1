import React from 'react';
import './index.css'; // Import the CSS file for styling

const SearchBox = ({ placeholder, options, handleChange }) => (
  <div className="search-container">
    <input
      type="text"
      className="search"
      placeholder={placeholder}
      list="search-options"
      onChange={handleChange}
    />
    <datalist id="search-options">
      {options.map((option, index) => (
        <option key={index} value={option} />
      ))}
    </datalist>
  </div>
);

export default SearchBox;
