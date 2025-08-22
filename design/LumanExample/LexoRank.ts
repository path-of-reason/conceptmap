// LexoRank.ts
// 간단한 Base62 사전식 중간 문자열 생성 유틸리티
// - 실제 프로덕션에서는 충돌/여백고갈/동시성에 더 강한 구현이 필요합니다.

const ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const MIN_CHAR = ALPHABET[0];
const MAX_CHAR = ALPHABET[ALPHABET.length - 1];

function charIndex(ch: string) {
  return ALPHABET.indexOf(ch);
}

function normalizeLength(a: string, b: string) {
  // a와 b의 길이를 동일하게 맞춰 비교가 용이하도록 함
  const maxLen = Math.max(a.length, b.length);
  const pad = (s: string) => s.padEnd(maxLen, MIN_CHAR);
  return [pad(a), pad(b)];
}

// 다음(LexoRank에서 "조금 큰") 키 만들기: 주어진 키보다 사전식으로 큰 가장 짧은 증가
export function nextKey(key: string): string {
  // 뒤에서부터 올려보기
  const arr = key.split("");
  for (let i = arr.length - 1; i >= 0; i--) {
    const idx = charIndex(arr[i]);
    if (idx < ALPHABET.length - 1) {
      arr[i] = ALPHABET[idx + 1];
      return arr.join("");
    } else {
      arr[i] = MIN_CHAR; // 캐리
    }
  }
  // 전부 MAX였다면 길이를 1 늘림
  return key + MIN_CHAR;
}

// 이전(조금 작은) 키: 필요 시 사용
export function prevKey(key: string): string {
  const arr = key.split("");
  for (let i = arr.length - 1; i >= 0; i--) {
    const idx = charIndex(arr[i]);
    if (idx > 0) {
      arr[i] = ALPHABET[idx - 1];
      return arr.join("");
    } else {
      arr[i] = MAX_CHAR; // borrow
    }
  }
  // 더 작게 만들 수 없다면 앞에 MIN을 하나 붙여 더 작은 영역 생성
  return MIN_CHAR.repeat(key.length + 1);
}

// 두 키 사이의 "중간" 키 생성: a < mid < b
// - a 혹은 b가 null일 수 있음(null은 -∞ 또는 +∞로 해석)
export function between(a: string | null, b: string | null): string {
  // 경계 처리
  if (a === null && b === null) {
    return "U"; // 시작 기본값(중간쯤의 문자)
  }
  if (a === null && b !== null) {
    // -∞와 b 사이: b보다 작은 키를 하나 만든다.
    // b가 "0..."이면 더 작은 걸 만들 수 없으니 앞에 MIN을 붙이는 방식
    // 간단히 b의 앞쪽에 MIN을 붙여 더 작은 키 공간을 만듦
    return b > MIN_CHAR ? prevKey(b) : MIN_CHAR + b;
  }
  if (a !== null && b === null) {
    // a와 +∞ 사이: a보다 약간 큰 키
    return nextKey(a);
  }

  // 두 키를 같은 길이로 맞춘 후, 사전식 중간값을 생성
  const [aa, bb] = normalizeLength(a!, b!);
  if (aa >= bb) {
    // 잘못된 입력(정렬 보장 필요)
    // 안전하게 a보다 조금 큰 키 리턴
    return nextKey(a!);
  }

  // 사전식 중간값 생성
  // 방법: 두 문자열을 base62 숫자처럼 보고 평균을 구는 대신,
  // 앞에서부터 같은 prefix는 유지하고 처음 다른 문자를 찾은 뒤 그 사이 값을 택함.
  let i = 0;
  while (i < aa.length && aa[i] === bb[i]) i++;

  if (i === aa.length) {
    // 완전히 동일한 경우: 길이를 늘려 분기
    return aa + "U"; // 중간 문자를 붙임
  }

  const aIdx = charIndex(aa[i]);
  const bIdx = charIndex(bb[i]);

  if (bIdx - aIdx > 1) {
    // 사이에 여유가 있으면 중간 문자 선택
    const midChar = ALPHABET[Math.floor((aIdx + bIdx) / 2)];
    return aa.slice(0, i) + midChar;
  } else {
    // 여유가 충분치 않으면 다음 자리에 여백을 만든다
    // 예: "AA0"와 "AA1" 사이라면 "AA0U" 같이 꼬리를 늘리기
    return aa.slice(0, i + 1) + "U";
  }
}
