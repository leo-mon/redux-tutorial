import { connect } from 'react-redux'
import { setVisibilityFilter } from '../actions'
import Link from '../components/Link'

const mapStateToProps = (
  state,
  ownProps  // 第二引数で自身の持つPropsを渡せる
) => {
  return {
    active:
      ownProps.filter ===
      state.visibilityFilter  // 現在表示中の項目か判定
  };
};

const mapDispatchToProps = (
  dispatch,
  ownProps
) => {
  return {
    onClick: () => { 
      dispatch(setVisibilityFilter(ownProps.filter))
    }
  };
}

const FilterLink = connect(
  mapStateToProps,
  mapDispatchToProps
)(Link);

export default FilterLink;