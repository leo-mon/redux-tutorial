import React from 'react'
import { connect } from 'react-redux'
import { addTodo } from '../actions'

let AddTodo = ({ dispatch }) => {  // connectでラップしたものを再度入れるためletに
  let input;

  return (
    <div>
      <input ref={node => {  // Reactのref APIを利用、フォームの値取得
        input = node;
      }} />

      <button onClick={() => {
        dispatch(addTodo(input.value));
        input.value = '';
      }}>
        ADD_TODO
      </button>
    </div>
  );
};
AddTodo = connect()(AddTodo);

export default AddTodo;