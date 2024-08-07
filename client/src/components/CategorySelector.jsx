import React from "react";
import styles from "./CategorySelector.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const categories = ["all", "sports", "music", "environment", "food"];

function CategorySelector({ selectedCategory, onCategoryChange }) {
  return (
    <div className={styles.categorySelector}>
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className={styles.select}
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </option>
        ))}
      </select>
      <FontAwesomeIcon icon={faChevronDown} className={styles.categoryIcon} />
    </div>
  );
}

export default CategorySelector;
