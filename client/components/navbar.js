import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from '../store'
import FriendButton from './friend-button'

const Navbar = ({ handleClick, isLoggedIn, handleMouseDown }) => (
  <div id="nav-container">
    <nav>
      {isLoggedIn ? (
        <div id="nav-inner">
          <div id="nav-hidden-div">
            <div id="nav-hidden">My Playlists</div>
            <div id="nav-hidden">Logout</div>
          </div>
          {/* <FriendButton handleMouseDown={handleMouseDown} /> */}
          <h1 id="header">deci</h1>
          {/* The navbar will show these links after you log in */}
          {/* <Link to="/home">Home</Link> */}
          <div>
            <a href="/home">My Playlists</a>
            <a href="#" onClick={handleClick}>Logout</a>
          </div>
        </div>
      ) : (
          <div id="nav-inner-login">
            <h1 id="header">deci</h1>
            {/* The navbar will show these links before you log in */}
            {/* <Link to="/login">Login</Link> */}
            {/* <Link to="/signup">Sign Up</Link> */}
          </div>
        )}
    </nav>
    <hr />
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
