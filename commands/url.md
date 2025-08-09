# /stm:get_url

웹 GUI의 URL을 조회합니다.

## 사용법

```
/stm:get_url
```

## 설명

실행 중인 웹 GUI 서버의 URL을 `http://localhost:포트번호` 형태로 출력합니다.

## 동작 방식

1. 현재 작업 디렉토리의 `WebGUI.md` 파일에서 URL 찾기
2. 없으면 `docs/WebGUI.md`에서 찾기  
3. 그래도 없으면 netstat으로 실행 중인 포트 검색
4. 찾으면 URL 출력, 못 찾으면 "웹서버가 실행되지 않았습니다" 출력

## 예시

```
/stm:get_url
```

출력:
```
http://localhost:3000
```

## 관련 명령어

- `/stm:init` - 프로젝트 초기화