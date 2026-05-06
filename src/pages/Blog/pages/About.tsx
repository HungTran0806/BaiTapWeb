import React from 'react';
import { Card, Avatar, Tag, Space, Divider } from 'antd';
import { UserOutlined, GithubOutlined, LinkedinOutlined, TwitterOutlined, MailOutlined } from '@ant-design/icons';
import { mockAuthor } from '@/models/blog';

const About: React.FC = () => {
  const author = mockAuthor;

  return (
    <div style={{ padding: '20px', maxWidth: 800, margin: '0 auto' }}>
      <Card style={{ textAlign: 'center' }}>
        <Avatar
          size={120}
          icon={<UserOutlined />}
          src={author.avatar}
          style={{ marginBottom: 24 }}
        />

        <h1 style={{ marginBottom: 8 }}>{author.name}</h1>

        <p style={{ fontSize: 16, color: '#666', marginBottom: 24 }}>
          {author.bio}
        </p>

        <Divider orientation="left">Kỹ năng</Divider>
        <div style={{ marginBottom: 24 }}>
          <Space wrap>
            {author.skills.map((skill, index) => (
              <Tag key={index} color="blue" style={{ fontSize: 14 }}>
                {skill}
              </Tag>
            ))}
          </Space>
        </div>

        <Divider orientation="left">Liên kết</Divider>
        <Space size="large">
          {author.socialLinks.github && (
            <a
              href={author.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#333' }}
            >
              <GithubOutlined style={{ fontSize: 24 }} />
            </a>
          )}
          {author.socialLinks.linkedin && (
            <a
              href={author.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#0077b5' }}
            >
              <LinkedinOutlined style={{ fontSize: 24 }} />
            </a>
          )}
          {author.socialLinks.twitter && (
            <a
              href={author.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#1da1f2' }}
            >
              <TwitterOutlined style={{ fontSize: 24 }} />
            </a>
          )}
          {author.socialLinks.email && (
            <a
              href={`mailto:${author.socialLinks.email}`}
              style={{ color: '#ea4335' }}
            >
              <MailOutlined style={{ fontSize: 24 }} />
            </a>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default About;