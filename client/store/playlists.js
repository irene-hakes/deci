import axios from 'axios'
import history from '../history'
import SpotifyWebApi from 'spotify-web-api-node'

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_CLIENT_REDIRECT_URI
})


const GET_ACCESS_TOKEN = 'GET_ACCESS_TOKEN'
const GET_PLAYLISTS = 'GET_PLAYLISTS'
const SELECT_PLAYLIST = 'SELECT_PLAYLIST'
const GET_TRACKS = 'GET_TRACKS'

const gotAccessToken = (token, refreshToken) => ({ type: GET_ACCESS_TOKEN, token, refreshToken })
const gotPlaylists = playlists => ({ type: GET_PLAYLISTS, playlists })
const gotTracks = (tracks) => ({ type: GET_TRACKS, tracks })
export const selectPlaylist = (selectedPlaylist) => ({ type: SELECT_PLAYLIST, selectedPlaylist })

//------THUNKS------
export const getAccessToken = (token, refreshToken) => dispatch => {
  try {
    spotifyApi.setAccessToken(token)
    spotifyApi.setRefreshToken(refreshToken)
    dispatch(gotAccessToken(token, refreshToken))
  } catch (error) {
    console.error(error)
  }
}

export const getPlaylists = userId => async dispatch => {
  try {
    const response = await spotifyApi.getUserPlaylists(userId)
    const playlists = response.body.items
    dispatch(gotPlaylists(playlists))
  } catch (error) {
    console.error(error)
  }
}

export const getTracks = id => async dispatch => {
  try {
    const response = await spotifyApi.getPlaylist(id)
    const tracks = response.body.tracks.items
    console.log('tracks in thunk:', tracks)
    dispatch(gotTracks(tracks))
  } catch (error) {
    console.error(error)
  }
}

//------REDUCER------
const initialState = {
  accessToken: '',
  refreshToken: '',
  playlists: [],
  tracks: [],
  selectedPlaylist: {},
  loaded: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ACCESS_TOKEN:
      return { ...state, accessToken: action.token, refreshToken: action.refreshToken }
    case GET_PLAYLISTS:
      return { ...state, playlists: [...action.playlists], loaded: true }
    case GET_TRACKS:
      return { ...state, tracks: [...action.tracks] }
    case SELECT_PLAYLIST:
      return { ...state, selectedPlaylist: { ...action.selectedPlaylist } }
    default:
      return state
  }
}
