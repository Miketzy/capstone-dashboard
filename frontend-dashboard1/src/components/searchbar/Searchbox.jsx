import React from "react";
import { IoSearch } from "react-icons/io5";
import "./searchbar.css";

function SearchBox() {
  return (
    <div className="searchBox">
      <IoSearch />
      <input type="text" className="searchInput" placeholder="Search here..." />
    </div>
  );
}

export default SearchBox;
