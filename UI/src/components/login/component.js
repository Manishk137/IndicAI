import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import './style.css'
import axios from 'axios'
import { services } from '../common/constant'

export default class Login extends React.Component {
    static propTypes = {
        loginReq: PropTypes.func.isRequired,
        getUser: PropTypes.object,
        fetchProgress: PropTypes.bool,
        setRole: PropTypes.func.isRequired
    }
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }
    login = (e) => {
        if (this.state.email !== '' && this.state.password !== '') {
            this.props.loginReq(this.state)
        } else{
            alert('Please enter email and password to login.')
        }
    }
    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }
    componentDidUpdate() {
        if (this.props.getUser && sessionStorage.getItem('user')) {
            this.props.history.push('/')
        }
    }
    render() {
        const { fetchProgress } = this.props
        return (
            <div className='login'>

                <section className="fxt-template-animation loaded fxt-template-layout13">
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
                                            <p>Indic AI : Using Tech and AI for mainstreaming of differently abled
An online platform to provide Accessible Education for differently abled.</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 col-12 order-md-1 fxt-bg-color">
                                <div className="fxt-content">
                                    <h2>Login Here</h2>
                                    <div className="fxt-form">

                                        <div className="form-group">
                                            <label for="email" className="input-label">Email Address</label>
                                            <input type="text" id="email" className="form-control" name="email" placeholder="demo@gmail.com" required="required" onChange={this.myChangeHandler} />
                                        </div>
                                        <div className="form-group">
                                            <label for="password" className="input-label">Password</label>
                                            <input id="password" type="password" className="form-control" name="password" placeholder="********" required="required" onChange={this.myChangeHandler} />
                                            <i toggle="#password" className="fa fa-fw fa-eye toggle-password field-icon"></i>
                                        </div>
                                        <div className="form-group">
                                            <div className="fxt-checkbox-area">

                                                <Link to="forgotpassword" className="switcher-text">Forgot Password</Link>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <button onClick={e => this.login(e)} className="fxt-btn-fill logintxt">Log in</button>
                                        </div>

                                    </div>
                                    <div className="fxt-footer">
                                        <p>Don't have an account?<Link to="Signup" className="switcher-text">Register</Link></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {fetchProgress ? <CircularProgress color="secondary" /> : ''}
            </div>
        )
    }
}