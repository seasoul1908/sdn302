const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Trang Chủ (Home Page)</h1><p>Chào mừng bạn đến với trang chủ!</p>');
    } else if (req.url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Giới Thiệu (About Page)</h1><p>Đây là trang thông tin giới thiệu.</p>');
    } else if (req.url === '/contact') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Liên Hệ (Contact Page)</h1><p>Email: contact@example.com</p>');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 Not Found</h1><p>Trang bạn tìm kiếm không tồn tại!</p>');
    }
});

server.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

// demo xu ly nhieu url khac nhau

//localhost:3000/
//localhost:3000/about
//localhost:3000/contact
