import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getTracks, getAccessToken, getPlaylistInfo } from '../store/playlists'
import Playbar from './playbar'

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
    this.state = {
      selectedTrack: '',
      isPlaying: false,
      isPaused: false,
      symbol: 'play_arrow'
    }
    this.selectTrack = this.selectTrack.bind(this)
    this.start = this.start.bind(this)
    this.toggle = this.toggle.bind(this)
    this.player = null;
  }

  componentDidMount() {
    const { accessToken, refreshToken } = this.props
    this.props.setInitialToken(accessToken, refreshToken)
    this.props.retrieveTracks(this.props.match.params.id)
    this.props.pickPlaylist(this.props.match.params.id);

    window.onSpotifyReady.then(() => {
      console.log('in player')
      const token = accessToken
      const player = new Spotify.Player({
        name: 'deci',
        getOAuthToken: cb => { cb(token); }
      });
      this.player = player;

      // Error handling
      player.addListener('initialization_error', ({ message }) => { console.error(message); });
      player.addListener('authentication_error', ({ message }) => { console.error(message); });
      player.addListener('account_error', ({ message }) => { console.error(message); });
      player.addListener('playback_error', ({ message }) => { console.error(message); });

      // Playback status updates
      player.addListener('player_state_changed', state => { console.log(state); });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      // Connect to the player!
      player.connect().then(success => {
        if (success) {
          console.log('deci is connected to spotify!')
        }
      })
    });
  }

  selectTrack(trackId) {
    this.setState({ selectedTrack: trackId })
    if (this.state.isPlaying && this.state.selectedTrack === trackId) {
      this.toggle(trackId)
    } else {
      this.start(trackId)
    }
  }

  start(songId) {
    console.log('starting song!')
    this.setState({
      isPlaying: true,
      isPaused: false,
      symbol: 'pause'
    })
    const play = ({
      spotify_uri,
      playerInstance: {
        _options: {
          getOAuthToken,
          id
        }
      }
    }) => {
      getOAuthToken(access_token => {
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
          method: 'PUT',
          body: JSON.stringify({ uris: [spotify_uri] }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
          },
        });
      });
    };

    play({
      playerInstance: this.player,
      spotify_uri: `spotify:track:${songId}`,
    });
  }

  toggle(songId) {
    console.log('toggling song!')
    if (this.state.isPaused === false) {
      const toggle = ({
        spotify_uri,
        playerInstance: {
          _options: {
            getOAuthToken,
            id
          }
        }
      }) => {
        getOAuthToken(access_token => {
          fetch(`https://api.spotify.com/v1/me/player/pause`, {
            method: 'PUT',
            body: JSON.stringify({ uris: [spotify_uri] }),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access_token}`
            },
          });
        });
      };
      toggle({
        playerInstance: new Spotify.Player({
          name: "deci",
          getOAuthToken: cb => { cb(this.props.accessToken) }
        }),
        spotify_uri: `spotify:track:${songId}`,
      });
    } else {
      const toggle = ({
        spotify_uri,
        playerInstance: {
          _options: {
            getOAuthToken,
            id
          }
        }
      }) => {
        getOAuthToken(access_token => {
          fetch(`https://api.spotify.com/v1/me/player/play`, {
            method: 'PUT',
            body: JSON.stringify({ uris: [spotify_uri] }),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access_token}`
            },
          });
        });
      };
      toggle({
        playerInstance: new Spotify.Player({
          name: "deci",
          getOAuthToken: cb => { cb(this.props.accessToken) }
        }),
        spotify_uri: `spotify:track:${songId}`,
      });
    }
    const isPaused = !this.state.isPaused
    this.setState({ isPaused })
  }

  render() {
    const tracks = this.props.tracks
    const name = this.props.playlist.name
    const symbol = this.state.isPaused ? 'play_arrow' : 'pause'
    if (this.props.loaded) {
      return (
        <div id="tracks-page">
          <div id="playlist-container">
            <h3 id="playlist-header">{name}</h3>
            <div id="track-container">
              {
                tracks.map(track => {
                  return (
                    track.track.id === this.state.selectedTrack
                      ? (
                        <li id="track-selected" className="track-row" key={track.track.id} onClick={() => this.selectTrack(track.track.id)}>
                          <div className="track-item play material-icons">{symbol}</div>
                          <div className="track-item title">{track.track.name}</div>
                          <div className="track-item artist">{track.track.artists[0].name}</div>
                          <div className="track-item album">{track.track.album.name}</div>
                          <div className="track-item time">{getTime(track.track.duration_ms)}</div>
                          <hr />
                        </li>
                      )
                      : (
                        <li className="track-row" key={track.track.id} onClick={() => this.selectTrack(track.track.id)}>
                          <div className="track-item play material-icons">play_arrow</div>
                          <div className="track-item title">{track.track.name}</div>
                          <div className="track-item artist">{track.track.artists[0].name}</div>
                          <div className="track-item album">{track.track.album.name}</div>
                          <div className="track-item time">{getTime(track.track.duration_ms)}</div>
                          <hr />
                        </li>
                      )
                  )
                })
              }
            </div>
          </div>
          {/* <Playbar /> */}
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
