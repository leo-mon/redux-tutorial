import expect from 'expect'
import deepFreeze from 'deep-freeze'

const addCounter = (list) => {
  /* listが凍結されているためpushは不可
  list.push(0);
  return list;
  */
  /* return list.concat([0]); これでも良いがES6で書く */
  return [...list, 0];
};

const removeCounter = (list, index) => {
  /* 同様の理由でアウト
  list.splice(index, 1);
  return list;
  */
  /* これでも良いがES6で書く
  return list
    .slice(0, index)
    .concat(list.slice(index + 1));
  */
  return [
    ...list.slice(0, index),
    ...list.slice(index + 1)
  ];
};

const incrementCounter = (list, index) => {
  /* 同様の理由でアウト
  list[index]++;
  return list;
  */
  /* これでも良いがES6で書く
  return list
    .slice(0, index)
    .concat(list[index] + 1)
    .concat(list.slice(index + 1));
  */
  return [
    ...list.slice(0, index),
    list[index] + 1,
    ...list.slice(index + 1)
  ];
};

/* テスト */
const testAddCounter = () => {
  const listBefore = [];
  const listAfter = [0];

  deepFreeze(listBefore)  // テストのためにリストを凍結

  expect(
    addCounter(listBefore)
  ).toEqual(listAfter);
};

const testRemoveCounter = () => {
  const listBefore = [0, 10, 20];
  const listAfter = [0, 20];

  deepFreeze(listBefore);

  expect(
    removeCounter(listBefore, 1)
  ).toEqual(listAfter);
};

const testIncrementCounter = () => {
  const listBefore = [0, 10, 20];
  const listAfter = [0, 11, 20];

  deepFreeze(listBefore);

  expect(
    incrementCounter(listBefore, 1)
  ).toEqual(listAfter);
};

testAddCounter();
testRemoveCounter();
testIncrementCounter();
console.log('All tests passed.')
