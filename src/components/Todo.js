import React from 'react'

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

export default Todo