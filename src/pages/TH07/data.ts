export interface Tag {
    id: string;
    name: string;
    color: string;
}

export interface Post {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string; // Markdown content
    date: string;
    author: string;
    authorAvatar: string;
    tags: string[]; // array of Tag IDs
    coverImage: string;
    views: number;
    status: 'draft' | 'published';
}

export const initialTags: Tag[] = [
    { id: 't1', name: 'React', color: 'blue' },
    { id: 't2', name: 'JavaScript', color: 'gold' },
    { id: 't3', name: 'Frontend', color: 'green' },
    { id: 't4', name: 'Design', color: 'magenta' },
    { id: 't5', name: 'Ant Design', color: 'cyan' },
];

export const initialPosts: Post[] = [
    {
        id: 'p1',
        title: 'Bắt đầu với React và TypeScript',
        slug: 'bat-dau-voi-react-typescript',
        summary: 'Hướng dẫn cơ bản để khởi tạo dự án React sử dụng TypeScript, một sự kết hợp tuyệt vời cho các dự án lớn.',
        content: `
# Bắt đầu với React và TypeScript

TypeScript ngày càng trở nên phổ biến trong thế giới Frontend. Nó giúp bạn bắt lỗi ngay từ lúc viết mã thay vì lúc chạy.

## 1. Khởi tạo dự án
Sử dụng Create React App hoặc Vite:
\`\`\`bash
npm create vite@latest my-app -- --template react-ts
\`\`\`

## 2. Vì sao nên dùng TypeScript?
- **Tự động gợi ý code** (Autocomplete).
- **Dễ dàng bảo trì** trong các project có quy mô lớn.
- Phát hiện lỗi ngớ ngẩn (như sai type).
        `,
        date: '2023-10-01',
        author: 'Nguyễn Văn A',
        authorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
        tags: ['t1', 't2', 't3'],
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        views: 125,
        status: 'published',
    },
    {
        id: 'p2',
        title: 'Thiết kế giao diện đẹp với Ant Design',
        slug: 'thiet-ke-giao-dien-ant-design',
        summary: 'Ant Design là thư viện UI hàng đầu cho React. Hãy cùng khám phá cách tạo giao diện mượt mà và đẹp mắt.',
        content: `
# Tại sao lại là Ant Design?

Ant Design được xây dựng bởi Alibaba, mang đến hàng loạt component chuẩn doanh nghiệp. Không chỉ tối ưu cho người mới bắt đầu mà còn siêu tùy biến cho chuyên gia.

## Ví trí của Antd
Bạn sẽ thường thấy Ant Design trong các Dashboard, hệ thống ERP...

### Lợi ích chính:
1. Giao diện chuyên nghiệp.
2. Tài liệu siêu đầy đủ.
3. Cộng đồng lớn mạnh.
        `,
        date: '2023-10-05',
        author: 'Trần Thị B',
        authorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        tags: ['t1', 't3', 't5'],
        coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        views: 340,
        status: 'published',
    },
    {
        id: 'p3',
        title: 'Học JavaScript cho người mới',
        slug: 'hoc-javascript-cho-nguoi-moi',
        summary: 'Khái niệm cốt lõi của JavaScript giúp bạn nâng cao kỹ năng lập trình web một cách nhanh chóng.',
        content: `
# Khái niệm cốt lõi của JavaScript

JavaScript là linh hồn của website. Các khái niệm bạn cần nắm vững:
- **Biến và Kiểu dữ liệu**: let, const, var, string, number, array...
- **Hàm (Functions)**: Arrow functions, callback functions.
- **Promise & Async/Await**: Xử lý bất đồng bộ, fetch dữ liệu từ API.

Càng nắm vững JS thuần, bạn càng học Framewok dễ dàng!
        `,
        date: '2023-11-12',
        author: 'Lê Văn C',
        authorAvatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
        tags: ['t2', 't3'],
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        views: 89,
        status: 'published',
    },
    {
        id: 'p4',
        title: 'Thiết kế UX/UI Cơ Bản Nhất Cần Biết',
        slug: 'thiet-ke-ux-ui-co-ban',
        summary: 'Dù là Frontend Dev, bạn cũng nên hiểu UX/UI để giao tiếp tốt hơn với Designer và làm sp tỉ mỉ hơn.',
        content: `
# UX/UI Không Chỉ Dành Cho Designer
Một lập trình viên Frontend giỏi cần phải có "mắt thẩm mỹ" và hiểu người dùng.

- **UI (User Interface)**: Giao diện nhìn như thế nào? Màu sắc, font chữ.
- **UX (User Experience)**: Giao diện sử dụng ra sao? Có mượt không, luồng thao tác có tự nhiên không?

Hãy luôn đặt mình vào vị trí người dùng.
        `,
        date: '2024-01-20',
        author: 'Phạm D',
        authorAvatar: 'https://i.pravatar.cc/150?u=123',
        tags: ['t4'],
        coverImage: 'https://images.unsplash.com/photo-1542382103-68f44ff53c25?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        views: 215,
        status: 'published',
    },
    {
        id: 'p5',
        title: 'Bài viết đang nháp chờ chỉnh sửa',
        slug: 'bai-viet-dang-nhap',
        summary: 'Đây là bài viết đang trong quá trình soạn thảo, chưa xuất bản ra public.',
        content: 'Nội dung đang được cập nhật...',
        date: '2024-02-14',
        author: 'Nguyễn Văn A',
        authorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
        tags: ['t1'],
        coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        views: 0,
        status: 'draft',
    }
];

export const authorInfo = {
    name: 'Hoàng Văn Coding',
    bio: 'Một lập trình viên yêu thích việc chia sẻ kiến thức. Tôi viết về React, Kiến trúc phần mềm và cách thiết kế giao diện lôi cuốn.',
    avatar: 'https://i.pravatar.cc/300?img=11',
    skills: ['React', 'TypeScript', 'Ant Design', 'Node.js', 'UI/UX'],
    social: {
        github: 'https://github.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://linkedin.com'
    }
}
