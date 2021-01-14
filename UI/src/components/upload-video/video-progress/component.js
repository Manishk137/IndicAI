import React from 'react'
import axios from 'axios'
import Header from '../../common/header'
import Footer from '../../common/footer'
import SideNav from '../../common/sidenav'
import { services } from '../../common/constant'

class VideoProgress extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedCategories: [],
            // certified: false,
            formData: {
                v_id: this.props.video.v_id,
                title: this.props.video.title,
                description: this.props.video.description,
                language: this.props.video.language,
                privacysettings: this.props.video.privacysettings,
                languagemodel: this.props.video.languagemodel,
                tags: this.props.video.tags,
                category: this.props.video.category,
                deletemarker: this.props.video.deletemarker
            },
            category: [{ name: 'Abaft', id: 1 }, { name: 'Brick', id: 2 }, { name: 'Purpose', id: 3 }, { name: 'Shallow', id: 4 }, { name: 'Spray', id: 5 }, { name: 'Cemetery', id: 6 }, { name: 'Trouble', id: 7 }, { name: 'Pin', id: 8 }, { name: 'Fall', id: 9 }, { name: 'Leg', id: 10 }, { name: 'Scissors', id: 11 }, { name: 'Stitch', id: 12 }, { name: 'Agonizing', id: 13 }, { name: 'Rescue', id: 14 }, { name: 'Quiet', id: 15 }]
        }
    }
    validation = () => {
        const formData = this.state.formData
        let retVal = true
        for (let key in formData) {
            if (formData[key] === '') {
                retVal = false
                break
            }
        }
        return retVal
    }
    saveMeta = (e) => {
        if (this.validation()) {
            /* if (!this.state.certified) {
                alert('Please check certificate first')
                return
            } */
            axios.post(services.baseUrl + services.saveMetadata, this.state.formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(({ data }) => {
                const msg = JSON.parse(data).message
                alert(msg)
                if (msg === 'Record saved') {
                    this.props.history.push('/')
                }

            })
        }
        else {
            alert('Please fill all mandatory fields.')
        }
    }
    myChangeHandler = (event) => {
        var formData = { ...this.state.formData }
        formData[event.target.name] = event.target.value
        this.setState({ formData });
    }
    myCheckboxHandler = (event) => {
        var formData = { ...this.state.formData }
        let selectedCategories = this.state.selectedCategories
        if (event.currentTarget.checked) {
            if (selectedCategories.length > 5) {
                event.preventDefault()
                return alert('You already select 6 categories.')
            }
            selectedCategories.push(event.currentTarget.name)
        }
        else {
            const selIndex = selectedCategories.indexOf(event.currentTarget.name)
            selectedCategories.splice(selIndex, 1)
        }
        formData['category'] = selectedCategories.join()
        this.setState({ selectedCategories, formData });
    }
    render() {
        return (
            <div>
                <Header />
                <div id="wrapper">
                    <SideNav></SideNav>
                    <div id="content-wrapper">

                        <div className="container-fluid upload-details">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="main-title">
                                        <h6>Uploading media file
                                        <div className='inactive'>
                                            <div className="custom-control custom-checkbox">
                                                <input type="checkbox" className="custom-control-input" name='deleteMakrer' value={this.state.formData.deletemarker} onChange={e => {
                                                    this.setState({
                                                        formData: {
                                                            ...this.state.formData, deletemarker: e.target.checked
                                                        }
                                                    })
                                                }} name='Inactive Video' id='deletemarker' />
                                                <label className="custom-control-label" for='deletemarker'>Inactive Video</label>
                                            </div>
                                        </div>
                                        </h6>
                                    </div>
                                </div>
                                <div className="col-lg-2">
                                    <div className="imgplace"></div>
                                </div>
                                <div className="col-lg-10">
                                    <div className="osahan-title">{this.state.formData.title} </div>
                                    <div className="osahan-progress">
                                        <div className="progress">
                                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{ "width": "100%" }}></div>
                                        </div>
                                        <div className="osahan-close">
                                            <a href="#"><i className="fas fa-times-circle"></i></a>
                                        </div>
                                    </div>
                                    <div className="osahan-desc">Your Video is still uploading, please keep this page open until it's done.</div>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="osahan-form">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="form-group">
                                                    <label for="e1">Video Title</label>
                                                    <input type="text" placeholder="2020-06-20 02-31-01" id="e1" className="form-control" name='title' value={this.state.formData.title} onChange={this.myChangeHandler} />
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="form-group">
                                                    <label for="e2">About</label>
                                                    <textarea rows="3" id="e2" name="e2" className="form-control" name='description' value={this.state.formData.description} onChange={this.myChangeHandler} placeholder='Description'></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-4">
                                                <div className="form-group">
                                                    <label for="e9">Language in Video (Optional)</label>
                                                    <select id="e9" className="custom-select" name='language' value={this.state.formData.language} onChange={this.myChangeHandler}>
                                                        <option>English</option>
                                                        <option>Hindi</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="form-group">
                                                    <label for="e4">Privacy Settings</label>
                                                    <select id="e4" className="custom-select" name='privacysettings' value={this.state.formData.privacysettings} onChange={this.myChangeHandler}>
                                                        <option>Public</option>
                                                        <option>Private</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="form-group">
                                                    <label for="e4">Language Model</label>
                                                    <select id="e4" className="custom-select" name='languagemodel' value={this.state.formData.languagemodel} onChange={this.myChangeHandler}>
                                                        <option>Default</option>
                                                    </select>
                                                </div>
                                            </div>


                                        </div>
                                        <div className="row">
                                            <div className="col-lg-4">
                                                <div className="form-group">
                                                    <label for="e7">Tags (13 Tags Remaining)</label>
                                                    <input type="text" placeholder="Gaming, PS4" id="e7" value={this.state.formData.tags} className="form-control" name='tags' onChange={this.myChangeHandler} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row ">
                                            <div className="col-lg-12">
                                                <div className="main-title">
                                                    <h6>Category ( you can select upto 6 categories )</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row category-checkbox">
                                            {
                                                this.state.category.map(item => {
                                                    return <div className="col-lg-2 col-xs-6 col-4 custom-control custom-checkbox">
                                                        <input type="checkbox" className="custom-control-input" name='category' value={this.state.formData.category} onChange={this.myCheckboxHandler} name={item.name} id={"customCheck" + item.id} />
                                                        <label className="custom-control-label" for={"customCheck" + item.id}>{item.name}</label>
                                                    </div>
                                                })
                                            }
                                        </div>
                                    </div>

                                    <hr />
                                   {/*  <div className="terms text-center">
                                        <p className="mb-0"> <input type="checkbox" onClick={e => { this.setState({ 'certified': e.target.checked }) }} /> By checking this box, I certify that use of any facial recognition functionality in this service is not by or for a police department in the United States, and I represent that I have all rights (and individuals’ consents, where applicable) to use and store the file/data, and agree that it will be handled per the Online Services Terms and the Privacy Statement.</p>

                                    </div> */}
                                    <div className="osahan-area text-center mt-3">
                                        <a className="btn btn-outline-primary" onClick={this.saveMeta}>Save Changes</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Footer /></div></div></div>
        )
    }
}

export default VideoProgress