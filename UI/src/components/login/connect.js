import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { loginReq, getUser, fetchProgress, setRole } from '../../state/login'

export const mapStateToProps = createStructuredSelector({
    getUser: getUser,
    fetchProgress: fetchProgress
})

const mapDispatchToProps = dispatch => ({
    loginReq: payload => dispatch(loginReq(payload)),
    setRole: payload => dispatch(setRole(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)