import React, {Component} from 'react';
import {Link} from 'react-router';

import {FRAMEWORK_NAME, FRAMEWORK_GITHUB_URL} from '../../contents/framework';
import FRAMEWORK_LINKS from '../../contents/links';

export default class Header extends Component {

  _renderLinks() {
    const links = Object.keys(FRAMEWORK_LINKS).filter(name => name !== FRAMEWORK_NAME);
  
  }

  render() {
    const {isMenuOpen, opacity, toggleMenu} = this.props;

    return (
      <header className={isMenuOpen ? 'open' : ''}>
        <div className="bg" style={{opacity}} />
        <div className="container stretch">
          

           {/*<a href="#" style=  {{color: 'ffff' }}></a>*/}
          <a className="logo" href="#">
                  <img href="#" className="blockchain" src='../kit/faces/avarja_white.png'></img>
          </a>
          { this._renderLinks() }
          <div className="menu-toggle" onClick={ () => toggleMenu(!isMenuOpen) }>
            <i className={`icon icon-${isMenuOpen ? 'close' : 'menu'}`} />
          </div>
          <div className="links">
            <Link activeClassName="active" to="About">About US</Link>
            
            <a href="https://medium.com/@avarja">Blog</a>
            <Link activeClassName="active" href="https://github.com/avarja">
              Github<i className="icon icon-github" />
            </Link>
          </div>
        </div>
      </header>
    );
  }
}
