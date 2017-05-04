import expect from 'expect'  // テスト用ライブラリ
import { createStore } from 'redux'
import React from 'react'
import ReactDOM from 'react-dom'

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

const Counter = ({
  value,
  onIncrement,
  onDecrement
}) => (
  <div>
    <h1>{value}</h1>
    <button onClick={onIncrement}>+</button>
    <button onClick={onDecrement}>-</button>
  </div>
)

// Store作成
const store = createStore(counter);  // Reducerとしてcounterを指定

// 画面描画関数(View Function)
const render = () => {
  ReactDOM.render(
    <Counter
      value={store.getState()}
      onIncrement={() =>
        store.dispatch({ type: 'INCREMENT'})
      }
      onDecrement={() =>
        store.dispatch({ type: 'DECREMENT'})
      }
    />,
    document.getElementById('root')
  )
}

store.subscribe(render);  // dispatchされるたびrender()実行
render()  // 初期値描画


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
