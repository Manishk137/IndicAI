import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../upload-video/style.css'

export default props => {
  const [type, setType] = useState('category')
  const [searchTxt, setSearchTxt] = useState('')
  const handleTypeChange = event => {
    setType(event.target.value)
  }
  const handleSearch = () => {
      props.searchRequest({
        search_by_field: type,
        value: searchTxt
      })
  }
  const handleSearchChange = event => {
    if (event.keyCode === 13) {
        return handleSearch()
    }
    setSearchTxt(event.target.value)
  }
  return (
    <nav className='navbar navbar-expand navbar-light bg-white static-top osahan-nav sticky-top'>
      &nbsp;&nbsp;
      <button
        className='btn btn-link btn-sm text-secondary order-1 order-sm-0'
        id='sidebarToggle'
      >
        <i className='fas fa-bars'></i>
      </button>{' '}
      &nbsp;&nbsp;
      <Link className='navbar-brand mr-1' to='/'>
        <img className='img-fluid' alt='' src='img/logo.png' />
      </Link>
      <div className='d-none d-md-inline-block form-inline ml-auto mr-0 mr-md-5 my-2 my-md-0 osahan-navbar-search'>
        <div className='input-group'>
          <input
            type='text'
            className='form-control'
            placeholder='Search for...'
            onKeyUp={handleSearchChange}
          />
          <select
            className='form-control search-for'
            onChange={handleTypeChange}
          >
            <option value='category'>Category</option>
            <option value='tags'>Tags</option>
            <option value='title'>Video title</option>
          </select>
          <div className='input-group-append'>
            <button
              className='btn btn-light'
              type='button'
              onClick={handleSearch}
            >
              <i className='fas fa-search'></i>
            </button>
          </div>
        </div>
      </div>
      <ul className='navbar-nav ml-auto ml-md-0 osahan-right-navbar'>
        <li className='nav-item mx-1'>
          <Link className='nav-link' to='upload'>
            <i className='fas fa-fw fa-cloud-upload-alt'></i>
            Upload Video
          </Link>
        </li>
        <li className='nav-item dropdown no-arrow osahan-right-navbar-user'>
          <a
            className='nav-link dropdown-toggle user-dropdown-link'
            href='#'
            id='userDropdown'
            role='button'
            data-toggle='dropdown'
            aria-haspopup='true'
            aria-expanded='false'
          >
            <img alt='Avatar' src='img/user.png' />
            {sessionStorage.getItem('user')
              ? JSON.parse(JSON.parse(sessionStorage.getItem('user'))).firstName
              : ''}
          </a>
          <div
            className='dropdown-menu dropdown-menu-right'
            aria-labelledby='userDropdown'
          >
            <a className='dropdown-item' href='settings.html'>
              <i className='fas fa-fw fa-user-circle'></i> &nbsp; My Account
            </a>
            <div className='dropdown-divider'></div>
            <a
              className='dropdown-item'
              href='#'
              data-toggle='modal'
              data-target='#logoutModal'
            >
              <i className='fas fa-fw fa-sign-out-alt'></i> &nbsp; Logout
            </a>
          </div>
        </li>
      </ul>
    </nav>
  )
}
