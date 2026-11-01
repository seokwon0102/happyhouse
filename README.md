# 가게 매출노트

자영업자용 매출 분석 사이트입니다. 주문을 기록하면 하루·한 달 매출, 메뉴별 판매, 시간대별 인기 메뉴, 성별·연령대 비교, 날씨·계절별 판매를 보여 줍니다.

- 화면: `index.html` 한 파일 (빌드 과정 없음)
- 저장소·로그인: Firebase (Firestore + Google 로그인), 무료 요금제로 충분
- 호스팅: GitHub Pages (무료), 원하면 내 도메인 연결

설정 전에도 사이트는 열리고, 샘플 데이터로 모든 화면을 둘러볼 수 있습니다.

---

## 1. Firebase 프로젝트 만들기 (약 10분)

1. https://console.firebase.google.com 에서 **프로젝트 추가** → 이름(예: `maechul-note`) → Google 애널리틱스는 꺼도 됩니다.
2. **빌드 › Authentication › 시작하기** → 로그인 방법에서 **Google** 사용 설정 → 저장.
3. **빌드 › Firestore Database › 데이터베이스 만들기**
   - 위치: `asia-northeast3 (서울)`
   - **프로덕션 모드**로 시작
4. Firestore의 **규칙** 탭에 이 폴더의 `firestore.rules` 내용을 통째로 붙여 넣습니다.
   - 맨 위 `ownerEmail()` 의 `owner@example.com` 을 **사장님 Google 이메일**로 바꾼 뒤 **게시**.
5. **프로젝트 설정(톱니바퀴) › 일반 › 내 앱 › 웹(</>)** 으로 앱 등록 → 나오는 `firebaseConfig` 값을 복사합니다.
6. `js/config.js` 를 열어
   - `firebaseConfig` 의 `YOUR_...` 값을 복사한 값으로 바꾸고
   - `OWNER_EMAIL` 을 4번과 **똑같은 이메일**로 바꿉니다.

> `firebaseConfig` 값은 공개되어도 괜찮습니다. 누가 읽고 쓸 수 있는지는 보안 규칙이 정합니다.

## 2. GitHub에 올리기

1. https://github.com 에서 새 저장소(Repository)를 만듭니다. 예: `maechul-note` (Public)
2. 이 폴더에서 아래 명령을 차례로 실행합니다. `내아이디` 는 GitHub 아이디로 바꾸세요.

```bash
git init
git add .
git commit -m "가게 매출노트 첫 버전"
git branch -M main
git remote add origin https://github.com/내아이디/maechul-note.git
git push -u origin main
```

3. 저장소의 **Settings › Pages** → Source: **Deploy from a branch**, Branch: **main / (root)** → Save.
4. 1–2분 뒤 `https://내아이디.github.io/maechul-note/` 로 접속됩니다.

## 3. 로그인 허용 주소 등록

Firebase 콘솔 **Authentication › 설정 › 승인된 도메인**에 아래를 추가합니다.

- `내아이디.github.io`
- (도메인을 연결했다면) `내도메인.com`

이걸 빠뜨리면 Google 로그인 팝업에서 오류가 납니다.

## 4. 처음 사용하기

1. 사이트에서 **Google로 로그인** (사장님 이메일로) → 자동으로 사장님으로 등록됩니다.
2. **메뉴 설정** 탭에서 메뉴·가격·영업시간 저장.
3. 같은 탭의 **직원 관리**에서 직원 Google 이메일을 초대 → 직원이 사이트에서 그 계정으로 로그인하면 자동 등록.
4. **주문 기록** 탭에서 주문 입력, **날씨 분석** 탭에서 기상청 CSV를 불러오거나 날씨를 입력.

| | 사장님 | 직원 |
|---|---|---|
| 주문·날씨 기록, 대시보드 보기 | O | O |
| 메뉴·가격·영업시간 변경 | O | X |
| 직원 초대·내보내기 | O | X |

## 5. 내 도메인 연결 (선택)

1. 가비아, Cloudflare, 호스팅케이알 등에서 도메인을 삽니다. (`.com` 기준 연 1–2만 원)
2. GitHub 저장소 **Settings › Pages › Custom domain** 에 `www.내도메인.com` 입력 → Save.
3. 도메인 회사의 DNS 설정에서
   - `www` → **CNAME** → `내아이디.github.io`
   - (루트 도메인도 쓰려면) `@` → **A** 레코드 4개: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
4. DNS가 퍼지면(수 분–하루) **Enforce HTTPS** 를 켭니다.
5. 3번 단계처럼 Firebase 승인된 도메인에 새 도메인을 추가합니다.

## 데이터 구조 (Firestore)

| 경로 | 내용 |
|---|---|
| `days/<날짜>_<기기>` | 그날 그 기기에서 받은 주문 배열 `{date, device, orders:[{h, min, g, age, items:[{n, p, q}], at}]}` |
| `weather/<날짜>` | `{date, sky, tavg, tmax, tmin, rain, hum, wind, src}` |
| `settings/menu` | `{items:[{name, price}], open, close}` |
| `members/<uid>` | `{role: 'owner' 또는 'staff', email}` |
| `invites/<이메일>` | `{role: 'staff'}` |

기기마다 하루 문서를 따로 두기 때문에, 포스 태블릿과 휴대폰에서 동시에 주문을 넣어도 서로 덮어쓰지 않습니다.

## 무료 한도 참고

Firebase 무료(Spark) 요금제는 하루 읽기 5만 회, 쓰기 2만 회, 저장 1GB까지입니다. 하루 주문 수백 건 규모의 가게 한 곳은 충분히 무료로 쓸 수 있습니다.
