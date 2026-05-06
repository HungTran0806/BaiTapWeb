import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Tìm kiếm...',
  debounceMs = 300,
}) => {
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchValue, onSearch, debounceMs]);

  return (
    <Input
      placeholder={placeholder}
      prefix={<SearchOutlined />}
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      style={{ maxWidth: 400 }}
      allowClear
    />
  );
};

export default SearchBar;