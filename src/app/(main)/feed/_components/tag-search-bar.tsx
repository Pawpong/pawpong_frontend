'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from 'use-debounce';

import { useSearchTags } from '../_hooks/use-feed';

interface TagSearchBarProps {
  onTagSelect: (tag: string) => void;
  selectedTags: string[];
}

/**
 * Pawpong 태그 검색 바
 */
export function TagSearchBar({ onTagSelect, selectedTags }: TagSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const { data: tagsData } = useSearchTags(debouncedQuery);

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      return;
    }
    onTagSelect(tag);
    setSearchQuery('');
  };

  const handleRemoveTag = (tag: string) => {
    onTagSelect(tag);
  };

  return (
    <div className="w-full">
      {/* 검색 입력 */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a0a0a0]" />
        <input
          type="text"
          placeholder="태그 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#cccccc] rounded-full focus:outline-none focus:border-[#4f3b2e] transition-colors"
        />
      </div>

      {/* 선택된 태그들 */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleRemoveTag(tag)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#a0c8f4] text-sm text-white font-medium rounded-full hover:bg-[#77b2f3] transition-colors"
            >
              <span>#{tag}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      )}

      {/* 검색 결과 */}
      {searchQuery && tagsData?.data.tags && tagsData.data.tags.length > 0 && (
        <div className="bg-white border border-[#cccccc] rounded-lg shadow-lg overflow-hidden">
          {tagsData.data.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="w-full text-left px-4 py-3 text-sm text-[#4f3b2e] hover:bg-[#f6f6ea] transition-colors border-b border-[#e1e1e1] last:border-b-0"
              disabled={selectedTags.includes(tag)}
            >
              <span className="font-medium">#{tag}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
