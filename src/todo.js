import expect from 'expect'
import deepFreeze from 'deep-freeze'

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
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)  // ADDはそのままでよかったのでは？
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

const toggleTodo = (todo) => {
  /* 辞書が凍結されているため書き換えは不可
  todo.completed = !todo.completed;
  return todo;
  */
  /* これでも良いが冗長
  return {
  id: todo.id,
  text: todo.text,
  completed: !todo.completed
};
*/
/* ES6の記法: 第一引数のオブジェクトに第二引数以下のオブジェクトを追加、変更
return Object.assign({}, todo, {
completed: !todo.completed
});
*/
// ...を利用した記法(ES7で取り込まれる予定だそうな)
return {
  ...todo,
  completed: !todo.completed
};
};



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
