import React from 'react';
import { Tag, Space } from 'antd';
import type { Tag as TagType } from '@/models/blog';

interface TagFilterProps {
  tags: TagType[];
  selectedTag?: string;
  onTagSelect: (tagSlug?: string) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTag, onTagSelect }) => {
  return (
    <Space wrap style={{ marginBottom: 16 }}>
      <Tag
        style={{
          cursor: 'pointer',
          backgroundColor: !selectedTag ? '#1890ff' : '#f0f0f0',
          color: !selectedTag ? '#fff' : '#000',
        }}
        onClick={() => onTagSelect(undefined)}
      >
        Tất cả ({tags.reduce((sum, tag) => sum + tag.postCount, 0)})
      </Tag>
      {tags.map((tag) => (
        <Tag
          key={tag.id}
          style={{
            cursor: 'pointer',
            backgroundColor: selectedTag === tag.slug ? tag.color : '#f0f0f0',
            color: selectedTag === tag.slug ? '#fff' : '#000',
          }}
          onClick={() => onTagSelect(tag.slug)}
        >
          {tag.name} ({tag.postCount})
        </Tag>
      ))}
    </Space>
  );
};

export default TagFilter;