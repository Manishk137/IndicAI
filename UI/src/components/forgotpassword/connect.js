import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { signupReq, getNewUser, fetchProgress, resetSignup } from '../../state/login'

export const mapStateToProps = createStructuredSelector({
    
})

const mapDispatchToProps = dispatch => ({
    
})

export default connect(mapStateToProps, mapDispatchToProps)