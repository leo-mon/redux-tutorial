import expect from 'expect'  // テスト用ライブラリ
import { createStore } from 'redux'

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

// Store作成
const store = createStore(counter);  // Reducerとしてcounterを指定

// getState()テスト
console.log('getState():' + store.getState());  // 現在の状態取得

// dispathc()テスト
store.dispatch({ type: 'INCREMENT' });  // 'INCREMENT' Actionをdispatch
console.log('dispatch INCREMENT');
console.log('getState():' + store.getState());

// subscribe()テスト
store.subscribe(() => {
  document.body.innerText = store.getState();  // dispatchが実行されるたびこれを実行
});
document.addEventListener('click', () => {
  store.dispatch({ type: 'INCREMENT' });  // 画面上どこかクリックされたらdispatch
});


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
