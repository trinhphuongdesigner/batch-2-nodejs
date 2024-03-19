// // 1 Tạo một tệp có tên "app.js" và thêm đoạn mã sau:
// const http = require('http');
// // import http from 'http';

// const hostname = '127.0.0.1';
// const port = 4000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/html');
//   res.end('<strong>Hello Trinh Phuong</strong>');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

// // 2. Lưu tệp "app.js".
// // 3. Mở Terminal hoặc Command Prompt và di chuyển đến thư mục chứa tệp "app.js".
// // 4. Chạy lệnh sau để khởi động máy chủ web: node app.js
// // 5. Mở trình duyệt web và truy cập vào địa chỉ "http://localhost:3000".

const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.2';
const port = 9000;

const server = http.createServer((req, res) => {
  fs.readFile('demohtml.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    return res.end();
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
