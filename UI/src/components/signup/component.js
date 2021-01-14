import React from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import './style.css'
import axios from 'axios'
import { services } from '../common/constant'

class Signup extends React.Component {



    static propTypes = {

        fetchProgress: PropTypes.bool
    }
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                first: '',
                last: '',
                email: '',
                password: '',
                confirmPassword: ''
            }
        }
    }
    validation = () => {
        const formData = this.state.formData
        let retVal = true
        for (let key in formData) {
            if (formData[key] === ''){
                retVal = false 
                break
            }
        }
        return retVal
    }
    signupuser = (e) => {
        if (this.validation()) {
            axios.post(services.baseUrl + services.register, this.state.formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(({ data }) => {
                const msg = JSON.parse(data).message
                alert(msg)
                if (msg === 'Registered Successfully  !!') {
                    this.props.history.push('/login')
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

    render() {
        const { fetchProgress } = this.props
        return (
            <div id="wrapper" className="wrapper">
                <div className="fxt-template-animation loaded fxt-template-layout13">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-6 col-12 order-md-2 fxt-bg-wrap">
                                <div className="fxt-bg-img">
                                    <div className="fxt-header">
                                        <div className="fxt-transformY-50 fxt-transition-delay-1">
                                            <a href="login-13.html" className="fxt-logo"><img src="img/logo-13.png" alt="Logo" /></a>
                                        </div>
                                        <div className="fxt-transformY-50 fxt-transition-delay-2">
                                            <h1>Welcome To Indic-AI</h1>
                                        </div>
                                        <div className="fxt-transformY-50 fxt-transition-delay-3">
                                            <p>Indic AI : Using Tech and AI for mainstreaming of differently abled An online platform to provide Accessible Education for differently abled.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-12 order-md-1 fxt-bg-color">
                                <div className="fxt-content">
                                    <h2>Register</h2>
                                    <div className="fxt-form">

                                        <div className="form-group">
                                            <label for="f_name" className="input-label">First Name</label>
                                            <input type="text" id="f_name" className="form-control" name="first" onChange={this.myChangeHandler} placeholder="example name" required="required" />
                                        </div>
                                        <div className="form-group">
                                            <label for="l_name" className="input-label">Last Name</label>
                                            <input type="text" id="l_name" className="form-control" name="last" onChange={this.myChangeHandler} placeholder="example name" required="required" />
                                        </div>
                                        <div className="form-group">
                                            <label for="email" className="input-label">Email Address</label>
                                            <input type="email" id="email" className="form-control" name="email" onChange={this.myChangeHandler} placeholder="demo@gmail.com" required="required" />
                                        </div>
                                        <div className="form-group">
                                            <label for="password" className="input-label">Password</label>
                                            <input id="password" type="password" className="form-control" onChange={this.myChangeHandler} name="password" placeholder="********" required="required" />
                                            <i toggle="#password" className="fa fa-fw fa-eye toggle-password field-icon"></i>
                                        </div>
                                        <div className="form-group">
                                            <label for="c_password" className="input-label">Confirm Password</label>
                                            <input id="c_password" type="password" className="form-control" name="confirmPassword" placeholder="********" required="required" onChange={this.myChangeHandler} />
                                            <i toggle="#c_password" className="fa fa-fw fa-eye toggle-password field-icon"></i>
                                        </div>
                                        <div className="form-group">
                                            <div className="fxt-checkbox-area">
                                                <div className="checkbox">
                                                    <input id="checkbox1" type="checkbox" />
                                                    <label for="checkbox1">I agree with the terms and condition</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <button onClick={e => this.signupuser(e)} type="submit" className="fxt-btn-fill">Register</button>
                                        </div>

                                    </div>
                                    <div className="text-center">
                                        <p>Have an account?<Link to="login" className="switcher-text">Log in</Link></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {fetchProgress ? <CircularProgress color="secondary" /> : ''}
            </div>
        )
    }
}

export default withRouter(Signup)