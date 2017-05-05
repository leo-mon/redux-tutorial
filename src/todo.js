import expect from 'expect'
import deepFreeze from 'deep-freeze'

// Reducer
const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false
        }
      ];
    default:
      return state;
  }
};

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
const testToggleTodo = () => {
  const todoBefore = {
    id: 0,
    text: 'Learn Redux',
    completed: false
  };
  const todoAfter = {
    id: 0,
    text: 'Learn Redux',
    completed: true
  };

  deepFreeze(todoBefore);

  expect(
    toggleTodo(todoBefore)
  ).toEqual(todoAfter);
};

testAddTodo()
testToggleTodo();
console.log('All test passed.');
