# 📅 자동 책 수집 설정 가이드

## 🎯 개요
주기적으로 알라딘 API에서 신간/베스트셀러를 자동 수집하여 데이터베이스에 저장하는 시스템 구축

## 🛠️ 방법 1: Supabase Edge Functions (추천)

### 1단계: Edge Function 배포
```bash
# Supabase CLI 설치 (아직 안했다면)
npm install -g supabase

# Supabase 프로젝트 링크
supabase link --project-ref [YOUR_PROJECT_REF]

# Edge Function 배포
supabase functions deploy daily-book-sync
```

### 2단계: 환경 변수 설정
Supabase 대시보드 > Settings > Edge Functions > Environment variables

```
ALADIN_API_KEY=ttbdlstjr201944002
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3단계: 크론 작업 설정
Supabase 대시보드 > Database > Cron

```sql
-- 매일 오전 6시에 실행
SELECT cron.schedule(
  'daily-book-sync',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/daily-book-sync',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer your-anon-key"}'::jsonb
  );
  $$
);
```

## 🛠️ 방법 2: GitHub Actions (무료 대안)

### 장점
- ✅ 완전 무료
- ✅ 이미 설정 파일 있음 (`.github/workflows/daily-book-sync.yml`)
- ✅ GitHub Secrets로 API 키 안전 관리

### 활성화 방법
1. GitHub 저장소 생성
2. 프로젝트 푸시
3. GitHub > Settings > Secrets에 환경 변수 추가:
   - `VITE_ALADIN_API_KEY`
   - `VITE_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 실행 스케줄
```yaml
# 매일 오전 6시 (한국시간 오후 3시)
schedule:
  - cron: '0 6 * * *'
```

## 🛠️ 방법 3: Vercel/Netlify Functions

### Vercel 설정
```javascript
// api/daily-book-sync.js
export default async function handler(req, res) {
  // 책 수집 로직
  // (기존 스크립트와 동일)
}
```

### 크론 설정
- Vercel Cron Jobs 사용
- 또는 외부 서비스 (cron-job.org) 활용

## 📊 모니터링

### 1. 로그 확인
- Supabase: Edge Functions 로그
- GitHub: Actions 실행 기록
- Vercel: Functions 로그

### 2. 알림 설정
```sql
-- 실패 시 알림 (Supabase Function)
CREATE OR REPLACE FUNCTION notify_sync_status()
RETURNS void AS $$
BEGIN
  -- 슬랙/이메일 알림 로직
END;
$$ LANGUAGE plpgsql;
```

## 🎯 권장사항

### 운영 환경
1. **Supabase Edge Functions** (완전 통합 솔루션)
2. **GitHub Actions** (무료 & 안정적)

### 개발/테스트
- 로컬 스크립트 수동 실행

### 데이터 품질 관리
- 중복 방지 로직
- 실패 재시도 메커니즘
- 데이터 검증

## 🔧 트러블슈팅

### API 제한
- 알라딘 API 호출 간격 조절 (1초)
- 요청량 제한 대응

### 데이터 타입 오류
- `smallint` 범위 초과 처리
- `null` 값 안전 처리

### 네트워크 오류
- 재시도 로직 구현
- 타임아웃 설정
