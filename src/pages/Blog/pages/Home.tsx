import React, { useState, useMemo } from 'react';
import { Row, Col, Pagination, Empty } from 'antd';
import { mockPosts, mockTags, BlogPost } from '@/models/blog';
import PostCard from '../components/PostCard';
import TagFilter from '../components/TagFilter';
import SearchBar from '../components/SearchBar';

const Home: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState<string>();
  const [searchQuery, setSearchQuery] = useState('');
  const postsPerPage = 9;

  const filteredPosts = useMemo(() => {
    let filtered = mockPosts.filter(post => post.status === 'published');

    if (selectedTag) {
      filtered = filtered.filter(post =>
        post.tags.some(tag => tag.slug === selectedTag)
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.name.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [selectedTag, searchQuery]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const handlePostClick = (post: BlogPost) => {
    // Tăng lượt xem
    post.views += 1;
    // Chuyển đến trang chi tiết
    window.location.href = `/blog/post/${post.slug}`;
  };

  const handleTagClick = (tagSlug: string) => {
    setSelectedTag(tagSlug);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ padding: '20px', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 32 }}>Blog Cá Nhân</h1>

      <div style={{ marginBottom: 24 }}>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Tìm kiếm bài viết..."
        />
      </div>

      <TagFilter
        tags={mockTags}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
      />

      {currentPosts.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {currentPosts.map((post) => (
              <Col key={post.id} xs={24} sm={12} md={8}>
                <PostCard
                  post={post}
                  onClick={handlePostClick}
                  onTagClick={handleTagClick}
                />
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Pagination
                current={currentPage}
                total={filteredPosts.length}
                pageSize={postsPerPage}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      ) : (
        <Empty
          description="Không tìm thấy bài viết nào"
          style={{ marginTop: 64 }}
        />
      )}
    </div>
  );
};

export default Home;