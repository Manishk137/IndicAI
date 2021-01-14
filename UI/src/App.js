import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';
import { ProtectedRoute } from './protected.route'
import ForgotPassword from './components/forgotpassword'
import Home from './components/home'
import Model from './components/model-customization'
import Upload from './components/upload-video'
import VideoProgress from './components/upload-video/video-progress'
import Login from './components/login';
import Signup from './components/signup';
import Timeline from './components/upload-video/timeline'
import './App.css';

class App extends Component {

  render() {
    return (
      <div className={"App"}>

        <Router>

          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" component={Login} />
            <Route path='/Signup' component={Signup} /> 
            <Route path="/model-customization" exact component={Model} />
            <Route path='/forgotpassword' component={ForgotPassword} />
            <Route path='/upload' component={Upload} />
            <Route path='/progress' component={VideoProgress} />
            <Route path="/timeline" component={Timeline} />

            <Route path="*">
              No Match
            </Route>
          </Switch>
        </Router>

      </div>
    );
  }
}

export default App;
