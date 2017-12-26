// Action Creators

let nextTodoId = 0;  // action.idに利用するグローバル変数
export const addTodo = (text) => {  // acton creator, dispatchされるアクションを返す
  return {
    type: 'ADD_TODO',
    id: nextTodoId++,
    text
  };
};

export const setVisibilityFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  };
};

export const toggleTodo = (id) => {
  return {
    type: 'TOGGLE_TODO',
    id
  };
};