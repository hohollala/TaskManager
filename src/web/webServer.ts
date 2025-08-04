import express, { Request, Response } from "express";
import getPort from "get-port";
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import { fileURLToPath } from "url";
import {
  getTasksFilePath,
  getWebGuiFilePath,
  getProjectRoot,
} from "../utils/paths.js";

export async function createWebServer() {
  // Express 애플리케이션 생성
  const app = express();

  // SSE 클라이언트 목록 저장
  let sseClients: Response[] = [];

  // SSE 이벤트 전송 헬퍼 함수
  function sendSseUpdate() {
    sseClients.forEach((client) => {
      // 클라이언트가 여전히 연결되어 있는지 확인
      if (!client.writableEnded) {
        client.write(
          `event: update\ndata: ${JSON.stringify({
            timestamp: Date.now(),
          })}\n\n`
        );
      }
    });
    // 연결이 끊어진 클라이언트 정리 (선택사항이지만 권장)
    sseClients = sseClients.filter((client) => !client.writableEnded);
  }

  // 정적 파일 디렉토리 설정
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const publicPath = path.join(__dirname, "..", "..", "src", "public");
  const TASKS_FILE_PATH = await getTasksFilePath(); // 도구 함수를 사용하여 파일 경로 가져오기

  app.use(express.static(publicPath));

  // API 라우트 설정
  app.get("/api/tasks", async (req: Request, res: Response) => {
    try {
      // fsPromises를 사용하여 비동기 읽기 유지
      const tasksData = await fsPromises.readFile(TASKS_FILE_PATH, "utf-8");
      res.json(JSON.parse(tasksData));
    } catch (error) {
      // 파일이 존재하지 않을 때 빈 작업 목록 반환 보장
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        res.json({ tasks: [] });
      } else {
        res.status(500).json({ error: "Failed to read tasks data" });
      }
    }
  });

  // 새로 추가: SSE 엔드포인트
  app.get("/api/tasks/stream", (req: Request, res: Response) => {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      // 선택사항: CORS 헤더, 프론트엔드와 백엔드가 같은 origin에 있지 않은 경우
      // "Access-Control-Allow-Origin": "*",
    });

    // 초기 이벤트 전송 또는 연결 유지
    res.write("data: connected\n\n");

    // 클라이언트를 목록에 추가
    sseClients.push(res);

    // 클라이언트 연결이 끊어질 때 목록에서 제거
    req.on("close", () => {
      sseClients = sseClients.filter((client) => client !== res);
    });
  });

  // writeWebGuiFile 함수 정의
  async function writeWebGuiFile(port: number | string) {
    try {
      // TEMPLATES_USE 환경 변수를 읽고 언어 코드로 변환
      const templatesUse = process.env.TEMPLATES_USE || "en";
      const getLanguageFromTemplate = (template: string): string => {
        if (template === "zh") return "zh-TW";
        if (template === "en") return "en";
        // 사용자 정의 템플릿은 기본적으로 영어 사용
        return "en";
      };
      const language = getLanguageFromTemplate(templatesUse);

      const websiteUrl = `[Task Manager UI](http://localhost:${port}?lang=${language})`;
      const websiteFilePath = await getWebGuiFilePath();
      const DATA_DIR = path.join(getProjectRoot(), "docs");
      try {
        await fsPromises.access(DATA_DIR);
      } catch (error) {
        await fsPromises.mkdir(DATA_DIR, { recursive: true });
      }

      const content = `# Web GUI 접근 정보

${websiteUrl}

## 사용 방법

1. 위 링크를 클릭하여 웹 인터페이스에 접근하세요
2. 작업 목록을 실시간으로 확인하고 관리할 수 있습니다
3. 작업 상태 변경 시 자동으로 업데이트됩니다

## 기능

- 실시간 작업 상태 모니터링
- 작업 의존성 시각화
- 작업 검색 및 필터링
- 다국어 지원 (영어/중국어)

---
*이 파일은 자동으로 생성되었습니다. 수동으로 편집하지 마세요.*
`;

      await fsPromises.writeFile(websiteFilePath, content, "utf-8");
    } catch (error) {
      console.error("WebGUI 파일 작성 실패:", error);
    }
  }

  return {
    async startServer() {
      // 사용 가능한 포트 가져오기
      const port = await getPort({ port: 3000 });

      // HTTP 서버 시작
      const server = app.listen(port, () => {
        console.log(`Web GUI 서버가 http://localhost:${port}에서 실행 중입니다`);
      });

      // 서버 시작 후 파일 변경 감지 시작
      const TASKS_FILE_PATH = await getTasksFilePath();
      // 파일이 존재하는지 확인하고, 존재하지 않으면 감시하지 않음 (watch 오류 방지)
      try {
        await fsPromises.access(TASKS_FILE_PATH);
        const watcher = fs.watch(TASKS_FILE_PATH, (eventType) => {
          if (eventType === "change") {
            // 짧은 시간 내에 여러 번 트리거되는 것을 방지하기 위해 약간 지연 전송 (예: 편집기 저장)
            setTimeout(() => {
              sendSseUpdate();
            }, 100);
          }
        });

        // WebGUI.md에 URL 작성
        await writeWebGuiFile(port);

        // 프로세스 종료 이벤트 처리 설정 (watcher 제거 보장)
        const shutdownHandler = async () => {
          // 모든 SSE 연결 닫기
          sseClients.forEach((client) => {
            if (!client.writableEnded) {
              client.end();
            }
          });

          // HTTP 서버 닫기
          server.close(() => {
            console.log("Web GUI 서버가 종료되었습니다");
            process.exit(0);
          });
        };

        process.on("SIGINT", shutdownHandler);
        process.on("SIGTERM", shutdownHandler);
      } catch (error) {
        console.error("작업 파일 감시 설정 실패:", error);
      }
    },
  };
}
