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
 * 작업 파일 경로 가져오기
 */
export async function getTasksFilePath(): Promise<string> {
  return path.join(PROJECT_ROOT, "docs", "tasks.json");
}

/**
 * 메모리 폴더 경로 가져오기
 */
export async function getMemoryDir(): Promise<string> {
  return path.join(PROJECT_ROOT, "docs", "memory");
}

/**
 * WebGUI 파일 경로 가져오기
 */
export async function getWebGuiFilePath(): Promise<string> {
  return path.join(PROJECT_ROOT, "docs", "WebGUI.md");
}

/**
 * 프로젝트 루트 디렉토리 가져오기
 */
export function getProjectRoot(): string {
  return PROJECT_ROOT;
}
