## Svelte 5 `$state`를 활용한 함수형 스토어(최소 예제)

아래 예제는 Svelte 5의 `$state` 룬을 사용한 가장 기본적인 함수형 스토어 패턴입니다. 스토어와 액션 함수 모두를 훅(함수)으로 묶어 export하며, 전역 공유가 필요하다면 함수 바깥으로 상태/액션을 빼서 사용하면 됩니다.

### svelte.ts에서 사용예시

```ts store.svelte.ts
type Store = {
  count: number;
  list: number[];
};

// 스토어를 함수 안에 두면 각 인스턴스별로 독립적인 상태가 생성됨 - 필요할때만 사용
// store는 외부에서 사용하지 않을때는 자유롭게 쓸 수 있지만
// 객체로 사용하지 않는다면, 외부에서 사용할때, 재할당시 state의 참조를 잃는 문제가 있음
// 객체로 정의하면, 외부에서 store를 변경할 때 객체의 내부값을 재할당하는 방식으로 동작하기 때문에 안전
let store = $state<Store>({
count: 0,
list: [],
});

export const useStore = () => {


  // 상태 변경 함수도 필요에 따라 함수 안/밖에 둘 수 있음
  const increase = () => {
    store.count += 1;
  };

  const pushList = () => {
    store.list.push(store.count);
  };

  // store 객체 그대로 반환 (분해해서 반환하면 반응성 사라짐)
  return {
    store,
    increase,
    pushList,
  };
};
```

### svelte 컴포넌트 사용예시

```svelte
<script lang="ts">
  import { useStore } from './store.svelte.ts';
  const { store, increase, pushList } = useStore();
</script>

<button on:click={increase}>+</button>
<button on:click={pushList}>Push</button>
<p>Count: {store.count}</p>
<ul>
  {#each store.list as n}
    <li>{n}</li>
  {/each}
</ul>
```

### 참고

• store를 분해해서 반환하지 말고 객체 전체를 반환해야 반응성이 유지됩니다.
• 전역 상태 공유가 필요하다면 ‎⁠let store = $state<Store>(...)⁠를 함수 바깥에 선언하고, 액션 함수들도 export해서 사용하면 됩니다.
• 이 패턴은 Svelte 5에서 공식적으로 권장되는 함수형 상태 관리 방식입니다.

## Svelte 5 `$derived` 사용법 (컴포넌트 파일 기준)

Svelte 5에서 `$derived` 룬은 **컴포넌트 파일(`.svelte`) 내에서만 공식적으로 사용할 수 있습니다.** `.ts`, `.js`, `.svelte.ts`, `.svelte.js`와 같은 일반 모듈 파일에서는 사용할 수 없습니다. `$state`와 함께 사용하여 반응형 파생값을 쉽게 생성할 수 있습니다.

### 1. 기본 사용법

가장 간단한 `$derived` 사용법입니다. `$state` 변수의 값이 변하면 `$derived`로 정의된 파생값이 자동으로 업데이트됩니다.

```svelte
<script>
  // $state로 반응형 상태 변수 선언
  let count = $state(0);

  // $derived로 count에 기반한 파생값 선언
  // count가 변경될 때마다 자동으로 2배로 계산됩니다.
  let doubled = $derived(count * 2);

  // count를 증가시키는 함수
  function increase() {
    count++;
  }
</script>

<div class="p-4 flex flex-col items-center space-y-4">
  <button
    on:click={increase}
    class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
  >
    카운트 증가 (+)
  </button>
  <p class="text-lg">현재 카운트: <span class="font-bold text-blue-700">{count}</span></p>
  <p class="text-lg">두 배 값: <span class="font-bold text-green-700">{doubled}</span></p>
</div>
```

### 2. `$derived.by`로 복잡한 파생값 만들기

`$derived.by`는 여러 줄의 로직이 필요한 복잡한 파생값 계산에 유용합니다. 일반 `$derived`와 달리 함수 블록을 인자로 받습니다.

```svelte
<script>
  // $state로 숫자 배열 선언
  let numbers = $state([1, 2, 3]);

  // $derived.by를 사용하여 numbers 배열의 합계를 계산
  let sum = $derived.by(() => {
    let total = 0;
    for (const n of numbers) {
      total += n;
    }
    return total;
  });

  // 배열에 새 숫자를 추가하는 함수
  function addNumber() {
    numbers.push(numbers.length + 1);
  }
</script>

<div class="p-4 flex flex-col items-center space-y-4">
  <p class="text-lg">숫자들: <span class="font-bold text-blue-700">{numbers.join(', ')}</span></p>
  <p class="text-lg">합계: <span class="font-bold text-green-700">{sum}</span></p>
  <button
    on:click={addNumber}
    class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
  >
    숫자 추가 (Add Number)
  </button>
</div>
```

### 3. 여러 상태 조합

`$derived`는 여러 `$state` 변수를 조합하여 새로운 파생값을 만들 수 있습니다.

```svelte
<script>
  let a = $state(1);
  let b = $state(2);

  // a와 b의 합계를 파생값으로 선언
  let sum = $derived(a + b);

  function incrementA() {
    a++;
  }

  function incrementB() {
    b++;
  }
</script>

<div class="p-4 flex flex-col items-center space-y-4">
  <div class="flex space-x-4">
    <button
      on:click={incrementA}
      class="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
    >
      A 증가 ({a})
    </button>
    <button
      on:click={incrementB}
      class="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
    >
      B 증가 ({b})
    </button>
  </div>
  <p class="text-xl font-bold mt-4">{a} + {b} = <span class="text-red-600">{sum}</span></p>
</div>
```

### 4. 주의사항

- **부수 효과(Side-Effect) 금지**: `$derived` 내부의 식(expression)에서는 상태를 변경하는 등의 부수 효과가 없어야 합니다. 오직 계산 로직만 포함해야 합니다.
- **컴포넌트 파일 전용**: `$derived` 룬은 `.svelte` 컴포넌트 파일 내에서만 사용할 수 있습니다. 일반 JavaScript/TypeScript 모듈 파일(`*.ts`, `*.js`, `*.svelte.ts`, `*.svelte.js`)에서는 사용할 수 없습니다.
- **용도**: 여러 상태의 값을 조합하거나, 계산된 값을 자동으로 반응형으로 만들 때 사용됩니다.

### 5. 참고

- **복잡한 로직**: 여러 줄의 복잡한 계산이 필요하다면 `$derived.by(() => { ... })` 패턴을 사용하는 것이 좋습니다.
- **기존 Svelte Store API와의 차이**: Svelte 5의 `$derived` 룬은 `svelte/store`에서 제공하는 `derived` 함수와는 문법과 동작 방식이 다릅니다. `$derived` 룬은 컴파일러 마법으로, 더 간결하고 효율적인 반응성을 제공합니다.

이러한 방식으로 Svelte 5에서 `$derived`를 활용하여 컴포넌트 내에서 파생 상태를 효율적으로 관리하고 표현할 수 있습니다.
