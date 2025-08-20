#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * 중요한 설정 파일들을 안전하게 export하는 스크립트
 * .gitignore된 파일들 중 중요한 설정들을 백업용으로 export
 */

const PROJECT_ROOT = path.join(__dirname, '..');
const EXPORT_DIR = path.join(PROJECT_ROOT, 'config-backup');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];

// Export할 중요한 파일들 목록
const IMPORTANT_FILES = [
  {
    source: '.env',
    template: '.env.template',
    description: '환경변수 설정 (API 키, 데이터베이스 정보)',
    maskSecrets: true
  },
  {
    source: '.env.local',
    template: '.env.local.template',
    description: '로컬 환경변수',
    maskSecrets: true
  },
  {
    source: 'supabase/.env',
    template: 'supabase/.env.template',
    description: 'Supabase 환경변수',
    maskSecrets: true
  },
  {
    source: '.vscode/settings.json',
    template: '.vscode/settings.template.json',
    description: 'VSCode 프로젝트 설정',
    maskSecrets: false
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

function exportFile(fileConfig, exportPath) {
  const sourcePath = path.join(PROJECT_ROOT, fileConfig.source);
  const templatePath = path.join(exportPath, fileConfig.template);
  
  // 파일이 존재하는지 확인
  if (!fs.existsSync(sourcePath)) {
    console.log(`⚠️  ${fileConfig.source} - 파일이 없습니다 (건너뜀)`);
    return false;
  }
  
  // 디렉토리 생성
  const templateDir = path.dirname(templatePath);
  if (!fs.existsSync(templateDir)) {
    fs.mkdirSync(templateDir, { recursive: true });
  }
  
  let content;
  
  // .env 파일들은 특별 처리
  if (fileConfig.source.includes('.env')) {
    content = processEnvFile(sourcePath, fileConfig.maskSecrets);
  } else {
    // 일반 파일들
    try {
      content = fs.readFileSync(sourcePath, 'utf-8');
      if (fileConfig.maskSecrets) {
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
      console.log(`❌ ${fileConfig.source} - 읽기 실패: ${error.message}`);
      return false;
    }
  }
  
  if (content !== null) {
    fs.writeFileSync(templatePath, content);
    console.log(`✅ ${fileConfig.source} → ${fileConfig.template}`);
    return true;
  } else {
    console.log(`❌ ${fileConfig.source} - 처리 실패`);
    return false;
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

function createReadme(exportPath, exportedFiles) {
  const readmeContent = `# 설정 파일 백업 (${TIMESTAMP})

이 폴더는 중요한 설정 파일들의 백업 템플릿입니다.

## ⚠️ 보안 주의사항
- 이 파일들은 민감한 정보가 마스킹된 템플릿입니다
- 실제 배포 시에는 마스킹된 값들을 실제 값으로 교체해야 합니다
- 이 백업 파일들도 안전한 곳에 보관하세요

## 📁 포함된 파일들

${exportedFiles.map(file => `### ${file.template}
- **원본**: ${file.source}
- **설명**: ${file.description}
- **민감정보 마스킹**: ${file.maskSecrets ? '✅' : '❌'}
`).join('\n')}

## 🔧 복원 방법

1. 해당 템플릿 파일을 원본 위치에 복사
2. 마스킹된 값들을 실제 값으로 교체
3. 파일명에서 '.template' 제거

## 🔐 마스킹 규칙

- API 키, 비밀번호 등 민감한 값들은 \`****\` 로 마스킹됨
- 8글자 이상인 경우 앞 4글자 + 마스킹 + 뒤 4글자 형태
- 주석과 구조는 그대로 유지

---
*생성일: ${new Date().toISOString()}*
*프로젝트: BookMood*
`;

  fs.writeFileSync(path.join(exportPath, 'README.md'), readmeContent);
}

function main() {
  console.log('🔧 중요 설정 파일 백업 시작...\n');
  
  const exportPath = createExportDirectory();
  console.log(`📁 백업 디렉토리: ${exportPath}\n`);
  
  const exportedFiles = [];
  
  for (const fileConfig of IMPORTANT_FILES) {
    const success = exportFile(fileConfig, exportPath);
    if (success) {
      exportedFiles.push(fileConfig);
    }
  }
  
  // README 파일 생성
  createReadme(exportPath, exportedFiles);
  
  console.log(`\n✨ 백업 완료!`);
  console.log(`📍 위치: ${exportPath}`);
  console.log(`📋 총 ${exportedFiles.length}개 파일 백업됨`);
  
  if (exportedFiles.length > 0) {
    console.log('\n⚠️  중요: 백업 파일들도 안전한 곳에 별도 보관하세요!');
    console.log('💡 복원 시에는 README.md를 참고하세요.');
  }
}

// 스크립트 실행
if (require.main === module) {
  main();
}

module.exports = { main, processEnvFile, maskSensitiveValue };
