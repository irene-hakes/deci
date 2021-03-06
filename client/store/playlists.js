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
const SELECT_FRIEND = 'SELECT_FRIEND'
const CURRENT_PLAYLIST = 'CURRENT_PLAYLIST'

const gotAccessToken = (token, refreshToken) => ({ type: GET_ACCESS_TOKEN, token, refreshToken })
const gotPlaylists = playlists => ({ type: GET_PLAYLISTS, playlists })
const gotTracks = (tracks) => ({ type: GET_TRACKS, tracks })
export const selectPlaylist = (selectedPlaylist) => ({ type: SELECT_PLAYLIST, selectedPlaylist })
const gotFriends = (friends) => ({ type: GET_FRIENDS, friends })
export const selectFriend = (selectedFriend) => ({ type: SELECT_FRIEND, selectedFriend })
const gotCurrentPlaylist = (playlistId) => ({ type: CURRENT_PLAYLIST, playlistId })

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

export const getPlaylistInfo = (id) => async dispatch => {
  try {
    const response = await spotifyApi.getPlaylist(id)
    const playlist = response.body
    dispatch(selectPlaylist(playlist))
  } catch (error) {
    console.error(error)
  }
}

export const getFriendInfo = (spotifyId) => async dispatch => {
  try {
    const response = await axios.get(`/api/friends/${spotifyId}`)
    const friend = response.data
    dispatch(selectFriend(friend))
  } catch (error) {
    console.error(error)
  }
}

export const getCurrentPlaylist = (spotifyId) => async dispatch => {
  try {
    const response = await spotifyApi.getUser(spotifyId)
    console.log('getting user', response)
    dispatch(gotCurrentPlaylist(response))
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
  selectedFriend: {},
  loaded: false,
  loadedFriends: false,
  loadedTracks: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ACCESS_TOKEN:
      return { ...state, accessToken: action.token, refreshToken: action.refreshToken }
    case GET_PLAYLISTS:
      return { ...state, playlists: [...action.playlists], loaded: true }
    case GET_TRACKS:
      return { ...state, tracks: [...action.tracks], loadedTracks: true }
    case SELECT_PLAYLIST:
      return { ...state, selectedPlaylist: { ...action.selectedPlaylist } }
    case GET_FRIENDS:
      return { ...state, friends: [...action.friends], loadedFriends: true }
    case SELECT_FRIEND:
      return { ...state, selectedFriend: { ...action.selectedFriend } }
    default:
      return state
  }
}
