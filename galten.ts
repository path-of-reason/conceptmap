// @ts-ignore
const write = process.stdout.write;

async function runSimulation() {
  const numberOfBallsToSimulate = 100000000;
  const numberOfRows = 60;
  const reportInterval = 10000;
  const updateDelayMs = 0;

  console.log(`\n--- 갈튼 보드 시뮬레이션 시작 (실시간 업데이트) ---`);
  console.log(`총 구슬 수: ${numberOfBallsToSimulate}개`);
  console.log(`못 줄 수: ${numberOfRows}줄`);
  console.log(`업데이트 간격: ${reportInterval}개 구슬마다`);
  console.log(`각 업데이트 후 지연: ${updateDelayMs}ms`);
  console.log("\n시뮬레이션 준비 중... 잠시 후 그래프가 나타납니다.");

  await new Promise((resolve) => setTimeout(resolve, 500)); // 1초 대기 후 시작

  clearTerminalAndResetCursor(); // 화면을 지우고 커서를 맨 위로
  console.log(
    `갈튼 보드 시뮬레이션 진행 중... (총 ${numberOfBallsToSimulate}개 구슬)`,
  );
  console.log(
    `못 줄 수: ${numberOfRows}줄 | 업데이트 간격: ${reportInterval}개 구슬`,
  );
  console.log("--------------------------------------------------");

  const galtonBoardGenerator = generateGaltonBallDrop(numberOfRows);
  const bins: number[] = new Array(numberOfRows + 1).fill(0);

  for (let i = 1; i <= numberOfBallsToSimulate; i++) {
    const finalPosition = galtonBoardGenerator.next().value;
    if (finalPosition !== undefined) {
      bins[finalPosition]++;
    }

    if (i % reportInterval === 0 || i === numberOfBallsToSimulate) {
      // 현재 커서 위치를 저장
      write("\x1B[s");

      // 그래프가 시작될 라인으로 이동 (예: 5번째 줄부터 그래프 시작)
      moveCursorToLine(5);

      console.log(`현재 시뮬레이션된 구슬: ${i} / ${numberOfBallsToSimulate}`);
      const currentMaxCount = Math.max(...bins);

      bins.forEach((count, index) => {
        const barLength =
          currentMaxCount > 0 ? Math.round((count / currentMaxCount) * 50) : 0;
        const bar = "#".repeat(barLength);
        console.log(
          `칸 ${index.toString().padEnd(2, " ")}: [\x1B[36m${bar.padEnd(50, " ")}\x1B[0m] ${count}`,
        );
      });

      // 저장된 커서 위치로 복원
      write("\x1B[u");

      // await를 사용하여 원하는 지연 시간을 부여합니다.
      // await new Promise((resolve) => setTimeout(resolve, updateDelayMs));
    }
  }

  // 최종 결과 출력 후 화면 정리 및 최종 메시지
  await new Promise((resolve) => setTimeout(resolve, 100)); // 짧은 지연 후 최종 정리
  clearTerminalAndResetCursor();
  console.log(
    `--- 갈튼 보드 시뮬레이션 완료! (총 ${numberOfBallsToSimulate}개 구슬) ---`,
  );
  console.log(`\n최종 결과 (각 칸에 쌓인 구슬 수):`);
  const finalMaxCount = Math.max(...bins);
  bins.forEach((count, index) => {
    const barLength =
      finalMaxCount > 0 ? Math.round((count / finalMaxCount) * 50) : 0;
    const bar = "#".repeat(barLength);
    console.log(
      `칸 ${index.toString().padEnd(2, " ")}: [\x1B[32m${bar.padEnd(50, " ")}\x1B[0m] ${count}`,
    );
  });
  console.log("\n--------------------------------------------------");
}

// async 함수를 호출하여 시뮬레이션 시작
runSimulation();

function* generateGaltonBallDrop(
  numRows: number, // 갈튼 보드의 못 줄 수 (행 수)
): Generator<number> {
  while (true) {
    let position = 0;
    for (let j = 0; j < numRows; j++) {
      if (Math.random() < 0.5) {
        // 왼쪽
      } else {
        // 오른쪽
        position++;
      }
    }
    yield position;
  }
}

function clearTerminalAndResetCursor() {
  write("\x1Bc");
}

// 특정 줄로 커서를 이동시키는 함수
function moveCursorToLine(line: number) {
  write(`\x1B[${line};1H`);
}
