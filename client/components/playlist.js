import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getTracks, getAccessToken } from '../store/playlists'

class Playlist extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log('playlist component mounted')
    console.log('playlist id in component:', this.props.match.params.id)
    this.props.retrieveTracks(this.props.match.params.id)
  }

  render() {
    const tracks = this.props.tracks
    return (
      <div>
        HELLO WORLD
        {
          tracks.map(track => {
            return (
              <div key={track.track.id}>{track.track.name}</div>
            )
          })
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    tracks: state.playlists.tracks
  }
}

const mapDispatchToProps = dispatch => {
  return {
    retrieveTracks: (id) => dispatch(getTracks(id)),
    setInitialToken: (token, refreshToken) => dispatch(getAccessToken(token, refreshToken))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Playlist)
