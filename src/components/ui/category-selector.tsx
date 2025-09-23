"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"

interface Category {
  id: string
  name: string
}

interface CategorySelectorProps {
  categories: Category[]
  selectedCategoryId: string | null
  onCategorySelect: (categoryId: string | null) => void
}

export function CategorySelector({
  categories,
  selectedCategoryId,
  onCategorySelect
}: CategorySelectorProps) {
  const handleCategoryClick = (categoryId: string) => {
    // If clicking the already selected category, deselect it
    if (selectedCategoryId === categoryId) {
      onCategorySelect(null)
    } else {
      onCategorySelect(categoryId)
    }
  }

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-subtext-light dark:text-subtext-dark mb-2">
        Seleccionar Categoría
      </h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={selectedCategoryId === category.id ? "default" : "outline"}
            className={`cursor-pointer transition-colors ${
              selectedCategoryId === category.id
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "hover:bg-accent hover:text-accent-foreground"
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </Badge>
        ))}
        {categories.length === 0 && (
          <Badge variant="outline" className="text-gray-500">
            No hay categorías disponibles
          </Badge>
        )}
      </div>
    </div>
  )
}