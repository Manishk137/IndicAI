import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../common/header'
import Footer from '../common/footer'
import SideNav from '../common/sidenav'
import { services } from '../common/constant'
import Loader from '../common/loader'
import axios from 'axios'
import '../upload-video/style.css'
const Uploadvideo = props => {
  const [showLoader, setShowLoader] = useState(false)
  const [imgFile, setImgFile] = useState()
  const [imgFiles, setImgFiles] = useState()
  const handleChange = e => {
    e.target.files.length === 1
      ? setImgFile(e.target.files[0])
      : setImgFiles(e.target.files)
  }
  const handleSubmitFile = () => {
    if (imgFiles) {
      let formData = new FormData()
      for (let i = 0; i < imgFiles.length; i++) {
        formData.append('files[]', imgFiles[i])
      }
      // formData.append('files', imgFiles);
      setShowLoader(true)
      axios
        .post(services.baseUrl + services.uploadMultiVideo, formData, {
          headers: {
            'Content-type': 'application/json'
          }
        })
        .then(({ data }) => {
          const response = JSON.parse(data)
          sessionStorage.setItem('VideoKeys', response.VideoKeys)
          setShowLoader(false)
          alert(response.message + ' with VideoKeys ' + response.VideoKeys)
          props.history.push('/')
        })
    } else if (imgFile) {
      let formData = new FormData()
      formData.append('file', imgFile)
      setShowLoader(true)
      axios
        .post(services.baseUrl + services.uploadVideo, formData, {
          headers: {
            'Content-type': 'application/json'
          }
        })
        .then(({ data }) => {
          const response = JSON.parse(data)
          setShowLoader(false)
          alert(response.message + ' with VideoKey ' + response.VideoKey)
          props.history.push('/')
        })
    }
  }
  return (
    <div>
      <Header />
      <div id='wrapper'>
        <SideNav></SideNav>
        <div id='content-wrapper'>
          <div className='container-fluid pt-5 pb-5'>
            <div className='row'>
              <div className='col-md-8 mx-auto text-center upload-video pt-5 pb-5'>
                <i
                  className='fas fa-cloud-upload-alt text-primary'
                  style={{ 'font-size': '175px;' }}
                ></i>

                <h4 className='mt-5'>Select model files to upload</h4>
                <p className='land'>
                  Select a Directory to upload multiple files...
                </p>
                <div className='mt-6' style={{ 'margin-left': '180px' }}>
                  <div className='input-file-container js'>
                    <input
                      className='input-file'
                      id='my-file'
                      type='file'
                      multiple={true}
                      onChange={handleChange}
                    />
                    <label
                      tabindex='0'
                      for='my-file'
                      className='input-file-trigger'
                    >
                      Browse a file...
                    </label>
                  </div>

                  <p
                    className='file-return'
                    style={{ position: 'absolute', 'margin-top': '10px' }}
                  ></p>
                </div>
                <a
                  className='btn btn-outline-primary'
                  style={{
                    position: 'absolute',
                    'margin-top': '-52px',
                    padding: '13px',
                    'margin-left': '60px',
                    'font-size': '1em',
                    'font-weight': '600'
                  }}
                  onClick={handleSubmitFile}
                >
                  Upload Model Files(s)
                </a>
              </div>
            </div>
          </div>
          {showLoader && <Loader />}
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default Uploadvideo
