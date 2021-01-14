import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getVideo } from '../../../state/home'

export const mapStateToProps = createStructuredSelector({
    video: getVideo
})



export default connect(mapStateToProps)