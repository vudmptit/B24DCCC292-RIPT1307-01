export default [
    {
        path: '/user',
        layout: false,
        routes: [
            {
                path: '/user/login',
                layout: false,
                name: 'login',
                component: './user/Login',
            },
            {
                path: '/user',
                redirect: '/user/login',
            },
        ],
    },

    ///////////////////////////////////
    // DEFAULT MENU
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: './TrangChu',
        icon: 'HomeOutlined',
    },
    {
        path: '/gioi-thieu',
        name: 'About',
        component: './TienIch/GioiThieu',
        hideInMenu: true,
    },
    {
        path: '/random-user',
        name: 'RandomUser',
        component: './RandomUser',
        icon: 'ArrowsAltOutlined',
    },
    {
        path: '/todo-list',
        name: 'TodoList',
        component: './TodoList',
    },
    {
        path: '/san-pham',
        name: 'Quản lý sản phẩm',
        icon: 'TableOutlined',
        component: './SanPham',
    },
    {
        path: '/baitap-02',
        name: 'Bài Tập 02',
        icon: 'TableOutlined',
        component: './Baitap2',
    },
    {
        path: '/th01',
        name: 'TH01',
        icon: 'TableOutlined',
        component: './TH01',
    },
    {
        path: '/th02',
        name: 'TH02',
        icon: 'TableOutlined',
        component: './TH02',
    },
    {
        path: '/th03',
        name: 'TH03',
        icon: 'TableOutlined',
        component: './TH03',
    },
    {
        path: '/th04',
        name: 'TH04',
        icon: 'TableOutlined',
        component: './TH04',
    },
    {
        path: '/th05',
        name: 'TH05',
        icon: 'TableOutlined',
        component: './TH05',
    },
    {
        path: '/ktgk',
        name: 'Kiểm tra giữa kỳ',
        icon: 'TableOutlined',
        component: './KTGK',
    },

    // DANH MUC HE THONG
    // {
    // 	name: 'DanhMuc',
    // 	path: '/danh-muc',
    // 	icon: 'copy',
    // 	routes: [
    // 		{
    // 			name: 'ChucVu',
    // 			path: 'chuc-vu',
    // 			component: './DanhMuc/ChucVu',
    // 		},
    // 	],
    // },

    {
        path: '/notification',
        routes: [
            {
                path: './subscribe',
                exact: true,
                component: './ThongBao/Subscribe',
            },
            {
                path: './check',
                exact: true,
                component: './ThongBao/Check',
            },
            {
                path: './',
                exact: true,
                component: './ThongBao/NotifOneSignal',
            },
        ],
        layout: false,
        hideInMenu: true,
    },
    {
        path: '/',
    },
    {
        path: '/403',
        component: './exception/403/403Page',
        layout: false,
    },
    {
        path: '/hold-on',
        component: './exception/DangCapNhat',
        layout: false,
    },
    {
        component: './exception/404',
    },
];
