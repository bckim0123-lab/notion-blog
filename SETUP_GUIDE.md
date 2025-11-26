# Notion Blog 설정 가이드

이 가이드는 Notion Blog를 처음부터 설정하는 전체 과정을 단계별로 안내합니다.

## 목차

1. [Notion 설정](#1-notion-설정)
2. [프로젝트 설정](#2-프로젝트-설정)
3. [로컬 실행](#3-로컬-실행)
4. [첫 게시글 작성](#4-첫-게시글-작성)
5. [배포](#5-배포)

---

## 1. Notion 설정

### 1.1 Notion Integration 만들기

Notion Integration은 외부 애플리케이션이 Notion 데이터에 접근할 수 있도록 하는 인증 키입니다.

**단계:**

1. 브라우저에서 [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations) 접속
2. 로그인 후 **"+ New integration"** 버튼 클릭
3. 다음 정보 입력:
   - **Name**: `My Blog` (원하는 이름)
   - **Associated workspace**: 블로그를 만들 워크스페이스 선택
   - **Type**: Internal Integration 선택
4. **"Submit"** 클릭
5. 생성된 페이지에서 **"Internal Integration Token"** 복사
   - 형식: `secret_xxxxxxxxxxxxxxxxxxx`
   - 이것이 `NOTION_API_KEY`입니다. 안전하게 보관하세요!

### 1.2 Notion 데이터베이스 생성

블로그 게시글을 관리할 데이터베이스를 만듭니다.

**단계:**

1. Notion에서 새 페이지 생성
2. 페이지 이름: "Blog Posts" (또는 원하는 이름)
3. 페이지 안에서 `/database` 입력하고 **"Table - Inline"** 선택
4. 데이터베이스가 생성되면 기본 속성을 아래와 같이 수정:

#### 필수 속성 (Properties)

| 속성 이름 | Notion 타입 | 설명 |
|-----------|------------|------|
| **Name** | Title | 게시글 제목 (기본으로 있음) |
| **Slug** | Text | URL에 사용될 고유 식별자 |
| **Published** | Checkbox | 게시 여부 (체크하면 블로그에 표시) |
| **Published Date** | Date | 게시 날짜 |
| **Summary** | Text | 게시글 요약 (150자 이내 권장) |
| **Category** | Select | 카테고리 (예: Tutorial, Development) |
| **Files** | Files & media | 썸네일 이미지 |

**속성 추가 방법:**

1. 테이블 헤더에서 **"+"** 버튼 클릭
2. 속성 이름 입력
3. 타입 선택
4. 모든 속성 추가 완료

### 1.3 Integration 연결

Integration이 데이터베이스에 접근할 수 있도록 연결합니다.

**단계:**

1. 데이터베이스 페이지 오른쪽 상단 **"..."** (점 세 개) 클릭
2. **"Connections"** 선택
3. **"Connect to"** 클릭
4. 앞서 만든 Integration (예: "My Blog") 선택
5. 연결 완료!

### 1.4 Database ID 찾기

**단계:**

1. 데이터베이스 페이지를 전체 페이지로 열기
2. 브라우저 주소창의 URL 확인:
   \`\`\`
   https://www.notion.so/[워크스페이스명]/[DATABASE_ID]?v=[VIEW_ID]
   \`\`\`
3. `DATABASE_ID` 부분을 복사 (32자리 영숫자)
   - 예: `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p`

---

## 2. 프로젝트 설정

### 2.1 프로젝트 다운로드

프로젝트를 이미 다운로드했다면 이 단계는 건너뛰세요.

### 2.2 환경 변수 설정

**단계:**

1. 프로젝트 루트 디렉토리에서 `.env.example` 파일을 `.env.local`로 복사:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. `.env.local` 파일을 열고 값 입력:
   \`\`\`bash
   # Notion API Key (1.1에서 복사한 Integration Token)
   NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxx
   
   # Notion Database ID (1.4에서 복사한 ID)
   NOTION_DATABASE_ID=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
   
   # 사이트 URL (로컬 개발 시)
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   \`\`\`

3. 파일 저장

---

## 3. 로컬 실행

### 3.1 의존성 설치

터미널에서 프로젝트 디렉토리로 이동 후:

\`\`\`bash
npm install
\`\`\`

### 3.2 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

성공 메시지:
\`\`\`
✓ Ready on http://localhost:3000
\`\`\`

### 3.3 브라우저에서 확인

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

- 환경 변수가 설정되지 않았다면 목(mock) 데이터가 표시됩니다
- 정상적으로 설정되었다면 Notion 데이터를 가져옵니다

---

## 4. 첫 게시글 작성

### 4.1 Notion에서 게시글 추가

1. Notion의 "Blog Posts" 데이터베이스 열기
2. **"New"** 버튼 클릭하여 새 행 추가
3. 각 속성 입력:

**예시:**

| 속성 | 값 |
|------|-----|
| **Name** | `Notion Blog 시작하기` |
| **Slug** | `getting-started` |
| **Published** | ✅ (체크) |
| **Published Date** | `2024-01-20` (오늘 날짜) |
| **Summary** | `Notion을 CMS로 사용하는 블로그를 만들어봅니다.` |
| **Category** | `Tutorial` |
| **Files** | (이미지 업로드 - 선택사항) |

4. 행을 클릭하여 전체 페이지로 열기
5. 페이지 본문에 콘텐츠 작성:

\`\`\`markdown
# 환영합니다!

Notion Blog에 오신 것을 환영합니다.

## 주요 기능

- Notion을 CMS로 활용
- SEO 최적화
- 반응형 디자인

즐거운 블로깅 되세요!
\`\`\`

### 4.2 블로그에서 확인

1. 브라우저를 새로고침 (Ctrl+R / Cmd+R)
2. 홈페이지에 게시글이 표시됨
3. 게시글 클릭하여 상세 페이지 확인

---

## 5. 배포

### 5.1 Vercel에 배포 (권장)

**단계:**

1. GitHub에 코드 푸시:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin [your-github-repo-url]
   git push -u origin main
   \`\`\`

2. [Vercel](https://vercel.com) 접속 및 로그인

3. **"New Project"** 클릭

4. GitHub 저장소 선택 및 Import

5. **"Environment Variables"** 섹션에서 환경 변수 추가:
   - `NOTION_API_KEY`: (Integration Token)
   - `NOTION_DATABASE_ID`: (Database ID)
   - `NEXT_PUBLIC_BASE_URL`: (배포 URL, 예: `https://myblog.vercel.app`)

6. **"Deploy"** 클릭

7. 배포 완료 후 할당된 URL로 접속!

### 5.2 환경 변수 업데이트

배포 후 실제 도메인으로 `NEXT_PUBLIC_BASE_URL` 업데이트:

1. Vercel 프로젝트 대시보드 → **"Settings"** → **"Environment Variables"**
2. `NEXT_PUBLIC_BASE_URL` 수정
3. **"Save"**
4. **"Deployments"** 탭에서 최신 배포 → **"Redeploy"**

---

## 문제 해결

### "게시글이 표시되지 않아요"

**체크리스트:**

- [ ] Notion에서 "Published" 체크박스가 활성화되어 있나요?
- [ ] Integration이 데이터베이스에 연결되어 있나요?
- [ ] `.env.local` 파일의 환경 변수가 정확한가요?
- [ ] 개발 서버를 재시작했나요? (`Ctrl+C` 후 `npm run dev`)

### "이미지가 로드되지 않아요"

- Notion 이미지 URL은 만료될 수 있습니다
- 중요한 이미지는 별도 호스팅 권장 (Cloudinary, Vercel Blob 등)

### "API 오류가 발생해요"

- `NOTION_API_KEY`가 올바른지 확인
- Integration이 올바른 워크스페이스에 연결되어 있는지 확인
- Database ID가 정확한지 확인

---

## 다음 단계

축하합니다! 이제 Notion Blog가 실행 중입니다. 

**추가로 할 수 있는 것:**

- 디자인 커스터마이징 (Tailwind CSS 활용)
- 카테고리별 필터링 기능 추가
- 검색 기능 구현
- 댓글 시스템 통합
- Google Analytics 연동

즐거운 블로깅 되세요! 🎉
