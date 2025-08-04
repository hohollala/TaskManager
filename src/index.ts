import "dotenv/config";
import { loadPromptFromTemplate } from "./prompts/loader.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import path from "path";
import { fileURLToPath } from "url";
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
  InitializedNotificationSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { setGlobalServer } from "./utils/paths.js";
import { createWebServer } from "./web/webServer.js";
import { generateCommandFiles } from "./utils/commandGenerator.js";

// 모든 도구 함수 및 스키마 가져오기
import {
  planTask,
  planTaskSchema,
  analyzeTask,
  analyzeTaskSchema,
  reflectTask,
  reflectTaskSchema,
  splitTasks,
  splitTasksSchema,
  splitTasksRaw,
  splitTasksRawSchema,
  listTasksSchema,
  listTasks,
  executeTask,
  executeTaskSchema,
  verifyTask,
  verifyTaskSchema,
  deleteTask,
  deleteTaskSchema,
  clearAllTasks,
  clearAllTasksSchema,
  updateTaskContent,
  updateTaskContentSchema,
  queryTask,
  queryTaskSchema,
  getTaskDetail,
  getTaskDetailSchema,
  processThought,
  processThoughtSchema,
  initProjectRules,
  initProjectRulesSchema,
  researchMode,
  researchModeSchema,
  newProject,
  newProjectSchema,
  askProjectQuestion,
  askProjectQuestionSchema,
  installMCP,
  installMCPSchema,
  removeMCP,
  removeMCPSchema,
} from "./tools/index.js";

async function main() {
  try {
    // 무조건 "가나다라" 출력
    console.log("가나다라");
    
    // 현재 작업 디렉토리를 기준으로 dist/index.js 경로 설정
    const currentWorkingDir = process.cwd();
    const distPath = path.join(currentWorkingDir, "dist", "index.js");
    
    // 경로가 존재하는지 확인하고 로그 출력
    const fs = await import("fs");
    if (fs.existsSync(distPath)) {
      console.log(`✅ 서버 경로 확인됨: ${distPath}`);
      // 현재 실행 파일 경로를 올바른 경로로 변경
      process.argv[1] = distPath;
    } else {
      console.warn(`⚠️ 경로가 존재하지 않음: ${distPath}`);
      console.log(`📁 현재 작업 디렉토리: ${currentWorkingDir}`);
      // 경로가 없어도 현재 작업 디렉토리 기준으로 설정
      process.argv[1] = distPath;
    }
    
    const ENABLE_GUI = process.env.ENABLE_GUI === "true";
    let webServerInstance: Awaited<ReturnType<typeof createWebServer>> | null =
      null;

    // 설치 시 명령어 파일들 생성
    try {
      await generateCommandFiles();
    } catch (error) {
      console.warn('⚠️ 명령어 파일 생성 실패 (선택사항):', error);
    }

    // MCP 서버 생성
    const server = new Server(
      {
        name: "Shrimp Task Manager",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
          logging: {},
        },
      }
    );

    // 전역 서버 인스턴스 설정 (listRoots 호출 방지)
    // setGlobalServer(server);

    // 웹 서버 시작을 위해 초기화된 알림 수신 대기
    if (ENABLE_GUI) {
      server.setNotificationHandler(InitializedNotificationSchema, async () => {
        try {
          webServerInstance = await createWebServer();
          await webServerInstance.startServer();
        } catch (error) {}
      });
    }

    server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "plan",
            description: await loadPromptFromTemplate(
              "toolsDescription/planTask.md"
            ),
            inputSchema: zodToJsonSchema(planTaskSchema),
          },
          {
            name: "analyze",
            description: await loadPromptFromTemplate(
              "toolsDescription/analyzeTask.md"
            ),
            inputSchema: zodToJsonSchema(analyzeTaskSchema),
          },
          {
            name: "reflect",
            description: await loadPromptFromTemplate(
              "toolsDescription/reflectTask.md"
            ),
            inputSchema: zodToJsonSchema(reflectTaskSchema),
          },
          {
            name: "split",
            description: await loadPromptFromTemplate(
              "toolsDescription/splitTasks.md"
            ),
            inputSchema: zodToJsonSchema(splitTasksRawSchema),
          },
          {
            name: "list",
            description: await loadPromptFromTemplate(
              "toolsDescription/listTasks.md"
            ),
            inputSchema: zodToJsonSchema(listTasksSchema),
          },
          {
            name: "execute",
            description: await loadPromptFromTemplate(
              "toolsDescription/executeTask.md"
            ),
            inputSchema: zodToJsonSchema(executeTaskSchema),
          },
          {
            name: "verify",
            description: await loadPromptFromTemplate(
              "toolsDescription/verifyTask.md"
            ),
            inputSchema: zodToJsonSchema(verifyTaskSchema),
          },
          {
            name: "delete",
            description: await loadPromptFromTemplate(
              "toolsDescription/deleteTask.md"
            ),
            inputSchema: zodToJsonSchema(deleteTaskSchema),
          },
          {
            name: "clear_all",
            description: await loadPromptFromTemplate(
              "toolsDescription/clearAllTasks.md"
            ),
            inputSchema: zodToJsonSchema(clearAllTasksSchema),
          },
          {
            name: "update",
            description: await loadPromptFromTemplate(
              "toolsDescription/updateTask.md"
            ),
            inputSchema: zodToJsonSchema(updateTaskContentSchema),
          },
          {
            name: "query",
            description: await loadPromptFromTemplate(
              "toolsDescription/queryTask.md"
            ),
            inputSchema: zodToJsonSchema(queryTaskSchema),
          },
          {
            name: "detail",
            description: await loadPromptFromTemplate(
              "toolsDescription/getTaskDetail.md"
            ),
            inputSchema: zodToJsonSchema(getTaskDetailSchema),
          },
          {
            name: "process",
            description: await loadPromptFromTemplate(
              "toolsDescription/processThought.md"
            ),
            inputSchema: zodToJsonSchema(processThoughtSchema),
          },
          {
            name: "init",
            description: await loadPromptFromTemplate(
              "toolsDescription/initProjectRules.md"
            ),
            inputSchema: zodToJsonSchema(initProjectRulesSchema),
          },
          {
            name: "research",
            description: await loadPromptFromTemplate(
              "toolsDescription/researchMode.md"
            ),
            inputSchema: zodToJsonSchema(researchModeSchema),
          },
          {
            name: "new",
            description: await loadPromptFromTemplate(
              "toolsDescription/newProject.md"
            ),
            inputSchema: zodToJsonSchema(newProjectSchema),
          },
          {
            name: "ask-project-question",
            description: "프로젝트 요구사항을 단계별로 수집하기 위한 질문 도구",
            inputSchema: zodToJsonSchema(askProjectQuestionSchema),
          },
          {
            name: "install-mcp",
            description: "MCP 서버를 자동으로 설치하고 올바른 경로를 설정합니다",
            inputSchema: zodToJsonSchema(installMCPSchema),
          },
          {
            name: "remove-mcp",
            description: "MCP 서버를 자동으로 제거합니다",
            inputSchema: zodToJsonSchema(removeMCPSchema),
          },
        ],
      };
    });

    server.setRequestHandler(
      CallToolRequestSchema,
      async (request: CallToolRequest) => {
        try {
          if (!request.params.arguments) {
            throw new Error("No arguments provided");
          }

          let parsedArgs;
          switch (request.params.name) {
            case "plan":
              parsedArgs = await planTaskSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              return await planTask(parsedArgs.data);
            case "analyze":
              parsedArgs = await analyzeTaskSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              return await analyzeTask(parsedArgs.data);
            case "reflect":
              parsedArgs = await reflectTaskSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              return await reflectTask(parsedArgs.data);
            case "split":
              parsedArgs = await splitTasksRawSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              return await splitTasksRaw(parsedArgs.data);
            case "list":
              parsedArgs = await listTasksSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              return await listTasks(parsedArgs.data);
            case "execute":
              parsedArgs = await executeTaskSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              return await executeTask(parsedArgs.data);
            case "verify":
              parsedArgs = await verifyTaskSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              return await verifyTask(parsedArgs.data);
            case "delete":
              parsedArgs = await deleteTaskSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              return await deleteTask(parsedArgs.data);
            case "clear_all":
              parsedArgs = await clearAllTasksSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              return await clearAllTasks(parsedArgs.data);
            case "update":
              parsedArgs = await updateTaskContentSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              return await updateTaskContent(parsedArgs.data);
            case "query":
              parsedArgs = await queryTaskSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              return await queryTask(parsedArgs.data);
            case "detail":
              parsedArgs = await getTaskDetailSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              return await getTaskDetail(parsedArgs.data);
            case "process":
              parsedArgs = await processThoughtSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              return await processThought(parsedArgs.data);
            case "init":
              return await initProjectRules();
            case "research":
              parsedArgs = await researchModeSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              return await researchMode(parsedArgs.data);
            case "new":
              parsedArgs = await newProjectSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              return await newProject(parsedArgs.data);
            case "ask-project-question":
              parsedArgs = await askProjectQuestionSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              return await askProjectQuestion(parsedArgs.data);
            case "install-mcp":
              parsedArgs = await installMCPSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              return await installMCP(parsedArgs.data);
            case "remove-mcp":
              parsedArgs = await removeMCPSchema.safeParseAsync(
                request.params.arguments
              );
              if (!parsedArgs.success) {
                throw new Error(
                  `Invalid arguments for tool ${request.params.name}: ${parsedArgs.error.message}`
                );
              }
              return await removeMCP(parsedArgs.data);
            default:
              throw new Error(`Tool ${request.params.name} does not exist`);
          }
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          return {
            content: [
              {
                type: "text",
                text: `Error occurred: ${errorMsg} \n Please try correcting the error and calling the tool again`,
              },
            ],
          };
        }
        return {
          content: [
            {
              type: "text",
              text: "Tool execution completed",
            },
          ],
        };
      }
    );

    // 연결 설정
    const transport = new StdioServerTransport();
    console.log("🔌 MCP 서버 연결 중...");
    await server.connect(transport);
    console.log("✅ MCP 서버가 성공적으로 연결되었습니다!");
    console.log("📡 서버가 요청을 대기 중입니다...");
  } catch (error) {
    process.exit(1);
  }
}

main().catch(console.error);
