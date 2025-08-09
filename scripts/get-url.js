import fs from 'fs';
import path from 'path';

console.log('🔍 웹 GUI URL 확인 중...');

const findUrl = () => {
  try {
    // 현재 작업 디렉토리에서 WebGUI.md 파일 찾기
    const webGuiPath = path.join(process.cwd(), 'WebGUI.md');
    
    if (fs.existsSync(webGuiPath)) {
      const content = fs.readFileSync(webGuiPath, 'utf-8');
      const urlMatch = content.match(/http:\/\/localhost:(\d+)/);
      
      if (urlMatch) {
        const url = urlMatch[0];
        console.log(`${url}`);
        return;
      }
    }

    // WebGUI.md가 없으면 MCP 서버의 docs 폴더에서 찾기
    const mcpWebGuiPath = path.join(process.cwd(), 'docs', 'WebGUI.md');
    if (fs.existsSync(mcpWebGuiPath)) {
      const content = fs.readFileSync(mcpWebGuiPath, 'utf-8');
      const urlMatch = content.match(/http:\/\/localhost:(\d+)/);
      
      if (urlMatch) {
        const url = urlMatch[0];
        console.log(`${url}`);
        return;
      }
    }

    // 파일이 없으면 netstat으로 포트 찾기
    import('child_process').then(({ spawn }) => {
      const netstat = spawn('netstat', ['-an'], { shell: true });
      let output = '';

      netstat.stdout.on('data', (data) => {
        output += data.toString();
      });

      netstat.on('close', (code) => {
        const lines = output.split('\n');
        
        for (const line of lines) {
          if (line.includes('LISTENING') && line.includes(':300')) {
            const match = line.match(/:(\d{4})/);
            if (match) {
              const port = parseInt(match[1]);
              if (port >= 3000 && port <= 3010) {
                console.log(`http://localhost:${port}`);
                return;
              }
            }
          }
        }
        
        console.log('웹서버가 실행되지 않았습니다');
      });
    });
    
  } catch (error) {
    console.log('웹서버가 실행되지 않았습니다');
  }
};

findUrl();