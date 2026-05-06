export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: Author;
  tags: Tag[];
  status: 'draft' | 'published';
  views: number;
  createdAt: string;
  updatedAt: string;
};

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  postCount: number;
  description?: string;
};

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  skills: string[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
};

export const mockAuthor: Author = {
  id: '1',
  name: 'Nguyễn Văn A',
  bio: 'Tôi là một lập trình viên full-stack với niềm đam mê về công nghệ và chia sẻ kiến thức.',
  avatar: 'https://via.placeholder.com/150',
  skills: ['React', 'Node.js', 'TypeScript', 'Python', 'Docker'],
  socialLinks: {
    github: 'https://github.com/username',
    linkedin: 'https://linkedin.com/in/username',
    twitter: 'https://twitter.com/username',
    email: 'contact@example.com',
  },
};

export const mockTags: Tag[] = [
  { id: '1', name: 'React', slug: 'react', color: '#61dafb', postCount: 5 },
  { id: '2', name: 'JavaScript', slug: 'javascript', color: '#f7df1e', postCount: 8 },
  { id: '3', name: 'TypeScript', slug: 'typescript', color: '#3178c6', postCount: 3 },
  { id: '4', name: 'Node.js', slug: 'nodejs', color: '#339933', postCount: 4 },
  { id: '5', name: 'CSS', slug: 'css', color: '#1572b6', postCount: 6 },
];

export const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Bắt đầu với React Hooks',
    slug: 'bat-dau-voi-react-hooks',
    content: `# Bắt đầu với React Hooks

React Hooks là một tính năng mới được giới thiệu trong React 16.8, cho phép bạn sử dụng state và các tính năng khác của React mà không cần viết class component.

## useState Hook

\`\`\`jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Bạn đã click {count} lần</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## useEffect Hook

\`\`\`jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## Kết luận

React Hooks giúp code trở nên clean hơn và dễ hiểu hơn. Hãy bắt đầu sử dụng chúng trong dự án của bạn!`,
    excerpt: 'React Hooks là một tính năng mới được giới thiệu trong React 16.8, cho phép bạn sử dụng state và các tính năng khác của React mà không cần viết class component.',
    coverImage: 'https://via.placeholder.com/400x250/61dafb/ffffff?text=React+Hooks',
    author: mockAuthor,
    tags: [mockTags[0], mockTags[1]],
    status: 'published',
    views: 1250,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'TypeScript cho người mới bắt đầu',
    slug: 'typescript-cho-nguoi-moi-bat-dau',
    content: `# TypeScript cho người mới bắt đầu

TypeScript là một superset của JavaScript, cung cấp type checking tĩnh và các tính năng OOP mạnh mẽ.

## Cài đặt TypeScript

\`\`\`bash
npm install -g typescript
\`\`\`

## Basic Types

\`\`\`typescript
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";
let list: number[] = [1, 2, 3];
\`\`\`

## Interfaces

\`\`\`typescript
interface User {
  name: string;
  age: number;
}

function greet(user: User) {
  return \`Hello, \${user.name}!\`;
}
\`\`\`

## Kết luận

TypeScript giúp code JavaScript trở nên an toàn và dễ maintain hơn. Hãy thử sử dụng nó trong dự án tiếp theo của bạn!`,
    excerpt: 'TypeScript là một superset của JavaScript, cung cấp type checking tĩnh và các tính năng OOP mạnh mẽ.',
    coverImage: 'https://via.placeholder.com/400x250/3178c6/ffffff?text=TypeScript',
    author: mockAuthor,
    tags: [mockTags[2], mockTags[1]],
    status: 'published',
    views: 890,
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
  },
  {
    id: '3',
    title: 'CSS Grid Layout - Hướng dẫn hoàn chỉnh',
    slug: 'css-grid-layout-huong-dan-hoan-chinh',
    content: `# CSS Grid Layout - Hướng dẫn hoàn chỉnh

CSS Grid Layout là một hệ thống layout hai chiều mạnh mẽ cho web, cho phép bạn tạo ra các layout phức tạp một cách dễ dàng.

## Grid Container

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: 100px 200px;
  gap: 20px;
}
\`\`\`

## Grid Items

\`\`\`css
.item1 {
  grid-column: 1 / 3;
  grid-row: 1;
}

.item2 {
  grid-column: 3;
  grid-row: 1 / 3;
}
\`\`\`

## Grid Areas

\`\`\`css
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-rows: 100px 1fr 100px;
  grid-template-columns: 200px 1fr 1fr;
}
\`\`\`

## Kết luận

CSS Grid Layout là công cụ mạnh mẽ cho việc tạo layout web hiện đại. Hãy khám phá và sử dụng nó trong các dự án của bạn!`,
    excerpt: 'CSS Grid Layout là một hệ thống layout hai chiều mạnh mẽ cho web, cho phép bạn tạo ra các layout phức tạp một cách dễ dàng.',
    coverImage: 'https://via.placeholder.com/400x250/1572b6/ffffff?text=CSS+Grid',
    author: mockAuthor,
    tags: [mockTags[4]],
    status: 'published',
    views: 650,
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z',
  },
];