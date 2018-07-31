/* global window */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Stats from 'stats.js';
import {updateMap, setHeaderOpacity} from '../actions/app-actions';
import Map from './map';
import ViewportAnimation from '../utils/map-utils';
import PropTypes from 'prop-types';



class Home extends Component {
constructor(props) {
super(props);
this.state = {
    name:'',
    email:'',
    feedback: '',
    formSubmitted: false
}
this.handleCancel = this.handleCancel.bind(this);
  this.handleChange = this.handleChange.bind(this);
 this.handleSubmit = this.handleSubmit.bind(this);



this.cameraAnimation = ViewportAnimation.fly(
{bearing: 0},
{bearing: -15},
29000,
this.props.updateMap
).easing(ViewportAnimation.Easing.Sinusoidal.InOut)
.repeat(Infinity)
.yoyo(true);
}
handleChange = event =>{
    this.setState({[event.target.name]:event.target.value})
}


  handleCancel() {
    this.setState({
      feedback: ''
    });
  }

  // handleChange(event) {
  //   this.setState(({[e.target.name]:e.target.value})
  // }

  handleSubmit(event) {
    event.preventDefault();

    
     const receiverEmail="training@avarja.com";
   const template = "template";

    this.sendFeedback(
      template,
      this.state.email,
      receiverEmail,
      this.state.feedback,
      this.state.name
    );

    this.setState({
      formSubmitted: true
    });
  }

  sendFeedback(templateId, senderEmail, receiverEmail, feedback,name) {
    window.emailjs
      .send('gmail', templateId, {
        senderEmail,
        receiverEmail,
        feedback,
        name
      })
      .then(res => {
        this.setState({
          formEmailSent: true
        });
        console.log('Mail sent')
      })
      // Handle errors here however you like
      .catch(err => console.error('Failed to send feedback. Error: ', err));
  }


componentDidMount() {
window.onscroll = this._onScroll.bind(this);
window.onresize = this._resizeMap.bind(this);
this._onScroll();
this._resizeMap();
this._stats = new Stats();
this._stats.showPanel(0);
// this.refs.fps.appendChild(this._stats.dom);
const calcFPS = () => {
this._stats.begin();
this._stats.end();
this._animateRef = window.requestAnimationFrame(calcFPS);
};
this._animateRef = window.requestAnimationFrame(calcFPS);
this.cameraAnimation.start();
}
componentWillUnmount() {
window.onscroll = null;
window.onresize = null;
this.cameraAnimation.stop();
window.cancelAnimationFrame(this._animateRef);
}
_resizeMap() {
const container = this.refs.banner;
const width = container.clientWidth;
const height = container.clientHeight;
this.props.updateMap({width, height});
}
_onScroll() {
const y = window.pageYOffset;
const opacity = Math.max(0, Math.min(1, (y - 168) / 20));
this.props.setHeaderOpacity(opacity);
}
render() {
const {atTop} = this.state;
return (
<div className={`home-wrapper ${atTop ? 'top' : ''}`}>
    
    <section ref="banner" id="banner">
        <div className="hero">
            <Map demo="HomeDemo" isInteractive={false} />
        </div>
        <div className="container soft-left">
            <h1>Avarja</h1>
            <p>Distributed Ledger Technology solutions </p>
            <a href="/#/Tutorials" className="btn">Training</a>
        </div>
        
    </section>
    <div className="main main-raised">
        <div className="container">
            <div className="section text-center">
                <div className="row">
                    <div className="col-md-8 ml-auto mr-auto">
                        <h2 className="title">Products</h2>
                        <h5 className="description"></h5>
                    </div>
                </div>
                <div className="features">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="info">
                                <a href="/#/soon">
                                    <img className="blockchain" src="../kit/blockchain.svg" ></img>
                                    
                                </a>
                                <h4 className="info-title">Blockchain as a service </h4>
                                <p>One stop solution to all your blockchain needs , Click to deploy your different blockchain platfroms</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="info">
                                <a href="/#/soon">
                                    <div className="icon icon-success">
                                        <img className="blockchain" src="../kit/map.svg" ></img>
                                    </div>
                                </a>
                                <h4 className="info-title">Real-time asset tracking </h4>
                                <p>Realtime asset status tracking solutions on blockchain using cutting edge LTE-M IOT devices </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="info">
                                <a href="/#/tutorials">
                                    <div className="icon icon-danger">
                                        
                                        <i className="material-icons">code</i>
                                        
                                    </div>
                                </a>
                                <h4 className="info-title">Training</h4>
                                <p>Live extensive Hands-on Training</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="section row">
                
                <div className="col-md-4">
                    <h2> We Are A Experienced
                    Consulting Company Focused on Helping Businesses Achieve Their Digital Goals</h2>
                    <p>Founded by a team of young, dynamic and task-oriented IT experts, Avarja Technologies brings a pragmatic approach with proven,
                    real-world solutions to the constantly changing & challenging fields of technology</p>
                </div>
                <div className="col-md-2">
                </div>
                <div className="col-md-6">
                    <img src="../kit/we.png" alt="Thumbnail Image"  className="col-md-10"></img>
                </div>
            </div>

              <div className="section row">
          
          
                <div className="col-md-6">
                    <img src="../kit/blockchain-apps.png" alt="Thumbnail Image" className="col-md-10" ></img>
                </div>
                      <div className="col-md-2">
                </div>
                <div className="col-md-4">
                    <h2> We bring your ideas into reality</h2>
                    <p>
Avarja Technologies provides Blockchain development, support, data migration, training, consulting and advisory services for Blockchain Projects.
 Our specialized team of certified consultants based in United States, India, Germany and Canada handle 
 Software programming and application development.</p>
                </div>
            </div>
            {/*
            <div className="section text-center">
                <h2 className="title">Here is our team</h2>
                <div className="team">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="team-player">
                                <div className="card card-plain">
                                    <div className="col-md-6 ml-auto mr-auto">
                                        <img src="../kit/faces/chandrakanth.jpg" alt="Thumbnail Image" className="img-raised rounded-circle img-fluid"></img>
                                    </div>
                                    <h4 className="card-title">Chandrakanth Mamillapalli  </h4>
                                    
                                    <small className="card-description text-muted">Blockchain Developer</small>
                                    
                                    <div className="card-body">
                                        <p className="card-description">
                                            <a href="/#/profile">links</a> </p>
                                        </div>
                                        <div className="card-footer justify-content-center">
                                            <a href="#pablo" className="btn btn-link btn-just-icon"><i className="fab fa-twitter fa-2x"></i></a>
                                            <a href="#pablo" className="btn btn-link btn-just-icon"><i className="fab fa-linkedin fa-2x"></i></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="team-player">
                                    <div className="card card-plain">
                                        <div className="col-md-6 ml-auto mr-auto">
                                            <img src="../kit/faces/sbp.jpg" alt="Thumbnail Image" className="img-raised rounded-circle img-fluid"></img>
                                        </div>
                                        <h4 className="card-title">Bhanu Prakash </h4>
                                        
                                        <small className="card-description text-muted">Marketing Manager</small>
                                        
                                        <div className="card-body">
                                            <p className="card-description">
                                                <a href="#">links</a> </p>
                                            </div>
                                            <div className="card-footer justify-content-center">
                                                <a href="#pablo" className="btn btn-link btn-just-icon"><i className="fab fa-twitter fa-2x"></i></a>
                                                <a href="#pablo" className="btn btn-link btn-just-icon"><i className="fab fa-linkedin fa-2x"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="team-player">
                                        <div className="card card-plain">
                                            <div className="col-md-6 ml-auto mr-auto">
                                                <img src="../kit/faces/tharun.png" alt="Thumbnail Image" className="img-raised rounded-circle img-fluid"></img>
                                            </div>
                                            <h4 className="card-title">Tharun  </h4>
                                            
                                            <small className="card-description text-muted">Designer</small>
                                            
                                            <div className="card-body">
                                                <p className="card-description">
                                                    <a href="#">links</a> </p>
                                                </div>
                                                <div className="card-footer justify-content-center">
                                                    <a href="#pablo" className="btn btn-link btn-just-icon"><i className="fab fa-twitter fa-2x"></i></a>
                                                    <a href="#pablo" className="btn btn-link btn-just-icon"><i className="fab fa-instagram fa-2x"></i></a>
                                                    <a href="#pablo" className="btn btn-link btn-just-icon"><i className="fab fa-facebook-square fa-2x"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}

               <div className="section section-contacts">
                            <div className="row">
                                <div className="col-md-8 ml-auto mr-auto">
                                    <h2 className="text-center title">Work with us</h2>
                                    <h4 className="text-center description">Contact us about any further collaboration. We will responde get back to you in a couple of hours.</h4>
                                    <form onSubmit={this.handleSubmit} className="workwithus">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label for="name" className="bmd-label-floating">Your Name</label>
                                                    <input type="text" name="name" className="form-control" value={this.state.name} onChange={this.handleChange}></input>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label for="email" className="bmd-label-floating">Your Email</label>
                                                    <input type="email" name="email" className="form-control" value={this.state.email} onChange={this.handleChange}></input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label for="exampleMessage" for="feedback" className="bmd-label-floating">Your Message</label>
                                            <textarea type="textarea" name="feedback" value={this.state.feedback} className="form-control" rows="4" id="exampleMessage" onChange={this.handleChange}></textarea>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4 ml-auto mr-auto text-center">
                                                <button type="submit" value="Submit" className="btn btn-primary  btn-round">
                                                Send Message
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <hr />
                <footer className="footer ">
                    <div className="container">
                        <nav className="pull-left">
                            <ul>
                                
                                <li>
                                    <a href="#/About" >
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="https://medium.com/@avarja">
                                        Blog
                                    </a>
                                </li>
                               
                            </ul>
                        </nav>
                        <nav className="pull-right">
                            <ul>
                                <li>
                                    <a >
                                        <i className="material-icons">email</i> training@avarja.com <i className="material-icons">call</i> +1(480)4207424
                                    </a>
                                    <a >
                                        <i className="material-icons">email</i> support@avarja.com
                                    </a>
                                </li>
                            </ul>
                        </nav>
                        <div className="copyright pull-right">
                            &copy;
                            <script>
                            document.write(new Date().getFullYear())
                            </script>2018 avarja llc.
                        </div>
                    </div>
                </footer>
            </div>
            );
            }
            }
            export default connect(
            state => ({}),
            {updateMap, setHeaderOpacity}
            )(Home);