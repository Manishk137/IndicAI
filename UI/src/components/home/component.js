import React from 'react'
import PropTypes from 'prop-types'
import Header from '../common/header'
import Footer from '../common/footer'
import SideNav from '../common/sidenav'
import VideoCard from './video-card'
import axios from 'axios'
import { services } from '../common/constant'

export default class HomeMain extends React.Component {
  static propTypes = {
    initLoadData: PropTypes.func.isRequired,
    getInitData: PropTypes.string
  }
  constructor (props) {
    super(props)
    this.state = {
      noResult: false,
      pageNumber: 0,
      pageSize: 10,
      pageCount: 1,
      search: false,
      videoList: []
    }
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.props.searchResult !== prevProps.searchResult) {
      if (this.props.searchResult.length === 0) {
        this.setState({
          noResult: true
        })
      } else {
        this.setState({
          videoList: this.props.searchResult,
          pageCount: 1,
          search: true,
          noResult: false
        })
      }
    }
  }
  componentDidMount () {
    this.props.initLoadData()
    this.getData(0)
    axios
      .get(services.baseUrl + services.getTotalRecord, {
        headers: {
          'Content-type': 'application/json'
        }
      })
      .then(({ data }) => {
        const totalReords = JSON.parse(data).TotalRecords
        let pages =
          totalReords <= this.state.pageSize
            ? 1
            : (totalReords + this.state.pageSize - 1) / this.state.pageSize
        this.setState({ pageCount: pages })
      })
  }
  getData = pageNum => {
    axios
      .get(
        services.baseUrl + services.getList,
        {
          params: {
            page_number: pageNum,
            page_size: this.state.pageSize
          }
        },
        {
          headers: {
            'Content-type': 'application/json'
          }
        }
      )
      .then(({ data }) => {
        this.setState({ videoList: JSON.parse(data).videoProperties })
      })
  }
  navigateToPage = num => {
    this.setState({
      pageNumber: num - 1
    })
    this.getData(num - 1)
  }
  setVideoObject = (item, type) => {
    this.props.setVideo(item)
    if (type === 'meta') {
      this.props.history.push('/progress')
    } else {
      this.props.history.push('/timeline')
    }
  }
  render () {
    const pages = []
    for (let i = 1; i <= this.state.pageCount; i++) {
      pages.push(
        <span>
          <a
            href='#'
            onClick={() => this.navigateToPage(i)}
            className={this.state.pageNumber === i - 1 ? 'active' : ''}
          >
            {i}
          </a>
        </span>
      )
    }
    return (
      <div>
        <Header />
        <div id='wrapper'>
          <SideNav></SideNav>
          <div id='content-wrapper'>
            <div className='container-fluid pb-0'>
              <div className='video-block section-padding'>
                <div className='row'>
                  <div className='col-md-12'>
                    <div className='main-title'>
                      <div className='btn-group float-right right-action'>
                        <a
                          href='#'
                          className='right-action-link text-gray'
                          data-toggle='dropdown'
                          aria-haspopup='true'
                          aria-expanded='false'
                        >
                          Sort by{' '}
                          <i
                            className='fa fa-caret-down'
                            aria-hidden='true'
                          ></i>
                        </a>
                        <div className='dropdown-menu dropdown-menu-right'>
                          <a className='dropdown-item' href='#'>
                            <i className='fas fa-fw fa-star'></i> &nbsp; Top
                            Rated
                          </a>
                          <a className='dropdown-item' href='#'>
                            <i className='fas fa-fw fa-signal'></i> &nbsp;
                            Viewed
                          </a>
                          <a className='dropdown-item' href='#'>
                            <i className='fas fa-fw fa-times-circle'></i> &nbsp;
                            Close
                          </a>
                        </div>
                      </div>
                      <h6>Library</h6>
                    </div>
                  </div>

                  {this.state.videoList && !this.state.noResult
                    ? this.state.videoList.map(item => (
                        <VideoCard
                          setVideoObject={(item, type) => {
                            this.setVideoObject(item, type)
                          }}
                          card={item}
                        />
                      ))
                    : ''}
                </div>
                {!this.state.noResult && !this.state.search && (
                  <div className='pagination'>{pages}</div>
                )}
                {this.state.noResult && <div className='no-result'>No Result found for given search criteria.</div>}
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    )
  }
}
