import React from 'react'

export default () => {
  return (
    <div>
      <div id='backdrop' className='backdrop'></div>
      <div className='loader'>
        <span style={{ fontSize: '2.4em', color: 'red' }}>Uploading   </span>
        <img
          style={{ display: 'inline-block' }}
          src={process.env.PUBLIC_URL + '/img/22.gif'}
        />
      </div>
    </div>
  )
}
