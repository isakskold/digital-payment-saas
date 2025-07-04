"use client";

import { useState, useEffect, useRef } from "react";

type Category = {
  id: string;
  name: string;
};

type MenuTabsProps = {
  categories: Category[];
};

export default function MenuTabs({ categories }: MenuTabsProps) {
  const [activeCategory, setActiveCategory] = useState<string>(
    categories[0]?.id || ""
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLAnchorElement>(null);
  const isUserScrolling = useRef(false);

  // Handle smooth scrolling when clicking on tabs
  const handleTabClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    categoryId: string
  ) => {
    e.preventDefault();

    // Set a flag to indicate this change was from a user click
    isUserScrolling.current = true;
    setActiveCategory(categoryId);

    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Update URL without causing a jump
      window.history.pushState(null, "", `#${categoryId}`);

      // Reset the flag after scrolling completes
      setTimeout(() => {
        isUserScrolling.current = false;
      }, 1000);
    }
  };

  // Scroll active tab into view in the horizontal tabs container
  const scrollActiveTabIntoView = () => {
    // Skip if this was triggered by a user clicking a tab
    if (isUserScrolling.current) return;

    if (activeTabRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const tab = activeTabRef.current;

      // Calculate positions
      const containerRect = container.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();

      // Check if the tab is not fully visible
      const isTabLeftHidden = tabRect.left < containerRect.left;
      const isTabRightHidden = tabRect.right > containerRect.right;

      if (isTabLeftHidden) {
        // Scroll to make the tab visible on the left
        container.scrollLeft += tabRect.left - containerRect.left - 16; // Extra padding
      } else if (isTabRightHidden) {
        // Scroll to make the tab visible on the right
        container.scrollLeft += tabRect.right - containerRect.right + 16; // Extra padding
      }
    }
  };

  // Update active tab on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Don't process scroll events triggered by clicking a tab
      if (isUserScrolling.current) return;

      const categoryElements = categories
        .map((cat) => ({
          id: cat.id,
          element: document.getElementById(cat.id),
        }))
        .filter((item) => item.element !== null);

      if (categoryElements.length === 0) return;

      // Find the category that is currently most visible in the viewport
      let mostVisibleCategory = categoryElements[0].id;
      let maxVisibleHeight = 0;

      categoryElements.forEach(({ id, element }) => {
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const visibleHeight =
          Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 100); // Account for header height

        if (visibleHeight > maxVisibleHeight) {
          maxVisibleHeight = visibleHeight;
          mostVisibleCategory = id;
        }
      });

      if (mostVisibleCategory !== activeCategory) {
        setActiveCategory(mostVisibleCategory);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories, activeCategory]);

  // Scroll active tab into view whenever it changes, but only from user scrolling
  useEffect(() => {
    scrollActiveTabIntoView();
  }, [activeCategory]);

  return (
    <div
      className="sticky top-[50px] md:top-[60px] z-30 bg-gray-100 border-b"
      style={{ position: "sticky" }}
    >
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto py-2 md:py-3 mt-2 scroll-smooth"
      >
        <div className="flex gap-0.5 min-w-max">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              onClick={(e) => handleTabClick(e, category.id)}
              ref={activeCategory === category.id ? activeTabRef : null}
              className={`py-1.5 md:py-2 px-4 md:px-6 rounded-md text-sm md:text-base font-medium transition-colors whitespace-nowrap
                ${
                  activeCategory === category.id
                    ? "bg-[var(--primary-color)] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }
              `}
            >
              {category.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
