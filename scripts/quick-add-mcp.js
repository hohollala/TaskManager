#!/usr/bin/env node

import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

async function quickAddMCP() {
  try {
    const serverName = process.argv[2];
    
    if (!serverName) {
      console.log("❌ 사용법: node scripts/quick-add-mcp.js [서버이름]");
      console.log("예시: node scripts/quick-add-mcp.js shrimp-task-manager");
      process.exit(1);
    }

    // 프로젝트 루트 디렉토리 찾기
    async function findProjectRoot(startDir) {
      let currentDir = startDir;
      while (true) {
        const packageJsonPath = path.join(currentDir, 'package.json');
        try {
          await fs.access(packageJsonPath);
          return currentDir; // package.json이 있으면 여기가 루트
        } catch (e) {
          const parentDir = path.dirname(currentDir);
          if (parentDir === currentDir) {
            // 더 이상 올라갈 수 없음 (루트 디렉토리)
            throw new Error("package.json을 찾을 수 없습니다. 프로젝트 루트 디렉토리에서 실행해주세요.");
          }
          currentDir = parentDir;
        }
      }
    }

    const projectRoot = await findProjectRoot(process.cwd());
    const distIndexPath = path.join(projectRoot, "dist", "index.js");
    const absolutePath = path.resolve(distIndexPath);

    console.log(`📁 프로젝트 루트 폴더: ${projectRoot}`);

    console.log(`📁 현재 작업 폴더: ${currentDir}`);
    console.log(`🔧 생성된 경로: ${absolutePath}`);

    // 기존 서버 제거
    try {
      await execAsync(`claude mcp remove ${serverName} -s user`);
      console.log(`🗑️ 기존 ${serverName} 서버 제거됨`);
    } catch (error) {
      // 서버가 존재하지 않는 경우 무시
    }

    // 새 서버 추가
    const addCommand = `claude mcp add ${serverName} -s user -- node "${absolutePath}"`;
    console.log(`🔧 실행 중: ${addCommand}`);
    
    const { stdout, stderr } = await execAsync(addCommand);
    
    if (stderr) {
      console.warn(`⚠️ 경고: ${stderr}`);
    }

    // 연결 상태 확인
    const { stdout: listOutput } = await execAsync("claude mcp list");
    
    console.log(`\n✅ MCP 서버 '${serverName}' 설치 완료!`);
    console.log(`📁 프로젝트 경로: ${currentDir}`);
    console.log(`🔧 실행 명령어: node ${absolutePath}`);
    console.log(`\n📊 현재 MCP 서버 상태:`);
    console.log(listOutput);

  } catch (error) {
    console.error(`❌ 오류: ${error.message}`);
    process.exit(1);
  }
}

quickAddMCP(); 