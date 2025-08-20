#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Git에 올라가지 않는 모든 중요한 파일들을 백업하는 스크립트
 * - .gitignore된 파일들
 * - Untracked 파일들 (scripts, docs, .github 등)
 */

const PROJECT_ROOT = path.join(__dirname, '..');
const EXPORT_DIR = path.join(PROJECT_ROOT, 'config-backup');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];

// Export할 중요한 파일들과 폴더들 목록
const IMPORTANT_ITEMS = [
  // 환경변수 파일들
  {
    source: '.env',
    template: '.env.template',
    description: '환경변수 설정 (API 키, 데이터베이스 정보)',
    maskSecrets: true,
    type: 'file'
  },
  {
    source: '.env.example',
    template: '.env.example',
    description: '환경변수 예제 파일',
    maskSecrets: false,
    type: 'file'
  },
  
  // 스크립트 폴더 전체
  {
    source: 'scripts',
    template: 'scripts',
    description: '모든 유틸리티 스크립트들',
    maskSecrets: true,
    type: 'folder'
  },
  
  // GitHub Actions 설정
  {
    source: '.github',
    template: '.github',
    description: 'GitHub Actions 워크플로우',
    maskSecrets: false,
    type: 'folder'
  },
  
  // 문서 폴더
  {
    source: 'docs',
    template: 'docs',
    description: '프로젝트 문서들',
    maskSecrets: false,
    type: 'folder'
  },
  
  // Supabase 설정
  {
    source: 'supabase',
    template: 'supabase',
    description: 'Supabase 설정 및 함수들',
    maskSecrets: true,
    type: 'folder'
  },
  
  // 추가 설정 파일들
  {
    source: 'SUPABASE_SETUP.md',
    template: 'SUPABASE_SETUP.md',
    description: 'Supabase 설정 가이드',
    maskSecrets: false,
    type: 'file'
  },
  {
    source: 'postcss.config.js',
    template: 'postcss.config.js',
    description: 'PostCSS 설정',
    maskSecrets: false,
    type: 'file'
  },
  {
    source: 'tailwind.config.js',
    template: 'tailwind.config.js',
    description: 'Tailwind CSS 설정',
    maskSecrets: false,
    type: 'file'
  }
];

// 민감한 정보를 마스킹할 키워드들
const SECRET_KEYWORDS = [
  'key', 'secret', 'password', 'token', 'api', 'auth',
  'private', 'credential', 'client_secret', 'database_url'
];

function createExportDirectory() {
  const exportPath = path.join(EXPORT_DIR, `backup-${TIMESTAMP}`);
  if (!fs.existsSync(exportPath)) {
    fs.mkdirSync(exportPath, { recursive: true });
  }
  return exportPath;
}

function maskSensitiveValue(key, value) {
  const keyLower = key.toLowerCase();
  const isSecret = SECRET_KEYWORDS.some(keyword => keyLower.includes(keyword));
  
  if (isSecret && value) {
    // 첫 4글자와 마지막 4글자만 보여주고 나머지는 마스킹
    if (value.length > 8) {
      const start = value.substring(0, 4);
      const end = value.substring(value.length - 4);
      const middle = '*'.repeat(value.length - 8);
      return `${start}${middle}${end}`;
    } else {
      return '*'.repeat(value.length);
    }
  }
  return value;
}

function processEnvFile(filePath, maskSecrets = true) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    const processedLines = lines.map(line => {
      // 주석이나 빈 줄은 그대로 유지
      if (line.trim().startsWith('#') || line.trim() === '') {
        return line;
      }
      
      // KEY=VALUE 형태 파싱
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match && maskSecrets) {
        const [, key, value] = match;
        const maskedValue = maskSensitiveValue(key.trim(), value);
        return `${key}=${maskedValue}`;
      }
      
      return line;
    });
    
    return processedLines.join('\n');
  } catch (error) {
    return null;
  }
}

function copyFolderRecursively(source, target, maskSecrets = false) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
  
  const items = fs.readdirSync(source);
  
  for (const item of items) {
    const sourcePath = path.join(source, item);
    const targetPath = path.join(target, item);
    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      // node_modules나 .git 같은 폴더는 건너뛰기
      if (item === 'node_modules' || item === '.git' || item === 'dist') {
        continue;
      }
      copyFolderRecursively(sourcePath, targetPath, maskSecrets);
    } else {
      // 파일 복사
      try {
        let content;
        
        // .env 파일들은 특별 처리
        if (item.includes('.env') && maskSecrets) {
          content = processEnvFile(sourcePath, true);
          if (content !== null) {
            fs.writeFileSync(targetPath, content);
          }
        } else if (maskSecrets && (item.endsWith('.js') || item.endsWith('.ts'))) {
          // 스크립트 파일들도 민감정보 마스킹
          content = fs.readFileSync(sourcePath, 'utf-8');
          // 간단한 패턴 마스킹 (API 키 등)
          content = content.replace(/(api[_-]?key|secret|password|token)\s*[:=]\s*['"`]([^'"`]+)['"`]/gi, 
            (match, key, value) => {
              const maskedValue = maskSensitiveValue(key, value);
              return match.replace(value, maskedValue);
            });
          fs.writeFileSync(targetPath, content);
        } else {
          // 일반 파일은 그대로 복사
          fs.copyFileSync(sourcePath, targetPath);
        }
      } catch (error) {
        console.log(`⚠️  ${sourcePath} 복사 실패: ${error.message}`);
      }
    }
  }
}

function exportItem(itemConfig, exportPath) {
  const sourcePath = path.join(PROJECT_ROOT, itemConfig.source);
  const templatePath = path.join(exportPath, itemConfig.template);
  
  // 파일/폴더가 존재하는지 확인
  if (!fs.existsSync(sourcePath)) {
    console.log(`⚠️  ${itemConfig.source} - 없습니다 (건너뜀)`);
    return false;
  }
  
  if (itemConfig.type === 'folder') {
    // 폴더 복사
    try {
      copyFolderRecursively(sourcePath, templatePath, itemConfig.maskSecrets);
      console.log(`📁 ${itemConfig.source}/ → ${itemConfig.template}/`);
      return true;
    } catch (error) {
      console.log(`❌ ${itemConfig.source} 폴더 복사 실패: ${error.message}`);
      return false;
    }
  } else {
    // 파일 복사
    // 디렉토리 생성
    const templateDir = path.dirname(templatePath);
    if (!fs.existsSync(templateDir)) {
      fs.mkdirSync(templateDir, { recursive: true });
    }
    
    let content;
    
    // .env 파일들은 특별 처리
    if (itemConfig.source.includes('.env')) {
      content = processEnvFile(sourcePath, itemConfig.maskSecrets);
    } else {
      // 일반 파일들
      try {
        content = fs.readFileSync(sourcePath, 'utf-8');
        if (itemConfig.maskSecrets) {
          // JSON 파일의 경우 민감한 값들 마스킹
          try {
            const jsonData = JSON.parse(content);
            // JSON 내 민감한 값들 재귀적으로 마스킹
            const maskedData = maskJsonRecursively(jsonData);
            content = JSON.stringify(maskedData, null, 2);
          } catch {
            // JSON이 아닌 경우 그대로 유지
          }
        }
      } catch (error) {
        console.log(`❌ ${itemConfig.source} - 읽기 실패: ${error.message}`);
        return false;
      }
    }
    
    if (content !== null) {
      fs.writeFileSync(templatePath, content);
      console.log(`✅ ${itemConfig.source} → ${itemConfig.template}`);
      return true;
    } else {
      console.log(`❌ ${itemConfig.source} - 처리 실패`);
      return false;
    }
  }
}

function maskJsonRecursively(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(maskJsonRecursively);
  }
  
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = maskSensitiveValue(key, value);
    } else if (typeof value === 'object') {
      result[key] = maskJsonRecursively(value);
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

function createReadme(exportPath, exportedItems) {
  const readmeContent = `# 프로젝트 백업 (${TIMESTAMP})

이 폴더는 Git에 올라가지 않는 중요한 파일들과 폴더들의 백업입니다.

## 📦 백업 내용
- **설정 파일들**: .env, postcss.config.js, tailwind.config.js 등
- **스크립트 폴더**: scripts/ (모든 유틸리티 스크립트)
- **GitHub Actions**: .github/ (워크플로우 설정)
- **문서 폴더**: docs/ (프로젝트 문서)
- **Supabase 설정**: supabase/ (함수 및 설정)

## ⚠️ 보안 주의사항
- 민감한 정보가 포함된 파일들은 자동으로 마스킹됨
- 실제 배포 시에는 마스킹된 값들을 실제 값으로 교체해야 함
- 이 백업 파일들도 안전한 곳에 별도 보관 필요

## 📁 포함된 항목들

${exportedItems.map(item => `### ${item.type === 'folder' ? '📁' : '📄'} ${item.template}
- **원본**: ${item.source}
- **타입**: ${item.type === 'folder' ? '폴더' : '파일'}
- **설명**: ${item.description}
- **민감정보 마스킹**: ${item.maskSecrets ? '✅' : '❌'}
`).join('\n')}

## 🔧 복원 방법

### 파일 복원
1. 해당 템플릿 파일을 원본 위치에 복사
2. 마스킹된 값들을 실제 값으로 교체
3. 파일명에서 '.template' 제거 (해당하는 경우)

### 폴더 복원
1. 전체 폴더를 원본 위치에 복사
2. 마스킹된 값들이 있는 파일들을 실제 값으로 교체
3. node_modules는 \`npm install\` 또는 \`yarn install\`로 재생성

## 🔐 마스킹 규칙

- **환경변수**: API 키, 토큰 등은 앞뒤 4글자만 표시
- **스크립트**: 코드 내 API 키, 비밀번호 패턴 마스킹
- **일반 파일**: 민감정보 없으면 원본 그대로 보존

## 🚀 주요 스크립트 설명

- **export-config.cjs**: 이 백업 스크립트
- **bypass-rls-sync.js**: RLS 우회 동기화
- **add-wishlist-column.js**: 위시리스트 컬럼 추가
- **test-*.js**: 각종 테스트 스크립트
- **populate-*.js**: 데이터 채우기 스크립트

---
*생성일: ${new Date().toISOString()}*
*프로젝트: BookMood - React + Vite + Supabase*
`;

  fs.writeFileSync(path.join(exportPath, 'README.md'), readmeContent);
}

function main() {
  console.log('🔧 프로젝트 파일 백업 시작...\n');
  
  const exportPath = createExportDirectory();
  console.log(`📁 백업 디렉토리: ${exportPath}\n`);
  
  const exportedItems = [];
  
  for (const itemConfig of IMPORTANT_ITEMS) {
    const success = exportItem(itemConfig, exportPath);
    if (success) {
      exportedItems.push(itemConfig);
    }
  }
  
  // README 파일 생성
  createReadme(exportPath, exportedItems);
  
  console.log(`\n✨ 백업 완료!`);
  console.log(`📍 위치: ${exportPath}`);
  
  const folderCount = exportedItems.filter(item => item.type === 'folder').length;
  const fileCount = exportedItems.filter(item => item.type === 'file').length;
  
  console.log(`📁 폴더 ${folderCount}개, 📄 파일 ${fileCount}개 백업됨`);
  
  if (exportedItems.length > 0) {
    console.log('\n⚠️  중요: 백업 파일들도 안전한 곳에 별도 보관하세요!');
    console.log('💡 복원 시에는 README.md를 참고하세요.');
    console.log('🔒 민감한 정보는 자동으로 마스킹되었습니다.');
  }
}

// 스크립트 실행
if (require.main === module) {
  main();
}

module.exports = { main, processEnvFile, maskSensitiveValue, copyFolderRecursively, exportItem };
