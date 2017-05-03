import expect from 'expect'  // テスト用ライブラリ
// import { createStore } from 'redux'

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

// createStoreを手実装
const createStore = (reducer) => {
  let state;
  let listeners = [];  // dispatchされるたびコールされる関数のリスト

  const getState = () => state;  // stateを返す(return文は省略できる)

  const dispatch = (action) => {
    state = reducer(state, action);  // reducer による値の更新
    listeners.forEach(listener => listener());  // リスト内の関数を順次実行
  }

  const subscribe = (listener) => {
    listeners.push(listener);  // 与えられた関数をdispatchのたび呼ばれるリストへ追加
    // unsubscribeメソッドを作る代わりに、返り値にunsubscribeを提供する関数を指定
    return () => {
      listeners = listeners.filter(l => l !== listener);  // listenner以外の関数のリスト
    };
  };
  dispatch({});  // 引数指定しないことで初期化

  return { getState, dispatch, subscribe };
}

// Store作成
const store = createStore(counter);  // Reducerとしてcounterを指定

// 画面描画関数
const render = () => {
  document.body.innerText = store.getState();
}

store.subscribe(render);  // dispatchされるたびrender()実行
render()  // 初期値描画

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
