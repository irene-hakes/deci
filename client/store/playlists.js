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
const GET_FRIENDS = 'GET_FRIENDS'

const gotAccessToken = (token, refreshToken) => ({ type: GET_ACCESS_TOKEN, token, refreshToken })
const gotPlaylists = playlists => ({ type: GET_PLAYLISTS, playlists })
const gotTracks = (tracks) => ({ type: GET_TRACKS, tracks })
export const selectPlaylist = (selectedPlaylist) => ({ type: SELECT_PLAYLIST, selectedPlaylist })
const gotFriends = (friends) => ({ type: GET_FRIENDS, friends })

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

export const getFriends = () => async dispatch => {
  try {
    const response = await axios.get('/api/friends')
    const friends = response.data
    dispatch(gotFriends(friends))
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
  friends: [],
  loaded: false,
  loadedFriends: false
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
    case GET_FRIENDS:
      return { ...state, friends: [...action.friends], loadedFriends: true }
    default:
      return state
  }
}
