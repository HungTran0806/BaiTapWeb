import React, { useState, useEffect } from 'react';
import { Button, Tag, Avatar, Row, Col, Divider } from 'antd';
import { ArrowLeftOutlined, UserOutlined, EyeOutlined, CalendarOutlined } from '@ant-design/icons';
import { mockPosts} from '@/models/blog';
import type { BlogPost } from '@/models/blog';
import PostCard from '../components/PostCard';

interface PostDetailProps {
  postSlug: string;
  onBack: () => void;
  onPostClick: (post: BlogPost) => void;
  onTagClick: (tagSlug: string) => void;
}

const PostDetail: React.FC<PostDetailProps> = ({
  postSlug,
  onBack,
  onPostClick,
  onTagClick,
}) => {
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    // Tìm bài viết theo slug
    const foundPost = mockPosts.find(p => p.slug === postSlug);
    if (foundPost) {
      // Tăng lượt xem
      foundPost.views += 1;
      setPost(foundPost);
    }
  }, [postSlug]);

  if (!post) {
    return <div>Bài viết không tồn tại</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Tìm bài viết liên quan (cùng tag, trừ bài hiện tại)
  const relatedPosts = mockPosts
    .filter(p =>
      p.id !== post.id &&
      p.status === 'published' &&
      p.tags.some(tag => post.tags.some(postTag => postTag.id === tag.id))
    )
    .slice(0, 3);

  // Chuyển đổi markdown thành HTML (đơn giản)
  const renderContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index}>{line.substring(2)}</h1>;
        } else if (line.startsWith('## ')) {
          return <h2 key={index}>{line.substring(3)}</h2>;
        } else if (line.startsWith('### ')) {
          return <h3 key={index}>{line.substring(4)}</h3>;
        } else if (line.startsWith('```')) {
          return <pre key={index}><code>{line}</code></pre>;
        } else if (line.trim() === '') {
          return <br key={index} />;
        } else {
          return <p key={index}>{line}</p>;
        }
      });
  };

  return (
    <div style={{ padding: '20px', maxWidth: 1000, margin: '0 auto' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={onBack}
        style={{ marginBottom: 16 }}
      >
        Quay lại
      </Button>

      <article>
        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, marginBottom: 16 }}>{post.title}</h1>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <Avatar
              size="large"
              icon={<UserOutlined />}
              src={post.author.avatar}
              style={{ marginRight: 12 }}
            />
            <div>
              <div style={{ fontWeight: 'bold' }}>{post.author.name}</div>
              <div style={{ color: '#666', fontSize: '14px' }}>
                <CalendarOutlined style={{ marginRight: 4 }} />
                {formatDate(post.createdAt)}
                <EyeOutlined style={{ marginLeft: 16, marginRight: 4 }} />
                {post.views} lượt xem
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            {post.tags.map((tag) => (
              <Tag
                key={tag.id}
                color={tag.color}
                style={{ marginRight: 8, cursor: 'pointer' }}
                onClick={() => onTagClick(tag.slug)}
              >
                {tag.name}
              </Tag>
            ))}
          </div>
        </header>

        <div style={{ marginBottom: 32 }}>
          <img
            src={post.coverImage}
            alt={post.title}
            style={{
              width: '100%',
              maxHeight: 400,
              objectFit: 'cover',
              borderRadius: 8,
              marginBottom: 24,
            }}
          />
        </div>

        <div
          style={{
            lineHeight: 1.8,
            fontSize: 16,
            color: '#333',
          }}
        >
          {renderContent(post.content)}
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <>
          <Divider />
          <h2 style={{ marginBottom: 24 }}>Bài viết liên quan</h2>
          <Row gutter={[16, 16]}>
            {relatedPosts.map((relatedPost) => (
              <Col key={relatedPost.id} xs={24} sm={12} md={8}>
                <PostCard
                  post={relatedPost}
                  onClick={onPostClick}
                  onTagClick={onTagClick}
                />
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
};

export default PostDetail;