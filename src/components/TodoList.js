import React from 'react'
import Todo from './Todo'

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

export default TodoList