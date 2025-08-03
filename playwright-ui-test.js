const { chromium } = require('playwright');

(async () => {
  console.log('UI 테스트 시작...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const page = await browser.newPage();
  
  try {
    // 웹 애플리케이션 접속
    console.log('웹 애플리케이션에 접속 중...');
    await page.goto('http://localhost:3000');
    
    // 페이지 로딩 대기
    await page.waitForLoadState('networkidle');
    
    console.log('페이지 제목:', await page.title());
    
    // 모든 링크 찾기
    const links = await page.$$('a');
    console.log('발견된 링크 수:', links.length);
    
    // 모든 버튼 찾기
    const buttons = await page.$$('button');
    console.log('발견된 버튼 수:', buttons.length);
    
    // 모든 입력 필드 찾기
    const inputs = await page.$$('input');
    console.log('발견된 입력 필드 수:', inputs.length);
    
    // 페이지의 모든 텍스트 내용 가져오기
    const textContent = await page.textContent('body');
    console.log('페이지 텍스트 길이:', textContent.length);
    
    // 스크린샷 찍기
    await page.screenshot({ 
      path: 'ui-test-screenshot.png',
      fullPage: true 
    });
    console.log('UI 테스트 스크린샷이 ui-test-screenshot.png에 저장되었습니다.');
    
    // 5초 대기
    console.log('5초간 UI를 관찰합니다...');
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('UI 테스트 중 오류 발생:', error.message);
  } finally {
    await browser.close();
    console.log('UI 테스트 완료!');
  }
})(); 