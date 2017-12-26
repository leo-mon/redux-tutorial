import { connect } from 'react-redux'
import { toggleTodo } from '../actions'
import TodoList from '../components/TodoList'

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

const mapStateToProps = (  // ファイル分割してmapStateToPropsのままの方が望ましい
  state
) => {
  return {
    todos: getVisibleTodos(
      state.todos,
      state.visibilityFilter
    )
  };
};
const mapDispatchToProps = (
  dispatch
) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id))
    }
  };
};
const VisibleTodoList = connect(  //connectを利用してstoreとのやりとり
  mapStateToProps,  // TodoListへ注入するStateを返す関数
  mapDispatchToProps  // TodoListへ注入するdispatcherを返す関数
)(TodoList);

export default VisibleTodoList;