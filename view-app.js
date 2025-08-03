import { chromium } from 'playwright';

(async () => {
  console.log('웹 애플리케이션을 브라우저에서 열고 있습니다...');
  
  const browser = await chromium.launch({ 
    headless: false,  // 브라우저 창을 보이게 함
    slowMo: 1000      // 천천히 실행
  });
  
  const page = await browser.newPage();
  
  try {
    // 웹 애플리케이션 접속
    await page.goto('http://localhost:3000');
    console.log('웹 애플리케이션에 접속했습니다!');
    console.log('브라우저 창에서 애플리케이션을 확인하세요.');
    
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