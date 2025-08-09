import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 웹 GUI URL을 찾는 중...');

// WebGUI.md 파일에서 URL 읽기
const findGuiUrl = async () => {
  try {
    const webGuiPath = path.join(__dirname, '..', 'docs', 'WebGUI.md');
    
    if (fs.existsSync(webGuiPath)) {
      const content = fs.readFileSync(webGuiPath, 'utf-8');
      const urlMatch = content.match(/http:\/\/localhost:(\d+)/);
      
      if (urlMatch) {
        const url = urlMatch[0];
        console.log('🌐 웹 GUI URL:');
        console.log(`   ${url}`);
        console.log('');
        console.log('💡 브라우저에서 위 URL을 열어 작업 관리자를 사용하세요.');
      } else {
        console.log('❌ WebGUI.md 파일에서 URL을 찾을 수 없습니다.');
        fallbackSearch();
      }
    } else {
      console.log('❌ WebGUI.md 파일을 찾을 수 없습니다.');
      console.log('💡 먼저 MCP 서버를 시작해주세요.');
    }
  } catch (error) {
    console.error('❌ GUI URL 검색 실패:', error.message);
    fallbackSearch();
  }
};

// 대체 방법: netstat으로 포트 찾기
const fallbackSearch = () => {
  console.log('🔄 대체 방법으로 포트를 검색합니다...');
  
  import('child_process').then(({ spawn }) => {
    const netstat = spawn('netstat', ['-an'], { shell: true });
    let output = '';

    netstat.stdout.on('data', (data) => {
      output += data.toString();
    });

    netstat.on('close', (code) => {
      const lines = output.split('\n');
      const listeningPorts = [];

      for (const line of lines) {
        if (line.includes('LISTENING') && line.includes(':300')) {
          const match = line.match(/:(\d{4})/);
          if (match) {
            const port = parseInt(match[1]);
            if (port >= 3000 && port <= 3010) {
              listeningPorts.push(port);
            }
          }
        }
      }

      if (listeningPorts.length > 0) {
        console.log('🌐 발견된 웹 서버 URL:');
        listeningPorts.forEach(port => {
          console.log(`   http://localhost:${port}`);
        });
      } else {
        console.log('❌ 실행 중인 웹 서버를 찾을 수 없습니다.');
        console.log('💡 MCP 서버를 먼저 시작해주세요.');
      }
    });
  });
};

findGuiUrl();