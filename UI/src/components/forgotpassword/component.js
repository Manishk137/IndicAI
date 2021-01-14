import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import './style.css'
import axios from 'axios'
import { services } from '../common/constant'

export default class ForgotPassword extends React.Component {
    static propTypes = {

    }
    constructor(props) {
        super(props);
        this.state = { password: '' }

    }
    myChangeHandler = (event) => {
        
        this.setState({ password: event.target.value });
    }
    forgotPassword(e) {
        if (this.state.password !== '') {
            axios.post(services.baseUrl + services.forgotPassword, { email: this.state.password }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(({ data }) => {
                const msg = JSON.parse(data).retreiveDone
                alert('Please check your email to retrive password.')
                if (msg === 'True') {
                    this.props.history.push('/login')
                }

            })
        }
    }

    render() {

        return (
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
                                        <p>Indic AI : Using Tech and AI for mainstreaming of differently abled An online platform to provide Accessible Education for differently abled..</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-12 order-md-1 fxt-bg-color">
                            <div className="fxt-content">
                                <h2>Forgot Password</h2>
                                <div className="fxt-form">

                                    <div className="form-group">
                                        <label for="email" className="input-label">Email Address</label>
                                        <input type="email" id="email" className="form-control" onChange={this.myChangeHandler} name="email" placeholder="demo@gmail.com" required="required" />
                                    </div>
                                    <div className="form-group">
                                        <button onClick={e => this.forgotPassword(e)} type="submit" className="fxt-btn-fill">Send Me Email</button>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p>Don't have an account?<Link to="Signup" className="switcher-text">Register</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}