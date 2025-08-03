const { chromium } = require('playwright');

(async () => {
  console.log('플레이라이트 테스트 시작...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 // 각 액션 사이에 1초 대기
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('웹 애플리케이션에 접속 중...');
    await page.goto('http://localhost:3000');
    
    console.log('페이지 제목:', await page.title());
    console.log('현재 URL:', page.url());
    
    // 페이지 내용 확인
    const content = await page.content();
    console.log('페이지 내용 길이:', content.length);
    
    // 스크린샷 찍기
    await page.screenshot({ 
      path: 'playwright-screenshot.png',
      fullPage: true 
    });
    console.log('전체 페이지 스크린샷이 playwright-screenshot.png에 저장되었습니다.');
    
    // 페이지 요소들 확인
    const elements = await page.$$('*');
    console.log('페이지의 총 요소 수:', elements.length);
    
    // 10초 대기
    console.log('10초간 페이지를 관찰합니다...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('테스트 중 오류 발생:', error.message);
  } finally {
    await browser.close();
    console.log('플레이라이트 테스트 완료!');
  }
})(); 