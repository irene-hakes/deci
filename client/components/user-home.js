import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Link } from 'react-router-dom'
import { getPlaylists, getAccessToken } from '../store/playlists'
import { Playlist } from './playlist'

/**
 * COMPONENT
 */

class UserHome extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { accessToken, refreshToken } = this.props
    this.props.setInitialToken(accessToken, refreshToken)
    this.props.retrievePlaylists(this.props.userId)
  }

  render() {
    const playlists = this.props.playlists
    const name = this.props.name ? this.props.name : this.props.spotifyId
    console.log('playlist id:', playlists[0])
    if (this.props.loaded) {
      return (
        <div>
          <h3>Welcome, {name}</h3>
          <div id="playlists-container">
            {
              playlists.map(playlist => {
                return (
                  <div key={playlist.id} className="playlist">
                    <Link to={`/playlist/${playlist.id}`}>
                      <div className="playlist-name">{playlist.name}</div>
                      <img className="playlist-img" src={playlist.images[0].url} />
                    </Link>
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
    spotifyId: state.user.spotifyId,
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
