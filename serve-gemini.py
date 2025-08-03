#!/usr/bin/env python3
"""
Gemini CLI용 Shrimp Task Manager 서버
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # CORS 헤더 추가
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def serve_html():
    """HTML 파일을 서빙하는 함수"""
    PORT = 8080
    
    # 현재 디렉토리를 웹 루트로 설정
    os.chdir(Path(__file__).parent)
    
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"🚀 Shrimp Task Manager가 http://localhost:{PORT}에서 실행 중입니다")
        print(f"📁 HTML 파일: gemini-cli-version.html")
        print("🌐 브라우저에서 자동으로 열립니다...")
        
        # 브라우저에서 자동으로 열기
        webbrowser.open(f'http://localhost:{PORT}/gemini-cli-version.html')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 서버가 종료되었습니다.")

if __name__ == "__main__":
    serve_html() 