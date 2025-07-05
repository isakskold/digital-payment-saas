"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Handle search functionality
  useEffect(() => {
    // Skip if search term is empty
    if (!searchTerm.trim()) {
      // Show all menu items
      resetSearch();
      return;
    }

    setIsSearching(true);

    // Get all menu items
    const menuItems = document.querySelectorAll(".menu-item");

    // First hide all items
    menuItems.forEach((item) => {
      (item as HTMLElement).style.display = "none";
    });

    // Hide all category sections initially
    const categorySections = document.querySelectorAll(".category-section");
    categorySections.forEach((section) => {
      (section as HTMLElement).style.display = "none";
    });

    // Track which categories have matches
    const categoriesWithMatches = new Set<string>();

    // Show only matching items
    menuItems.forEach((item) => {
      const itemElement = item as HTMLElement;
      const textContent = itemElement.textContent?.toLowerCase() || "";
      const searchTermLower = searchTerm.toLowerCase();

      // Check if the menu item contains the search term
      if (textContent.includes(searchTermLower)) {
        itemElement.style.display = "block";

        // Find the parent category section and mark it as having matches
        let parent = itemElement.parentElement;
        while (parent && !parent.classList.contains("category-section")) {
          parent = parent.parentElement;
        }

        if (parent) {
          const categoryId = parent.id;
          categoriesWithMatches.add(categoryId);
          (parent as HTMLElement).style.display = "block";
        }
      }
    });

    // If no results at all, show a "no results" message
    if (categoriesWithMatches.size === 0) {
      // Could add a "no results" message element if desired
      console.log("No results found");
    }
  }, [searchTerm]);

  // Reset search function to show all items
  const resetSearch = () => {
    if (!isSearching) return; // Skip if we're not in search mode
    setIsSearching(false);

    // Show all menu items
    const menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach((item) => {
      (item as HTMLElement).style.display = "block";
    });

    // Show all category sections
    const categorySections = document.querySelectorAll(".category-section");
    categorySections.forEach((section) => {
      (section as HTMLElement).style.display = "block";
    });
  };

  // Clear search field
  const clearSearch = () => {
    setSearchTerm("");
    resetSearch();
  };

  return (
    <div className="relative flex-1 max-w-xs md:max-w-sm">
      <input
        type="text"
        placeholder="Sök i menyn..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full py-1.5 md:py-2 px-3 pr-8 border border-gray-300 rounded-md text-sm md:text-base bg-white"
      />
      {searchTerm ? (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <FiX className="h-4 w-4 md:h-5 md:w-5" />
        </button>
      ) : (
        <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5" />
      )}
    </div>
  );
}
