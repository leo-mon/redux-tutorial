import expect from 'expect'
import deepFreeze from 'deep-freeze'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers } from 'redux'

// Reducer
// 個々の要素をいじるReducer
const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }
      return {
        ...state,
        completed: !state.completed
      };
    default:
      return state;
  }
};

// リスト全体をいじるReducer
const todos = (state = [], action) => {
  switch (action.type) {
    // stateに {id:action.id,text:action.text,completed:false}を追加する
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)  // todoをコールし返ってきた値とstateを結合
      ];
    // 該当するToDoのcompletedの値をを反転
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

// 見えるかどうかのフラグ処理のReducer
const visibilityFilter = (
  state = 'SHOW_ALL', // 初期値
  action
) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

// トップレベルのReducer
const todoApp = combineReducers({
  todos,
  visibilityFilter
})

// ReducerをStoreに登録
const store = createStore(todoApp);

let nextTodoId = 0;  // action.idに利用するグローバル変数

// TodoAppコンポーネント
class TodoApp extends Component {
  render() {
    return (
      <div>
        <input ref={node => {  // Reactのref APIを利用、フォームの値取得
          this.input = node;
        }} />

        <button onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            text: this.input.value,
            id: nextTodoId++
          })
          this.input.value = '';
        }}>
          ADD_TODO
        </button>

        <ul>
          {this.props.todos.map(todo =>  // propsとして受けたstoreの中身を表示
            <li key={todo.id}
                onClick={() => {  // クリックされたらTOGGLE_TODOをdispatch()
                  store.dispatch({
                    type: 'TOGGLE_TODO',
                    id: todo.id
                  });
                }}
                style={{  // completedがtureなら打ち消し線を入れる
                  textDecoration:
                    todo.completed ?
                      'line-through':
                      'none'
                }}>
              {todo.text}
            </li>
          )}
        </ul>
      </div>
    );
  }
}

// ビュー関数
const render = () => {
  ReactDOM.render(
    <TodoApp
      todos={store.getState().todos}  //todosの状態をpropsとして渡す
    />,
    document.getElementById('root')
  );
};

store.subscribe(render);
render();

/* 
console.log('Initial state:');
console.log(store.getState());
console.log('--------------');

console.log('Dispatching ADD_TODO.');
store.dispatch({
  type: 'ADD_TODO',
  id: 0,
  text: 'Learn Redux'
});
console.log('Current state:');
console.log(store.getState());
console.log('--------------');

console.log('Dispatching ADD_TODO.');
store.dispatch({
  type: 'ADD_TODO',
  id: 1,
  text: 'Go shopping'
});
console.log('Current state:');
console.log(store.getState());
console.log('--------------');

console.log('Dispatching TOGGLE_TODO.');
store.dispatch({
  type: 'TOGGLE_TODO',
  id: 0,
});
console.log('Current state:');
console.log(store.getState());
console.log('--------------');

console.log('Dispatching SET_VISIBILITY_FILTER.');
store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED',
});
console.log('Current state:');
console.log(store.getState());
console.log('--------------');

console.log('');

// テスト
const testAddTodo = () => {
  const stateBefore = [];
  const action = {
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn Redux'
  };
  const stateAfter = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    }
  ];

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
    todos(stateBefore, action)
  ).toEqual(stateAfter);
};

const testToggleTodo = () => {
  const stateBefore = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    },
    {
      id: 1,
      text: 'Go shopping',
      completed: false
    }
  ];
  const action = {
    type: 'TOGGLE_TODO',
    id: 1
  };
  ;
  const stateAfter = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    },
    {
      id: 1,
      text: 'Go shopping',
      completed: true
    }
  ];

  deepFreeze(stateBefore);
  deepFreeze(action)

  expect(
    todos(stateBefore, action)
  ).toEqual(stateAfter);
};

testAddTodo()
testToggleTodo();
console.log('All test passed.');
*/