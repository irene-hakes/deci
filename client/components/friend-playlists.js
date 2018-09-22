import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Link, withRouter } from 'react-router-dom'
import { getPlaylists, getAccessToken, selectPlaylist } from '../store/playlists'
import { Playlist } from './playlist'

/**
 * COMPONENT
 */

class FriendPlaylists extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { accessToken, refreshToken } = this.props
    const spotifyId = this.props.match.params.id
    this.props.setInitialToken(accessToken, refreshToken)
    this.props.retrievePlaylists(spotifyId)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.friendId !== this.props.friendId) {
      const spotifyId = this.props.match.params.id
      this.props.retrievePlaylists(spotifyId)
    }
  }

  render() {
    // const playlists = this.props.playlists
    const friend = this.props.friend
    if (this.props.loaded) {
      return (
        <div>
          <h3 id="playlist-header">{`${friend.name}'s Playlists`}</h3>
          <div id="playlists-container">
            {
              this.props.playlists.map(playlist => {
                return (
                  <div key={playlist.id} className="playlist">
                    <Link to={`/playlist/${playlist.id}`} onClick={() => this.props.pickPlaylist(playlist)}>
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
    accessToken: state.user.accessToken,
    refreshToken: state.user.refreshToken,
    playlists: state.playlists.playlists,
    loaded: state.playlists.loaded,
    friend: state.playlists.selectedFriend,
    friendId: state.playlists.selectedFriend.spotifyId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    retrievePlaylists: (userId) => dispatch(getPlaylists(userId)),
    setInitialToken: (token, refreshToken) => dispatch(getAccessToken(token, refreshToken)),
    pickPlaylist: (playlist) => dispatch(selectPlaylist(playlist))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FriendPlaylists))

