import path from "path";
import { fileURLToPath } from "url";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import fs from "fs";

// 프로젝트 루트 디렉토리 가져오기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "../..");

// 전역 server 인스턴스
let globalServer: Server | null = null;

/**
 * 전역 server 인스턴스 설정
 */
export function setGlobalServer(server: Server): void {
  globalServer = server;
}

/**
 * 전역 server 인스턴스 가져오기
 */
export function getGlobalServer(): Server | null {
  return globalServer;
}

/**
 * DATA_DIR 경로 가져오기
 * server가 있고 listRoots를 지원하면 첫 번째 file://로 시작하는 root + "/data" 사용
 * 그렇지 않으면 환경 변수 또는 프로젝트 루트 디렉토리 사용
 */
export async function getDataDir(): Promise<string> {
  const server = getGlobalServer();
  let rootPath: string | null = null;

  if (server) {
    try {
      const roots = await server.listRoots();

      // 첫 번째 file://로 시작하는 root 찾기
      if (roots.roots && roots.roots.length > 0) {
        const firstFileRoot = roots.roots.find((root) =>
          root.uri.startsWith("file://")
        );
        if (firstFileRoot) {
          // file:// URI에서 실제 경로 추출
          // Windows: file:///C:/path -> C:/path
          // Unix: file:///path -> /path
          if (process.platform === 'win32') {
            rootPath = firstFileRoot.uri.replace("file:///", "").replace(/\//g, "\\");
          } else {
            rootPath = firstFileRoot.uri.replace("file://", "");
          }
        }
      }
    } catch (error) {
      // Silently handle error - console not supported in MCP
    }
  }

  // process.env.DATA_DIR 처리
  if (process.env.DATA_DIR) {
    if (path.isAbsolute(process.env.DATA_DIR)) {
      // DATA_DIR이 절대 경로이면 "DATA_DIR/rootPath마지막폴더이름" 반환
      if (rootPath) {
        const lastFolderName = path.basename(rootPath);
        const finalPath = path.join(process.env.DATA_DIR, lastFolderName);
        return finalPath;
      } else {
        // rootPath가 없으면 DATA_DIR 직접 반환
        return process.env.DATA_DIR;
      }
    } else {
      // DATA_DIR이 상대 경로이면 "rootPath/DATA_DIR" 반환
      if (rootPath) {
        return path.join(rootPath, process.env.DATA_DIR);
      } else {
        // rootPath가 없으면 PROJECT_ROOT 사용
        return path.join(PROJECT_ROOT, process.env.DATA_DIR);
      }
    }
  }

  // DATA_DIR이 없으면 기본 로직 사용
  if (rootPath) {
    return path.join(rootPath, "data");
  }

  // 마지막으로 프로젝트 루트 디렉토리로 폴백
  return path.join(PROJECT_ROOT, "data");
}

/**
 * 작업 파일 경로 가져오기
 */
export async function getTasksFilePath(): Promise<string> {
  const dataDir = await getDataDir();
  return path.join(dataDir, "tasks.json");
}

/**
 * 메모리 폴더 경로 가져오기
 */
export async function getMemoryDir(): Promise<string> {
  const dataDir = await getDataDir();
  return path.join(dataDir, "memory");
}

/**
 * WebGUI 파일 경로 가져오기
 */
export async function getWebGuiFilePath(): Promise<string> {
  const dataDir = await getDataDir();
  return path.join(dataDir, "WebGUI.md");
}

/**
 * 프로젝트 루트 디렉토리 가져오기
 */
export function getProjectRoot(): string {
  return PROJECT_ROOT;
}
