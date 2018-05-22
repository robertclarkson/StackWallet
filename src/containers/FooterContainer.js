import { connect } from 'react-redux'
import { setVisibilityFilter } from '../actions'
import Footer from '../components/Footer'

const mapStateToProps = (state, ownProps) => ({
  active: state.visibilityFilter
})

const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer)
