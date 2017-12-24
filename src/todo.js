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

// フィルタリング指定リンクのコンポーネント
const Link = ({
  active,
  children, // 呼び出し元の開始/終了タグの間にある要素が入る特別なprops
  onClick  // このコンポーネントが示すフィルタの値にvisibilityFilterを変更
}) => {
  if (active) {  // 現在表示中の要素は状態がわかるようにspanで返却
    return <span>{children}</span>
  }

  return (  // 現在の状態以外はaで返却
    <a href='#'
    onClick={e => {
      e.preventDefault();  // href属性へのクリックでブラウザがトップまでスクロールを勝手にしてしまうことを抑制
      onClick();
    }}
    >
    {children}
    </a>
  );
};

class FilterLink extends Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()  // storeが更新された際コンポーネントを変更するよう、コンポーネントマウント前に登録
    );
  }

  componentWillUnmount() {
    this.unsubscribe();  // subscribe()の返り値、アンマウント前に登録解除
  }

  render() {
    const props = this.props;
    const state = store.getState();

    return (
      <Link
        active={
          props.filter ===
          state.visibilityFilter  // 現在表示中の項目か判定
        }
        onClick={() =>
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: props.filter
          })
        }
      >
        {props.children} {/* <FilterLink>この要素を取得</FilterLink> */}
      </Link>
    )
  }
}

const Footer = () => (
  <p>
    Show:
    {' '}
    <FilterLink
      filter='SHOW_ALL'
    >
      All
    </FilterLink>
    {' '}
    <FilterLink
      filter='SHOW_ACTIVE'
    >
      Active
    </FilterLink>
    {' '}
    <FilterLink
      filter='SHOW_COMPLETED'
    >
      Completed
    </FilterLink>
  </p>
);

const Todo = ({  // View representational component, どのように描画されるかのみが記述
  onClick,
  completed,
  text
}) => (
  <li 
    onClick={onClick}
    style={{  // completedがtureなら打ち消し線を入れる
      textDecoration:
        completed ?
          'line-through':
          'none'
    }}
  >
    {text}
  </li>
);  

const TodoList = ({  // View presentational component
  todos,
  onTodoClick
}) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}  //　個々の値に展開、ここではcompletedとtextを展開している？
        onClick={() => onTodoClick(todo.id)}  //ここでdispatchも可能だがpresentational component であることを保つためpropsで渡す
      />
    )}
  </ul>
);

const AddTodo = ({
  onAddClick
}) => {
  let input;

  return (
    <div>
      <input ref={node => {  // Reactのref APIを利用、フォームの値取得
        input = node;
      }} />

      <button onClick={() => {
        store.dispatch({
          type: 'ADD_TODO',
          id: nextTodoId++,
          text: input.value
        })
        input.value = '';
      }}>
        ADD_TODO
      </button>
    </div>
  )
}

// filter の状態に応じて表示すべきtodoを返す
const getVisibleTodos = (
  todos,
  filter
) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(
        t => t.completed
      );
    case 'SHOW_ACTIVE':
      return todos.filter(
        t => !t.completed
      );
  }
}

class VisibleTodoList extends Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()  // storeが更新された際コンポーネントを変更するよう、コンポーネントマウント前に登録
    );
  }

  componentWillUnmount() {
    this.unsubscribe();  // subscribe()の返り値、アンマウント前に登録解除
  } 

  render() {
    const props = this.props;
    const state = store.getState();

    return (
      <TodoList
        todos={
          getVisibleTodos(
            state.todos,
            state.visibilityFilter
          )
        }
        onTodoClick={id =>
          store.dispatch({
            type: 'TOGGLE_TODO',
            id
          })
        }
      />
    );
  }
}


let nextTodoId = 0;  // action.idに利用するグローバル変数

// TodoAppコンポーネント
const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)

// ビュー関数
ReactDOM.render(
  <TodoApp />,
  document.getElementById('root')
);
// console.log('Next Todo ID: ' + nextTodoId);
// console.log(store.getState());

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