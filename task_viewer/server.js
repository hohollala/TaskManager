const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS 설정
app.use(cors());

// 정적 파일 제공
app.use(express.static(__dirname));

// JSON 파일을 직접 제공하는 라우트
app.get('/api/tasks', (req, res) => {
    const dataPath = req.query.path;
    
    if (!dataPath) {
        return res.status(400).json({ error: '데이터 파일 경로가 필요합니다.' });
    }
    
    try {
        // 파일 경로 보안 검사
        const normalizedPath = path.normalize(dataPath);
        if (!fs.existsSync(normalizedPath)) {
            return res.status(404).json({ error: '파일을 찾을 수 없습니다.' });
        }
        
        const data = fs.readFileSync(normalizedPath, 'utf8');
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    } catch (error) {
        console.error('파일 읽기 오류:', error);
        res.status(500).json({ error: '파일을 읽을 수 없습니다.' });
    }
});

// 메인 페이지
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 작업 뷰어 서버가 시작되었습니다!`);
    console.log(`📱 브라우저에서 http://localhost:${PORT} 를 열어주세요.`);
    console.log(`📁 현재 디렉토리: ${__dirname}`);
    console.log(`🔧 포트: ${PORT}`);
    console.log(`\n💡 사용 방법:`);
    console.log(`1. 브라우저에서 페이지를 열어주세요`);
    console.log(`2. 설정 버튼을 클릭하여 tasks.json 파일 경로를 설정하세요`);
    console.log(`3. 자동 새로고침 간격을 설정할 수 있습니다`);
    console.log(`\n🛑 서버를 중지하려면 Ctrl+C를 누르세요.`);
});

// 에러 핸들링
process.on('uncaughtException', (err) => {
    console.error('예상치 못한 오류:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('처리되지 않은 Promise 거부:', reason);
}); 