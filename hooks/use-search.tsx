"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"

interface Product {
  id: number | string
  name: string
  category: string
  price: number
  image: string
}

export function useSearch(products: Product[]) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(query)
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Perform search when query changes
  useEffect(() => {
    if (!query) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    const lowerCaseQuery = query.toLowerCase()

    const results = products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerCaseQuery) || product.category.toLowerCase().includes(lowerCaseQuery),
    )

    setSearchResults(results)
    setIsSearching(false)
  }, [query, products])

  // Update URL when search query changes
  const handleSearch = useCallback(
    (newQuery: string) => {
      setSearchQuery(newQuery)

      const params = new URLSearchParams(searchParams.toString())

      if (newQuery) {
        params.set("q", newQuery)
      } else {
        params.delete("q")
      }

      router.push(`/recherche?${params.toString()}`)
    },
    [router, searchParams],
  )

  return {
    query,
    searchQuery,
    searchResults,
    isSearching,
    handleSearch,
    setSearchQuery,
  }
}
