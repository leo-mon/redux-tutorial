// Todoが見えるかどうかのフラグ処理のReducer
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


export default visibilityFilter