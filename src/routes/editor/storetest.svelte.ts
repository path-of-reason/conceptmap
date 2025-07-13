type Store = {
  count: number;
  list: number[];
};

export const useStore = () => {
  // 스토어는 함수 안에 둬도되고 글로벌 사용하고싶다면 바깥으로 빼도됌
  let store = $state<Store>({
    count: 0,
    list: [],
  });

  // 상태변경함수도 훅으로 써도 되고 공유하고 싶다면 바깥으로 빼도 됌
  const increase = () => {
    store.count += 1;
  };
  const pushList = () => {
    store.list.push(store.count);
  };
  return {
    store, // 스토어 그대로 내보내기 할 것 (분해해서 내보내면 반응성 상실)
    increase,
    pushList,
  };
};
