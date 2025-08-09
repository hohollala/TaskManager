import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 작업 뷰어를 시작합니다...');

// task_viewer 디렉토리로 이동
const taskViewerPath = path.join(__dirname, '..', 'task_viewer');

// 환경변수 설정 (Windows PowerShell 방식)
process.env.PORT = '3001';

// npm start 실행
const child = spawn('npm', ['start'], {
    cwd: taskViewerPath,
    stdio: 'inherit',
    shell: true,
    env: {
        ...process.env,
        PORT: '3001'
    }
});

child.on('error', (error) => {
    console.error('❌ 작업 뷰어 시작 실패:', error.message);
    console.log('💡 해결 방법:');
    console.log('1. task_viewer 폴더가 존재하는지 확인하세요');
    console.log('2. task_viewer 폴더에서 npm install을 실행하세요');
    process.exit(1);
});

child.on('exit', (code) => {
    if (code !== 0) {
        console.error(`❌ 작업 뷰어가 종료되었습니다 (코드: ${code})`);
    }
}); 