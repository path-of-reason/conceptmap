// 이항 계수 (nCk)를 계산하는 함수
function combinations(n: number, k: number): bigint {
  if (k < 0 || k > n) {
    return 0n;
  }
  if (k === 0 || k === n) {
    return 1n;
  }
  if (k > n / 2) {
    k = n - k;
  }

  let res = 1n;
  for (let i = 1; i <= k; i++) {
    res = (res * BigInt(n - i + 1)) / BigInt(i);
  }
  return res;
}

function calculateGaltonBoardDistribution(
  totalBalls: bigint,
  numRows: number, // 못 줄 수 (n)
): bigint[] {
  const bins: bigint[] = new Array(numRows + 1).fill(0n);

  // const PRECISION = 15;
  // const PRECISION_MULTIPLIER = BigInt(10 ** PRECISION); // 10^15n
  // const ONE_MINUS_P_POW_N = BigInt(
  //   Math.round(Math.pow(0.5, numRows) * Number(PRECISION_MULTIPLIER)),
  // );

  for (let k = 0; k <= numRows; k++) {
    const nCk = combinations(numRows, k);
    const divisor = BigInt(2) ** BigInt(numRows); // 2^numRows
    const expectedBalls = (totalBalls * nCk + divisor / 2n) / divisor; // 반올림 구현
    bins[k] = expectedBalls;
  }
  return bins;
}

// --- 계산 실행 ---
const totalNumberOfBalls =
  1_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000n;
const galtonBoardRows = 200;

console.log(`\n--- 갈튼 보드 예상 분포 계산 (수학적 모델) ---`);
console.log(`총 구슬 수: ${totalNumberOfBalls.toLocaleString()}개`);
console.log(`못 줄 수: ${galtonBoardRows}줄`);

const distribution = calculateGaltonBoardDistribution(
  totalNumberOfBalls,
  galtonBoardRows,
);

console.log(`\n--- 결과 (각 칸의 예상 구슬 수) ---`);
const maxCount = distribution.reduce(
  (max, current) => (current > max ? current : max),
  0n,
);

distribution.forEach((count, index) => {
  const barLength = maxCount > 0n ? Number((count * 50n) / maxCount) : 0;
  const bar = "#".repeat(barLength);

  // **** 수정된 부분 ****
  // index.toString() 결과의 길이를 최대 칸 번호의 자릿수에 맞춰 고정합니다.
  // 예를 들어, numRows가 200이면 최대 칸 번호는 200 (3자리).
  // 따라서 칸 번호 문자열 길이를 3으로 고정하고, 남는 공간은 공백으로 채웁니다.
  const indexString = index.toString().padEnd(3, " "); // 3자리를 기준으로 공백 채움

  console.log(
    `칸 ${indexString}: [\x1B[35m${bar.padEnd(50, " ")}\x1B[0m] ${count.toLocaleString()}`,
  );
});

console.log(`\n--- 계산 종료 ---`);
