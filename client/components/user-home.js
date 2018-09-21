import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getPlaylists, getAccessToken } from '../store/playlists'

/**
 * COMPONENT
 */

class UserHome extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log('PROPS ACTION TOKEN', this.props.accessToken)
    const { accessToken, refreshToken } = this.props
    console.log('pulled out from props', accessToken)
    this.props.setInitialToken(accessToken, refreshToken)
    this.props.retrievePlaylists(this.props.userId)
  }

  render() {
    const playlists = this.props.playlists
    console.log('here are my playlists', this.props.playlists)
    if (this.props.loaded) {
      return (
        <div>
          <h3>Welcome, {this.props.name}</h3>
          <div id="playlists-container">
            {
              playlists.map(playlist => {
                return (
                  <div key={playlist.id} className="playlist">
                    <div className="playlist-name">{playlist.name}</div>
                    <img className="playlist-img" src={playlist.images[0].url} />
                  </div>
                )
              })
            }
          </div>
        </div>
      )
    } else {
      return (
        <div>Loading...</div>
      )
    }
  }
}

/**
 * CONTAINER
 */
const mapStateToProps = state => {
  return {
    email: state.user.email,
    name: state.user.name,
    userId: state.user.spotifyId,
    accessToken: state.user.accessToken,
    refreshToken: state.user.refreshToken,
    playlists: state.playlists.playlists,
    loaded: state.playlists.loaded
  }
}

const mapDispatchToProps = dispatch => {
  return {
    retrievePlaylists: (userId) => dispatch(getPlaylists(userId)),
    setInitialToken: (token, refreshToken) => dispatch(getAccessToken(token, refreshToken))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string,
  name: PropTypes.string,
  userId: PropTypes.string
}
