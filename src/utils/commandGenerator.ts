import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 명령어 정보 타입 정의
interface CommandInfo {
  name: string;
  description: string;
  category: string;
  usage: string;
  examples: string[];
}

// 명령어 정보 정의
const commands: CommandInfo[] = [
  {
    name: "plan",
    description: "새로운 작업을 계획하고 생성합니다",
    category: "작업 관리",
    usage: "plan [작업 설명]",
    examples: [
      "plan 새로운 웹사이트 개발",
      "plan API 엔드포인트 구현",
      "plan 데이터베이스 스키마 설계"
    ]
  },
  {
    name: "analyze",
    description: "작업을 깊이 분석하고 요구사항을 파악합니다",
    category: "작업 관리",
    usage: "analyze [작업 ID]",
    examples: [
      "analyze 123e4567-e89b-12d3-a456-426614174000",
      "analyze 현재 작업"
    ]
  },
  {
    name: "reflect",
    description: "작업 방향을 검토하고 개선점을 찾습니다",
    category: "작업 관리",
    usage: "reflect [작업 ID]",
    examples: [
      "reflect 123e4567-e89b-12d3-a456-426614174000",
      "reflect 현재 접근 방식"
    ]
  },
  {
    name: "split",
    description: "큰 작업을 작은 단위로 분할합니다",
    category: "작업 관리",
    usage: "split [작업 ID]",
    examples: [
      "split 123e4567-e89b-12d3-a456-426614174000",
      "split 복잡한 작업을 작은 단위로"
    ]
  },
  {
    name: "list",
    description: "모든 작업 목록을 조회합니다",
    category: "작업 관리",
    usage: "list [옵션]",
    examples: [
      "list",
      "list --status pending",
      "list --priority high"
    ]
  },
  {
    name: "execute",
    description: "선택된 작업을 실행합니다",
    category: "작업 관리",
    usage: "execute [작업 ID]",
    examples: [
      "execute 123e4567-e89b-12d3-a456-426614174000",
      "execute 다음 작업"
    ]
  },
  {
    name: "verify",
    description: "작업 완료 여부를 검증합니다",
    category: "작업 관리",
    usage: "verify [작업 ID]",
    examples: [
      "verify 123e4567-e89b-12d3-a456-426614174000",
      "verify 현재 작업 완료 확인"
    ]
  },
  {
    name: "delete",
    description: "개별 작업을 삭제합니다",
    category: "작업 관리",
    usage: "delete [작업 ID]",
    examples: [
      "delete 123e4567-e89b-12d3-a456-426614174000",
      "delete 불필요한 작업"
    ]
  },
  {
    name: "clear_all",
    description: "모든 작업을 삭제합니다",
    category: "작업 관리",
    usage: "clear_all",
    examples: [
      "clear_all",
      "clear_all --confirm"
    ]
  },
  {
    name: "update",
    description: "작업 내용을 수정합니다",
    category: "작업 관리",
    usage: "update [작업 ID] [수정 내용]",
    examples: [
      "update 123e4567-e89b-12d3-a456-426614174000 --name '새 이름'",
      "update 작업 설명 변경"
    ]
  },
  {
    name: "query",
    description: "작업을 검색합니다",
    category: "작업 관리",
    usage: "query [검색어]",
    examples: [
      "query API",
      "query --status completed",
      "query --priority high"
    ]
  },
  {
    name: "detail",
    description: "작업 상세 정보를 조회합니다",
    category: "작업 관리",
    usage: "detail [작업 ID]",
    examples: [
      "detail 123e4567-e89b-12d3-a456-426614174000",
      "detail 현재 작업 상세"
    ]
  },
  {
    name: "process",
    description: "복잡한 문제를 단계별로 사고합니다",
    category: "사고 과정",
    usage: "process [사고 내용]",
    examples: [
      "process 이 문제를 어떻게 해결할까?",
      "process 단계별 분석"
    ]
  },
  {
    name: "init",
    description: "프로젝트 개발 규칙을 설정합니다",
    category: "프로젝트 관리",
    usage: "init",
    examples: [
      "init",
      "init --force"
    ]
  },
  {
    name: "research",
    description: "기술 연구 모드를 실행합니다",
    category: "프로젝트 관리",
    usage: "research [연구 주제]",
    examples: [
      "research React 최신 기능",
      "research 데이터베이스 최적화 방법"
    ]
  },
  {
    name: "newProject",
    description: "새 프로젝트 요구사항을 생성합니다",
    category: "프로젝트 관리",
    usage: "newProject [프로젝트 설정]",
    examples: [
      "newProject",
      "newProject --purpose '할일 관리 앱'",
      "newProject --features '사용자 로그인, 할일 CRUD'"
    ]
  }
];

// MD 파일 템플릿 생성
function generateCommandMD(command: CommandInfo): string {
  return `# ${command.name}

## 설명
${command.description}

## 카테고리
${command.category}

## 사용법
\`\`\`
${command.usage}
\`\`\`

## 예시
${command.examples.map(example => `- \`${example}\``).join('\n')}

## 관련 명령어
- [목록](list.md) - 모든 명령어 보기
- [작업 관리 명령어들](../task-management.md)
- [프로젝트 관리 명령어들](../project-management.md)
`;
}

// 메인 README MD 파일 생성
function generateMainREADME(): string {
  return `# STM (Shrimp Task Manager) 명령어

## 개요
STM은 AI Agent를 위한 작업 관리 도구입니다. 체인 오브 쏘트, 리플렉션, 스타일 일관성을 강조하여 자연어를 구조화된 개발 작업으로 변환합니다.

## 명령어 카테고리

### 📋 작업 관리
- [plan](plan.md) - 작업 계획
- [analyze](analyze.md) - 작업 분석  
- [reflect](reflect.md) - 작업 검토
- [split](split.md) - 작업 분할
- [list](list.md) - 작업 목록
- [execute](execute.md) - 작업 실행
- [verify](verify.md) - 작업 확인
- [delete](delete.md) - 작업 삭제
- [clear_all](clear_all.md) - 전체 삭제
- [update](update.md) - 작업 수정
- [query](query.md) - 작업 검색
- [detail](detail.md) - 상세 정보

### 🧠 사고 과정
- [process](process.md) - 사고 과정

### ⚙️ 프로젝트 관리
- [init](init.md) - 규칙 설정
- [research](research.md) - 연구 모드
- [newProject](newProject.md) - 새 프로젝트

## 빠른 시작

1. **작업 계획**: \`plan 새로운 기능 개발\`
2. **작업 목록**: \`list\`
3. **작업 실행**: \`execute [작업ID]\`
4. **작업 확인**: \`verify [작업ID]\`
5. **새 프로젝트**: \`newProject\`

## 워크플로우

1. **계획** → 2. **분석** → 3. **검토** → 4. **분할** → 5. **실행** → 6. **확인**

## 도움말
각 명령어의 상세 정보는 해당 MD 파일을 참조하세요.
`;
}

// 설치 시 명령어 파일들 생성
export async function generateCommandFiles(): Promise<void> {
  try {
    const homeDir = os.homedir();
    const commandsDir = path.join(homeDir, '.claude', 'commands', 'stm');
    
    // 디렉토리 생성
    if (!fs.existsSync(commandsDir)) {
      fs.mkdirSync(commandsDir, { recursive: true });
    }
    
    // 메인 README 생성
    const mainReadmePath = path.join(commandsDir, 'README.md');
    fs.writeFileSync(mainReadmePath, generateMainREADME(), 'utf8');
    
    // 각 명령어 MD 파일 생성
    for (const command of commands) {
      const filePath = path.join(commandsDir, `${command.name}.md`);
      fs.writeFileSync(filePath, generateCommandMD(command), 'utf8');
    }
    
    console.log(`✅ 명령어 파일들이 생성되었습니다: ${commandsDir}`);
    console.log(`📁 총 ${commands.length}개의 명령어 파일이 생성되었습니다.`);
    
  } catch (error) {
    console.error('❌ 명령어 파일 생성 중 오류 발생:', error);
  }
}

// 개발용: 현재 디렉토리에 명령어 파일들 생성
export async function generateCommandFilesDev(): Promise<void> {
  try {
    const commandsDir = path.join(__dirname, '../../commands');
    
    // 디렉토리 생성
    if (!fs.existsSync(commandsDir)) {
      fs.mkdirSync(commandsDir, { recursive: true });
    }
    
    // 메인 README 생성
    const mainReadmePath = path.join(commandsDir, 'README.md');
    fs.writeFileSync(mainReadmePath, generateMainREADME(), 'utf8');
    
    // 각 명령어 MD 파일 생성
    for (const command of commands) {
      const filePath = path.join(commandsDir, `${command.name}.md`);
      fs.writeFileSync(filePath, generateCommandMD(command), 'utf8');
    }
    
    console.log(`✅ 개발용 명령어 파일들이 생성되었습니다: ${commandsDir}`);
    console.log(`📁 총 ${commands.length}개의 명령어 파일이 생성되었습니다.`);
    
  } catch (error) {
    console.error('❌ 명령어 파일 생성 중 오류 발생:', error);
  }
}

// 직접 실행 시
if (process.argv[1] && process.argv[1].endsWith('commandGenerator.js')) {
  console.log('🚀 STM 명령어 파일 생성 시작...');
  
  // 개발용으로 실행
  generateCommandFilesDev().then(() => {
    console.log('✅ 개발용 명령어 파일 생성 완료!');
  }).catch((error) => {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  });
} 