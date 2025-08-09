import { Tool } from "@modelcontextprotocol/sdk/types.js";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

// URL 조회 도구
export const getUrlTool: Tool = {
  name: "get_url",
  description: "웹 GUI의 URL을 조회합니다",
  inputSchema: {
    type: "object",
    properties: {},
    required: [],
  },
};

export async function handleGetUrl(): Promise<string> {
  try {
    // 1. 현재 작업 디렉토리에서 WebGUI.md 찾기
    const webGuiPath = path.join(process.cwd(), 'WebGUI.md');
    
    if (fs.existsSync(webGuiPath)) {
      const content = fs.readFileSync(webGuiPath, 'utf-8');
      const urlMatch = content.match(/http:\/\/localhost:(\d+)/);
      
      if (urlMatch) {
        return urlMatch[0];
      }
    }

    // 2. docs 폴더에서 WebGUI.md 찾기
    const docsWebGuiPath = path.join(process.cwd(), 'docs', 'WebGUI.md');
    if (fs.existsSync(docsWebGuiPath)) {
      const content = fs.readFileSync(docsWebGuiPath, 'utf-8');
      const urlMatch = content.match(/http:\/\/localhost:(\d+)/);
      
      if (urlMatch) {
        return urlMatch[0];
      }
    }

    // 3. netstat으로 포트 찾기
    return new Promise((resolve) => {
      const netstat = spawn('netstat', ['-an'], { shell: true });
      let output = '';

      netstat.stdout.on('data', (data) => {
        output += data.toString();
      });

      netstat.on('close', () => {
        const lines = output.split('\n');
        
        for (const line of lines) {
          if (line.includes('LISTENING') && line.includes(':300')) {
            const match = line.match(/:(\d{4})/);
            if (match) {
              const port = parseInt(match[1]);
              if (port >= 3000 && port <= 3010) {
                resolve(`http://localhost:${port}`);
                return;
              }
            }
          }
        }
        
        resolve('웹서버가 실행되지 않았습니다');
      });

      netstat.on('error', () => {
        resolve('웹서버가 실행되지 않았습니다');
      });
    });

  } catch (error) {
    return '웹서버가 실행되지 않았습니다';
  }
}