import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";

const execAsync = promisify(exec);

// 스키마 정의
export const installMCPSchema = z.object({
  serverName: z.string().describe("설치할 MCP 서버 이름"),
  projectPath: z.string().optional().describe("프로젝트 경로 (기본값: 현재 디렉토리)"),
  scope: z.enum(["user", "local", "project"]).optional().describe("설치 범위 (기본값: user)"),
  env: z.string().optional().describe("환경변수 설정 (문자열)")
});

export type InstallMCPInput = z.infer<typeof installMCPSchema>;

export async function installMCP(input: InstallMCPInput): Promise<{ content: { type: "text"; text: string }[] }> {
  try {
    const { serverName, projectPath = process.cwd(), scope = "user", env = "" } = input;
    
    // 프로젝트 경로 정규화 (절대 경로로 변환)
    const normalizedPath = path.resolve(projectPath);
    
    // package.json 확인
    const packageJsonPath = path.join(normalizedPath, "package.json");
    let packageInfo;
    
    try {
      const packageContent = await fs.readFile(packageJsonPath, "utf-8");
      packageInfo = JSON.parse(packageContent);
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ ${normalizedPath}에서 package.json을 찾을 수 없습니다. 유효한 Node.js 프로젝트인지 확인해주세요.`
          }
        ]
      };
    }

    // dist/index.js 확인
    const distIndexPath = path.join(normalizedPath, "dist", "index.js");

    // ~/.claude.json 파일 경로 확인
    const homeDir = os.homedir();
    const claudeConfigPath = path.join(homeDir, ".claude.json");
    
    // 기존 설정 파일 읽기 또는 새로 생성
    let configData: any = {};
    try {
      const configContent = await fs.readFile(claudeConfigPath, "utf-8");
      configData = JSON.parse(configContent);
    } catch (error) {
      // 파일이 없거나 JSON 파싱 오류인 경우 기본 구조 생성
      configData = {
        mcpServers: {}
      };
    }

    // mcpServers 섹션이 없으면 생성
    if (!configData.mcpServers) {
      configData.mcpServers = {};
    }

    // 기존 서버 제거 (이미 존재하는 경우)
    if (configData.mcpServers[serverName]) {
      delete configData.mcpServers[serverName];
      console.log(`🗑️ 기존 ${serverName} 서버 제거됨`);
    }

    // 새 서버 설정 추가
    configData.mcpServers[serverName] = {
      type: "stdio",
      command: "node",
      args: [distIndexPath],
      env: {
        "ENABLE_GUI": "true",
        "TEMPLATES_USE": "ko"
      }
    };
    
    // 설정 파일 저장
    await fs.writeFile(claudeConfigPath, JSON.stringify(configData, null, 2), "utf-8");
    console.log(`✅ ${claudeConfigPath}에 ${serverName} 서버 설정이 추가되었습니다.`);

    // 연결 상태 확인
    const { stdout: listOutput } = await execAsync("claude mcp list");
    
    return {
      content: [
        {
          type: "text",
          text: `✅ MCP 서버 '${serverName}' 설치 완료!

📁 프로젝트 경로: ${normalizedPath}
🔧 실행 명령어: node ${distIndexPath}
📋 설정 파일: ${claudeConfigPath}

📊 현재 MCP 서버 상태:
${listOutput}

💡 사용 방법:
- Claude AI 채팅창에서 '${serverName}' 관련 명령어를 사용할 수 있습니다
- 서버 상태를 확인하려면: claude mcp list
- 설정을 수동으로 제거하려면 ${claudeConfigPath} 파일에서 해당 섹션을 삭제하세요

🎉 이제 '${serverName}' 명령어를 사용할 수 있습니다!`
        }
      ]
    };

  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `❌ MCP 서버 설치 중 오류가 발생했습니다: ${error}`
        }
      ]
    };
  }
} 