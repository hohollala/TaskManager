import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";

const execAsync = promisify(exec);

// 스키마 정의
export const removeMCPSchema = z.object({
  serverName: z.string().describe("제거할 MCP 서버 이름"),
  scope: z.enum(["user", "local", "project"]).optional().describe("제거 범위 (기본값: user)")
});

export type RemoveMCPInput = z.infer<typeof removeMCPSchema>;

export async function removeMCP(input: RemoveMCPInput): Promise<{ content: { type: "text"; text: string }[] }> {
  try {
    const { serverName, scope = "user" } = input;
    
    // ~/.claude.json 파일 경로 확인
    const homeDir = os.homedir();
    const claudeConfigPath = path.join(homeDir, ".claude.json");
    
    // 기존 설정 파일 읽기
    let configData: any = {};
    try {
      const configContent = await fs.readFile(claudeConfigPath, "utf-8");
      configData = JSON.parse(configContent);
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ ${claudeConfigPath} 파일을 찾을 수 없거나 읽을 수 없습니다.`
          }
        ]
      };
    }

    // mcpServers 섹션이 없으면 오류
    if (!configData.mcpServers) {
      return {
        content: [
          {
            type: "text",
            text: `❌ ${claudeConfigPath}에 mcpServers 섹션이 없습니다.`
          }
        ]
      };
    }

    // 서버가 존재하는지 확인
    if (!configData.mcpServers[serverName]) {
      return {
        content: [
          {
            type: "text",
            text: `❌ '${serverName}' 서버가 ${claudeConfigPath}에 존재하지 않습니다.`
          }
        ]
      };
    }

    // 서버 제거
    delete configData.mcpServers[serverName];
    console.log(`🗑️ ${serverName} 서버 제거됨`);

    // 설정 파일 저장
    await fs.writeFile(claudeConfigPath, JSON.stringify(configData, null, 2), "utf-8");
    console.log(`✅ ${claudeConfigPath}에서 ${serverName} 서버 설정이 제거되었습니다.`);

    // ~/.claude/commands 폴더 삭제 시도
    const commandsPath = path.join(homeDir, ".claude", "commands", "stm");
    try {
      await fs.rm(commandsPath, { recursive: true, force: true });
      console.log(`🗑️ ${commandsPath} 폴더 삭제됨`);
    } catch (error) {
      console.log(`⚠️ ${commandsPath} 폴더 삭제 실패: ${error}`);
    }

    // 연결 상태 확인
    const { stdout: listOutput } = await execAsync("claude mcp list");
    
    return {
      content: [
        {
          type: "text",
          text: `✅ MCP 서버 '${serverName}' 제거 완료!

📋 설정 파일: ${claudeConfigPath}
🗑️ 제거된 서버: ${serverName}

📊 현재 MCP 서버 상태:
${listOutput}

💡 참고사항:
- 서버가 완전히 제거되려면 Claude Code를 재시작해야 할 수 있습니다
- 서버 상태를 확인하려면: claude mcp list`
        }
      ]
    };

  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `❌ MCP 서버 제거 중 오류가 발생했습니다: ${error}`
        }
      ]
    };
  }
} 