import expect from 'expect'  // テスト用ライブラリ

// Reducer
const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

// テストコード
// expect(foo()).bar(X) fooの結果とXとをbar()で評価

// +1 -1 のチェック
expect(
  counter(0, { type: 'INCREMENT' })
).toEqual(1);

expect(
  counter(1, { type: 'INCREMENT' })
).toEqual(2);

expect(
  counter(1, { type: 'DECREMENT' })
).toEqual(0);

// 予期せぬ値の時は現在の状態をそのまま返す
expect(
  counter(1, { type: 'SOMETHING_ELSE' })
).toEqual(1);

// 前の状態を保持していない（初期状態の）場合0を返す
expect(
  counter(undefined, {})
).toEqual(0);


console.log('Tests passed!');
