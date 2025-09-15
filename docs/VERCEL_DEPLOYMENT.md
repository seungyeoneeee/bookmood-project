# Vercel 배포 가이드

## 🚀 Vercel에 BookMood 프로젝트 배포하기

### 1. Vercel 계정 생성 및 GitHub 연동

1. [Vercel](https://vercel.com)에 접속하여 계정 생성
2. GitHub 계정으로 로그인
3. "New Project" 클릭

### 2. 프로젝트 Import

1. GitHub 저장소에서 `bookmood-project` 선택
2. Framework Preset: **Vite** 선택
3. Root Directory: `./` (기본값)
4. Build Command: `npm run build` (자동 감지됨)
5. Output Directory: `dist` (자동 감지됨)
6. Install Command: `npm install --legacy-peer-deps` (React 19 호환성)

### 3. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수들을 설정해주세요:

#### 필수 환경 변수
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### 선택적 환경 변수
```
VITE_OPENAI_API_KEY=your-openai-api-key
VITE_ALADIN_API_KEY=your-aladin-api-key
```

### 4. 환경 변수 설정 방법

1. Vercel 프로젝트 대시보드 → Settings → Environment Variables
2. 각 변수 추가:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: 실제 Supabase 프로젝트 URL
   - **Environment**: Production, Preview, Development 모두 선택
3. 모든 환경 변수에 대해 반복

### 5. 자동 배포 설정

✅ **기본적으로 활성화됨**: GitHub의 master 브랜치에 푸시할 때마다 자동 배포

#### 배포 트리거 조건:
- `git push origin master` 실행 시
- Pull Request 생성/업데이트 시 (Preview 배포)
- Vercel 대시보드에서 수동 배포

### 6. 배포 확인

1. 첫 배포 후 Vercel에서 제공하는 URL 확인
2. 애플리케이션이 정상적으로 로드되는지 테스트
3. Supabase 연결이 정상적으로 작동하는지 확인

### 7. 커스텀 도메인 설정 (선택사항)

1. Vercel 프로젝트 → Settings → Domains
2. 원하는 도메인 추가
3. DNS 설정에 따라 도메인 연결

### 8. 배포 상태 모니터링

- **Vercel 대시보드**: 실시간 배포 상태 확인
- **GitHub Actions**: 자동 배포 로그 확인
- **Vercel CLI**: 로컬에서 배포 상태 확인

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포 상태 확인
vercel ls
```

### 9. 문제 해결

#### 빌드 실패 시:
1. Vercel 대시보드 → Functions → Build Logs 확인
2. 환경 변수가 올바르게 설정되었는지 확인
3. `npm install --legacy-peer-deps` 명령어가 실행되는지 확인

#### 환경 변수 문제:
1. 모든 환경 변수가 Production, Preview, Development에 설정되었는지 확인
2. 변수명이 정확한지 확인 (VITE_ 접두사 필수)

### 10. 성능 최적화

- **이미지 최적화**: Vercel 자동 이미지 최적화 활용
- **CDN**: Vercel의 글로벌 CDN 자동 활용
- **캐싱**: 정적 자산 자동 캐싱

---

## 📝 배포 체크리스트

- [ ] Vercel 계정 생성 및 GitHub 연동
- [ ] 프로젝트 Import (Vite 프레임워크 선택)
- [ ] 환경 변수 설정 (Supabase URL, API Keys)
- [ ] 첫 배포 성공 확인
- [ ] 애플리케이션 기능 테스트
- [ ] 자동 배포 테스트 (master 브랜치 푸시)

---

## 🔗 유용한 링크

- [Vercel 공식 문서](https://vercel.com/docs)
- [Vite + Vercel 가이드](https://vercel.com/guides/deploying-vitejs-to-vercel)
- [환경 변수 설정 가이드](https://vercel.com/docs/concepts/projects/environment-variables)
