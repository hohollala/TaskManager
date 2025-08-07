#!/usr/bin/env node

import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { generateCommandFiles } from './dist/utils/commandGenerator.js';

async function forceInstallCommands() {
  try {
    console.log('🔧 STM 명령어를 강제로 설치합니다...');
    
    const homeDir = homedir();
    const commandsDir = join(homeDir, '.claude', 'commands', 'stm');
    
    console.log(`📁 설치 경로: ${commandsDir}`);
    
    // 기존 디렉토리가 있으면 삭제
    try {
      await fs.rm(commandsDir, { recursive: true, force: true });
      console.log('🗑️ 기존 디렉토리 삭제됨');
    } catch (error) {
      console.log('ℹ️ 기존 디렉토리가 없습니다');
    }
    
    // 명령어 파일들 강제 생성
    await generateCommandFiles();
    
    // 생성된 파일 목록 확인
    const files = await fs.readdir(commandsDir);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    console.log(`📋 생성된 .md 파일들: ${mdFiles.join(', ')}`);
    console.log(`📊 총 ${mdFiles.length}개의 명령어 파일이 생성되었습니다`);
    
    console.log('✅ STM 명령어 설치 완료!');
    
  } catch (error) {
    console.error('❌ 설치 실패:', error);
    process.exit(1);
  }
}

forceInstallCommands();
