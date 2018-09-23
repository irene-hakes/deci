import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getTracks, getAccessToken, getPlaylistInfo } from '../store/playlists'

const Playbar = (props) => {
  // const songNotPlaying = props.selectedSong.id === undefined;
  const songNotPlaying = false
  return (
    <div id='player-container'>
      <div id={songNotPlaying ? '' : 'player-controls'} className={songNotPlaying ? 'hidden' : ''}>
        <div className='row center'>
          <img id='back-button' src="/back.png" />
          <img id='play-pause' onClick={() => props.start(props.selectedSong)} src="/play.png" />
          <img id='forward-button' src="/forward.png" />
        </div>
      </div>
    </div>
  )
}

export default Playbar
