import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns'
import axios from 'axios'
import { services } from '../../common/constant'
import Header from '../../common/header'
import Footer from '../../common/footer'
import SideNav from '../../common/sidenav'
import { map } from 'lodash';


const Timeline = (props) => {
    const [timeLines, setTimeLines] = useState([])
    const { videoId } = useParams();
    useEffect(() => {
        axios.post(services.baseUrl + services.getTranscript, { v_id: props.video.v_id }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(({ data }) => {
            const msg = JSON.parse(data).transcript
            setTimeLines(msg)
        })
    }, [])
    const getuploadVideoTime = time => {
        const dayDiff = differenceInDays(Date.now(), new Date((time.split(' ')[0]).replace(/:/g, '/') + ' ' + time.split(' ')[1]))
        if (dayDiff < 1) {
            const hourDiff = differenceInHours(Date.now(), new Date((time.split(' ')[0]).replace(/:/g, '/') + ' ' + time.split(' ')[1]).getTime())
            if (hourDiff < 1) {
                return differenceInMinutes(Date.now(), new Date((time.split(' ')[0]).replace(/:/g, '/') + ' ' + time.split(' ')[1]).getTime()) + ' minutes ago'
            }
            return hourDiff + ' hours ago'
        }
        return dayDiff + ' days ago'
    }
    const saveTranscript = (e, timeline, index) => {
        if (timeLines && timeLines[index].transcript === e.target.text) {
            return
        }
        axios.post(services.baseUrl + services.updateTranscript, { timestamp: timeline, updated_transcript: e.target.text, v_id: props.video.v_id }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(({ data }) => {
            const msg = JSON.parse(data).updateStatus
            console.log(msg)
        })

    }

    const jumpTo = timeline => {
        let getSeconds = timeline.split('.')
        getSeconds = (getSeconds[0] * 60 + getSeconds[1] * 60 + getSeconds[2])
        var myvideo = document.getElementById('myvideo')
        myvideo.play();
        myvideo.pause();
        myvideo.currentTime = getSeconds;
        myvideo.play();
    }
    return (
        <div>
            <Header />
            <div id="wrapper">
                <SideNav></SideNav>
                <div id="content-wrapper">
                    <div className="container-fluid pb-0">
                        <div className="video-block section-padding">
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="single-video-left">
                                        <div className="single-video">
                                            {/* <iframe width="100%" height="315" src="https://www.youtube.com/embed/jWa6fW5rj2w" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> */}

                                            <video id="myvideo" width="100%" height='315' controls autoPlay>
                                                <source src={services.thumbBasePath + 'videos/file_' + props.video.v_id + '.mp4'} type="video/mp4"></source>
    Your browser does not support HTML5 video.</video>
                                        </div>
                                        <div className="single-video-title box mb-3">
                                            <h2>{props.video.title}</h2>
                                            <p className="col-md-3" style={{ "marginLeft": "-15px" }}>
                                                {props.video.privacysettings}
                                            </p>
    <span className="col-md-6" style={{ "margiLeft": "150px", "marginTop": "-42px", "position": "absolute" }}>Created {getuploadVideoTime(props.video.upload_date)}</span>


                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="single-video-right">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="main-title">
                                                    <div className="btn-group float-right right-action">
													 
                                                        <a download={props.video.v_id+'.txt'} href={services.thumbBasePath + 'transcripts/' + props.video.v_id +'/' + props.video.v_id + '.transcript'} className="right-action-link text-gray" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            Download transcript <i class="fas fa-download"></i>
                                                        </a>                                                        
                                                    </div>
                                                    <h6>TimeLine</h6>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="video-card video-card-list">
                                                    <div className="video-card-body">
                                                        <div className="video-view">
                                                            {timeLines &&
                                                                timeLines.map((item, i) => (<div key={i} className="video-title">
                                                                    <span style={{ "fontWeight": "400", "background": "#e5dddd", color: '#000000', "display": "inline-block", "padding": "3px 7px" }}>{item.timestamp}</span> &nbsp;&nbsp;&nbsp;<a onBlur={e => { saveTranscript(e, item.timestamp, i) }} onClick={e => {
                                                                        jumpTo(item.timestamp)
                                                                    }} href="#" style={{ "fontWeight": "400" }} contentEditable="true" title="Click here to Edit Text">{item.transcript}</a>
                                                                </div>))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div></div></div></div></div></div></div>
                    <Footer />
                </div></div></div>
    )
}

export default Timeline