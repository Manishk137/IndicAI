import { connect } from 'react-redux'
import { searchRequest } from '../../../state/home'

const mapDispatchToProps = dispatch => ({
  searchRequest: payload => dispatch(searchRequest(payload))
})

export default connect(null, mapDispatchToProps)
