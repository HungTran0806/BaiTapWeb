import React from 'react';
import { Card, Tag, Avatar } from 'antd';
import { UserOutlined, EyeOutlined } from '@ant-design/icons';
import { BlogPost } from '@/models/blog';

interface PostCardProps {
  post: BlogPost;
  onClick: (post: BlogPost) => void;
  onTagClick: (tagSlug: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick, onTagClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card
      hoverable
      cover={
        <img
          alt={post.title}
          src={post.coverImage}
          style={{ height: 200, objectFit: 'cover' }}
        />
      }
      onClick={() => onClick(post)}
      style={{ height: '100%', cursor: 'pointer' }}
    >
      <Card.Meta
        title={post.title}
        description={
          <div>
            <p style={{ marginBottom: 8, color: '#666' }}>
              {post.excerpt}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <Avatar
                size="small"
                icon={<UserOutlined />}
                src={post.author.avatar}
                style={{ marginRight: 8 }}
              />
              <span style={{ fontSize: '12px', color: '#999' }}>
                {post.author.name} • {formatDate(post.createdAt)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                {post.tags.map((tag) => (
                  <Tag
                    key={tag.id}
                    color={tag.color}
                    style={{ marginBottom: 4, cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTagClick(tag.slug);
                    }}
                  >
                    {tag.name}
                  </Tag>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: '#999' }}>
                <EyeOutlined style={{ marginRight: 4 }} />
                {post.views}
              </div>
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default PostCard;