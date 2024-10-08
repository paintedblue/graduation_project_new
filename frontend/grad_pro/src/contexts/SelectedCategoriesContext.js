// SelectedCategoriesContext.js
import React, { createContext, useState } from 'react';

// 기본 카테고리 상태
const defaultCategories = {
  likeFood: false,
  likeAnimalOrCharacter: false,
  likeColor: false,
};

// 컨텍스트 생성
export const SelectedCategoriesContext = createContext();

// Provider 컴포넌트 생성
export const SelectedCategoriesProvider = ({ children }) => {
  const [selectedCategories, setSelectedCategories] = useState(defaultCategories);

  // 카테고리 상태 업데이트 함수
  const updateCategory = (category) => {
    setSelectedCategories(prevCategories => ({
      ...prevCategories,
      [category]: true,  // 해당 카테고리의 값을 true로 설정
    }));
  };

  return (
    <SelectedCategoriesContext.Provider
      value={{
        selectedCategories,
        updateCategory,
      }}
    >
      {children}
    </SelectedCategoriesContext.Provider>
  );
};
