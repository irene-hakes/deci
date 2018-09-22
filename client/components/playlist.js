import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getTracks, getAccessToken, getPlaylistInfo } from '../store/playlists'

const getTime = (ms) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = ((ms % 60000) / 1000).toFixed(0)
  if (seconds < 10) {
    return `${minutes}:0${seconds}`
  } else {
    return `${minutes}:${seconds}`
  }
}

class Playlist extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { accessToken, refreshToken } = this.props
    this.props.setInitialToken(accessToken, refreshToken)
    this.props.retrieveTracks(this.props.match.params.id)
    this.props.pickPlaylist(this.props.match.params.id)
  }

  render() {
    const tracks = this.props.tracks
    const name = this.props.playlist.name
    console.log(this.props)
    if (this.props.loaded) {
      return (
        <div id="playlist-container">
          <h3 id="playlist-header">{name}</h3>
          <div id="track-container">
            {
              tracks.map(track => {
                return (
                  <li className="track-row" key={track.track.id}>
                    <div className="track-item play">Play</div>
                    <div className="track-item title">{track.track.name}</div>
                    <div className="track-item artist">{track.track.artists[0].name}</div>
                    <div className="track-item album">{track.track.album.name}</div>
                    <div className="track-item time">{getTime(track.track.duration_ms)}</div>
                    <hr />
                  </li>
                )
              })
            }
          </div>
        </div>
      )
    } else {
      return (
        <div id="playlist-header">Loading...</div>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    playlist: state.playlists.selectedPlaylist,
    tracks: state.playlists.tracks,
    accessToken: state.user.accessToken,
    refreshToken: state.user.refreshToken,
    loaded: state.playlists.loadedTracks
  }
}

const mapDispatchToProps = dispatch => {
  return {
    retrieveTracks: (id) => dispatch(getTracks(id)),
    setInitialToken: (token, refreshToken) => dispatch(getAccessToken(token, refreshToken)),
    pickPlaylist: (id) => dispatch(getPlaylistInfo(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Playlist)
