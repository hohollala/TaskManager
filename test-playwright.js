const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('웹 애플리케이션에 접속 중...');
  await page.goto('http://localhost:3000');
  
  console.log('페이지 제목:', await page.title());
  
  // 스크린샷 찍기
  await page.screenshot({ path: 'screenshot.png' });
  console.log('스크린샷이 screenshot.png에 저장되었습니다.');
  
  // 잠시 대기
  await page.waitForTimeout(5000);
  
  await browser.close();
  console.log('테스트 완료!');
})(); 