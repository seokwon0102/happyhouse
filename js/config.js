// Firebase 콘솔 > 프로젝트 설정 > 내 앱(웹) 에서 복사한 값을 붙여 넣으세요.
// 이 값들은 공개되어도 괜찮습니다. 데이터는 firestore.rules 보안 규칙이 지킵니다.
// 값을 채우기 전에는 사이트가 샘플 데이터로만 동작합니다.
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// 사장님의 Google 계정 이메일. firestore.rules 의 ownerEmail() 과 똑같이 적어야 합니다.
export const OWNER_EMAIL = "owner@example.com";
