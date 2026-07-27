import { useMemo, useState } from 'react'

/**
 * Generic client-side search + filter + pagination hook.
 * @param {Array} items - full list of items
 * @param {Function} searchPredicate - (item, query) => boolean
 * @param {Object} options - { pageSize }
 */
export function useListControls(items, searchPredicate, { pageSize = 6 } = {}) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({})
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = items || []
    if (query.trim()) {
      result = result.filter((item) => searchPredicate(item, query.trim().toLowerCase()))
    }
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((item) => String(item[key]) === String(value))
      }
    })
    return result
  }, [items, query, filters, searchPredicate])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const updateQuery = (value) => {
    setQuery(value)
    setPage(1)
  }

  return {
    query,
    setQuery: updateQuery,
    filters,
    setFilter: updateFilter,
    page: currentPage,
    setPage,
    totalPages,
    filteredCount: filtered.length,
    items: paginated,
  }
}
