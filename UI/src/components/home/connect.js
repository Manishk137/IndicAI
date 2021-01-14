import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { initLoadData, getInitData, setVideo, getSearchResult } from '../../state/home'

export const mapStateToProps = createStructuredSelector({
    getInitData: getInitData,
    searchResult: getSearchResult
})

const mapDispatchToProps = dispatch => ({
    initLoadData: () => dispatch(initLoadData()),
    setVideo:  data => dispatch(setVideo(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)