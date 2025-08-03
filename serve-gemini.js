#!/usr/bin/env node
/**
 * Gemini CLI용 Shrimp Task Manager 서버
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8080;

// MIME 타입 매핑
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  let filePath = '.' + req.url;
  
  // 기본 경로를 gemini-cli-version.html로 설정
  if (filePath === './' || filePath === './index.html') {
    filePath = './gemini-cli-version.html';
  }

  const extname = path.extname(filePath);
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('404 - 파일을 찾을 수 없습니다');
      } else {
        res.writeHead(500);
        res.end('500 - 서버 오류');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Shrimp Task Manager가 http://localhost:${PORT}에서 실행 중입니다`);
  console.log(`📁 HTML 파일: gemini-cli-version.html`);
  console.log('🌐 브라우저에서 자동으로 열립니다...');
  
  // 브라우저에서 자동으로 열기
  const url = `http://localhost:${PORT}/gemini-cli-version.html`;
  
  // Windows
  if (process.platform === 'win32') {
    exec(`start ${url}`);
  }
  // macOS
  else if (process.platform === 'darwin') {
    exec(`open ${url}`);
  }
  // Linux
  else {
    exec(`xdg-open ${url}`);
  }
  
  console.log('💡 서버를 종료하려면 Ctrl+C를 누르세요');
});

// 우아한 종료 처리
process.on('SIGINT', () => {
  console.log('\n👋 서버가 종료되었습니다.');
  process.exit(0);
}); 