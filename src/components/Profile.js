/* global window */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Stats from 'stats.js';

import {updateMap, setHeaderOpacity} from '../actions/app-actions';
import Map from './map';
import ViewportAnimation from '../utils/map-utils';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.cameraAnimation = ViewportAnimation.fly(
      {bearing: 0},
      {bearing: -15},
      29000,
      this.props.updateMap
    ).easing(ViewportAnimation.Easing.Sinusoidal.InOut)
    .repeat(Infinity)
    .yoyo(true);
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
            <p>Distributed Ledger Technology </p>
            <a href="#" className="btn">Training</a>
          </div>
         
        </section>
         <div className="main main-raised">
       <div className="profile-content">
            <div className="container">
                <div className="row">
                    <div className="col-md-6 ml-auto mr-auto">
                        <div className="profile">
                            <div className="avatar">
                      
                                <img src="../kit/faces/chandrakanth.jpg" alt="Circle Image" className="img-raised rounded-circle img-fluid"></img>
                            </div>
                            <div className="name">
                                <h3 className="title">Chandrakanth Mamillapalli</h3>
                                <h6>Blockchain Developer</h6>
                                <a href="#pablo" className="btn btn-just-icon btn-link btn-dribbble"><i className="fa fa-dribbble"></i></a>
                                <a href="#pablo" className="btn btn-just-icon btn-link btn-twitter"><i className="fa fa-twitter"></i></a>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className="description text-center">
                    <p></p>
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
)(Profile);
