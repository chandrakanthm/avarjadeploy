/* global window */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Stats from 'stats.js';
import {updateMap, setHeaderOpacity} from '../actions/app-actions';
import Map from './map';
import ViewportAnimation from '../utils/map-utils';
class Tutorials extends Component {
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
    
    <section ref="banner" id="tutorials">
        <div className="hero">
            
        </div>
        <div className="container soft-left">
            <h1>Blockchain Training</h1>
            <p>Extensive live Hands-on Training</p>
            <a href="/#/About" className="btn">support@avarja.com</a>
            <p></p>
            <div className="soft-right"></div>
            <h4>Specialized Disruptive Technologies (Blockchain, AI, Machine Learning & more) training
            Our Training courses are LIVE Virtual Instructor Led Online Training
            Training session recordings, Training material, lab exercises, code samples are provided
            Course Completion Certificates and Certification exams are available</h4>
        </div>
        
    </section>
    <div className="main main-raised">
        <div className="container">
            <div className="section">
                <div className="row">
                    <div className="col-md-8 ml-auto mr-auto text-center">
                        <h2 className="title">Upcoming sessions</h2>
                        <h5 className="description">Live Remote Sessions </h5>
                    </div>
                </div>
                <div className="features">
                    <div className="row">
                        
                        <div className="col-md-12 sessions">
                            <div className="text-center">
                                <img className="blockchain pull-left" src="../kit/blockchain.svg" ></img>
                                <h4 className="info-title">Blockchain Bootcamp (Aug 4-26, 2018)</h4>
                                
                            </div>
                            
                            <p>Programming Knowledge and JavaScript Knowledge is required to take this course. There is a great demand for Blockchain developers in the enterprise.
                            This course will help you begin your journey as a Blockchain developer. </p>
                            <p>If you do not know programming in general and/or JavaScript, we do teach another class before you can take Blockchain Developer bootcamp. Please send email to support@avarja.com if you are interested.</p>
                            <p>Those who have no programming knowledge will still get a lot of value from taking this course just as a beginner would learn a lot from watching someone cooking a meal or changing a flat tire.</p>
                            <p>Placement assistance for Blockchain developers is available upon request. <a href="https://www.eventbrite.com/o/avarja-17314892717">Learn more <i className="material-icons">open_in_new</i></a></p>
                            
                            
                            <div className="icon icon-success text-center">
                                <button className="Register btn btn-round btn-primary">Register</button>
                                
                            </div>
                            
                        </div>

                        
                        
                    </div>
                </div>
            </div>
            <div className="section text-center">
                <h2 className="title">Trainers</h2>
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
                                          <div className="card-footer justify-content-center">
                                            <a href="https://twitter.com" className="btn btn-link btn-just-icon"><i className="fab fa-twitter fa-2x"></i></a>
                                            <a href="https://www.linkedin.com/in/mchandrakanthreddy/" className="btn btn-link btn-just-icon"><i className="fab fa-linkedin fa-2x"></i></a>
                                        </div>
                                        
                                        </div>
                                      
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
        
                
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
                <nav>
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
    )(Tutorials);