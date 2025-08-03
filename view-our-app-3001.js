import { chromium } from 'playwright';

(async () => {
  console.log('3001번 포트에서 우리가 만든 Shrimp Task Manager를 확인합니다...');
  
  const browser = await chromium.launch({ 
    headless: false,  // 브라우저 창을 보이게 함
    slowMo: 1000      // 천천히 실행
  });
  
  const page = await browser.newPage();
  
  try {
    // 3001번 포트에서 우리가 만든 웹 애플리케이션 접속
    await page.goto('http://localhost:3001');
    console.log('Shrimp Task Manager에 접속했습니다!');
    console.log('브라우저 창에서 우리가 만든 애플리케이션을 확인하세요.');
    
    // 페이지 제목 확인
    const title = await page.title();
    console.log('페이지 제목:', title);
    
    // 페이지 내용 확인
    const content = await page.content();
    console.log('페이지 내용에 "Shrimp Task Manager" 포함 여부:', content.includes('Shrimp Task Manager'));
    
    // 브라우저 창을 최대화
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // 30초간 브라우저 창을 열어둠
    console.log('30초간 브라우저 창이 열려있습니다...');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('오류 발생:', error.message);
  } finally {
    await browser.close();
    console.log('브라우저가 닫혔습니다.');
  }
})(); 