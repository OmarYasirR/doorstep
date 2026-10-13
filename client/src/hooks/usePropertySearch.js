import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';

export function usePropertySearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/properties', { params: Object.fromEntries(searchParams) });
      setProperties(data.properties);
      setTotal(data.total);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load properties. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // Debounced so rapid filter changes produce one request
  useEffect(() => {
    const t = setTimeout(fetchProperties, 300);
    return () => clearTimeout(t);
  }, [fetchProperties]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === null || value === '' || value === undefined) next.delete(key);
    else next.set(key, value);
    next.set('page', '1');
    setSearchParams(next);
  };

  return { properties, total, loading, error, searchParams, updateFilter, setSearchParams };
}
