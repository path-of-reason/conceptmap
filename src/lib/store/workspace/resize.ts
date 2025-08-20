import { workspaceStore } from "./store.svelte";

/**
 * 특정 행의 크기를 조절합니다.
 * @param rowIndex 크기를 조절할 행의 인덱스 (0부터 시작). 이 행과 다음 행의 비율이 변경됩니다.
 * @param newFrValue 해당 rowIndex의 행이 가질 새로운 fr 값.
 */
export function resizeCellHeight(rowIndex: number, newFrValue: number) {
  const currentFrValues = workspaceStore.layout.rowSizes.map((s) =>
    parseFloat(s.toString()),
  );

  // 유효성 검사: 인덱스가 배열 범위 내에 있고, 다음 행이 존재하는지 확인
  if (rowIndex < 0 || rowIndex >= currentFrValues.length - 1) {
    console.warn(
      `[resizeCellHeight] Invalid row index: ${rowIndex}. Must be within 0 to ${currentFrValues.length - 2}.`,
    );
    return;
  }

  const oldFr1 = currentFrValues[rowIndex];
  const oldFr2 = currentFrValues[rowIndex + 1];
  const sumOfAffectedFr = oldFr1 + oldFr2; // 영향을 받는 두 행의 fr 합계 (고정)

  // 유효성 검사: 새로운 fr 값이 0보다 크고, 두 행의 합계보다 작은지 확인
  if (newFrValue <= 0 || newFrValue >= sumOfAffectedFr) {
    console.warn(
      `[resizeCellHeight] New FR value (${newFrValue}) out of bounds for sum ${sumOfAffectedFr}.`,
    );
    return;
  }

  const newFr1 = newFrValue;
  const newFr2 = sumOfAffectedFr - newFr1; // 다음 행의 fr 값은 합계에서 현재 행 값을 뺀 값

  workspaceStore.layout.rowSizes[rowIndex] = `${newFr1}fr`;
  workspaceStore.layout.rowSizes[rowIndex + 1] = `${newFr2}fr`;

  // $state는 배열 요소 변경을 감지하지만, 배열 자체를 교체하면 더 확실하게 Svelte의 반응성을 트리거할 수 있습니다.
  workspaceStore.layout.rowSizes = [...workspaceStore.layout.rowSizes];
  console.log(
    `[resizeCellHeight] Row ${rowIndex} resized to ${newFr1}fr, Row ${rowIndex + 1} to ${newFr2}fr.`,
  );
}

/**
 * 특정 열의 크기를 조절합니다.
 * @param colIndex 크기를 조절할 열의 인덱스 (0부터 시작). 이 열과 다음 열의 비율이 변경됩니다.
 * @param newFrValue 해당 colIndex의 열이 가질 새로운 fr 값.
 */
export function resizeCellWidth(colIndex: number, newFrValue: number) {
  const currentFrValues = workspaceStore.layout.colSizes.map((s) =>
    parseFloat(s.toString()),
  );

  // 유효성 검사
  if (colIndex < 0 || colIndex >= currentFrValues.length - 1) {
    console.warn(
      `[resizeCellWidth] Invalid col index: ${colIndex}. Must be within 0 to ${currentFrValues.length - 2}.`,
    );
    return;
  }

  const oldFr1 = currentFrValues[colIndex];
  const oldFr2 = currentFrValues[colIndex + 1];
  const sumOfAffectedFr = oldFr1 + oldFr2;

  // 유효성 검사
  if (newFrValue <= 0 || newFrValue >= sumOfAffectedFr) {
    console.warn(
      `[resizeCellWidth] New FR value (${newFrValue}) out of bounds for sum ${sumOfAffectedFr}.`,
    );
    return;
  }

  const newFr1 = newFrValue;
  const newFr2 = sumOfAffectedFr - newFr1;

  workspaceStore.layout.colSizes[colIndex] = `${newFr1}fr`;
  workspaceStore.layout.colSizes[colIndex + 1] = `${newFr2}fr`;

  // Svelte 반응성 트리거
  workspaceStore.layout.colSizes = [...workspaceStore.layout.colSizes];
}
export function resizeGridCol(colIndex: number, deltaFr: number) {
  const currentFrValues = workspaceStore.layout.colSizes.map((s) =>
    parseFloat(s.toString()),
  );
  const totalFr = currentFrValues.reduce((sum, val) => sum + val, 0);

  if (colIndex < 0 || colIndex >= currentFrValues.length) {
    console.warn(`[resizeGridCol] Invalid col index: ${colIndex}.`);
    return;
  }

  let newFrForTarget = currentFrValues[colIndex] + deltaFr;

  // 최소/최대 너비 제한 (예: 최소 0.1fr)
  if (newFrForTarget < 0.1) newFrForTarget = 0.1;

  // 변화량 (실제로 적용된 변화량)
  const actualDelta = newFrForTarget - currentFrValues[colIndex];

  // 나머지 fr 값들을 조정하여 전체 합계를 유지
  const remainingFrCount = currentFrValues.length - 1;
  const oldRemainingFrSum = totalFr - currentFrValues[colIndex];
  const newRemainingFrSum = totalFr - newFrForTarget;

  if (remainingFrCount > 0) {
    // 나머지 패널들의 fr 값을 비례적으로 조정
    for (let i = 0; i < currentFrValues.length; i++) {
      if (i === colIndex) {
        workspaceStore.layout.colSizes[i] = `${newFrForTarget}fr`;
      } else {
        // 기존 나머지 값에 대한 비율을 새로운 나머지 합계에 적용
        const ratio = currentFrValues[i] / oldRemainingFrSum;
        let adjustedFr = ratio * newRemainingFrSum;
        if (adjustedFr < 0.1) adjustedFr = 0.1; // 최소값 제한
        workspaceStore.layout.colSizes[i] = `${adjustedFr}fr`;
      }
    }
  } else {
    // 열이 하나뿐인 경우
    workspaceStore.layout.colSizes[colIndex] = `${newFrForTarget}fr`;
  }

  workspaceStore.layout.colSizes = [...workspaceStore.layout.colSizes];
}
