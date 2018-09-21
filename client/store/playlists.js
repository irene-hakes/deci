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

const gotAccessToken = (token, refreshToken) => ({ type: GET_ACCESS_TOKEN, token, refreshToken })
const gotPlaylists = playlists => ({ type: GET_PLAYLISTS, playlists })

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
    const playlists = await spotifyApi.getUserPlaylists(userId)
    console.log('PLAYLISTS IN THUNK', playlists)
    dispatch(gotPlaylists(playlists.body.items))
  } catch (error) {
    console.error(error)
  }
}

const initialState = {
  accessToken: '',
  refreshToken: '',
  playlists: [],
  loaded: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ACCESS_TOKEN:
      return { ...state, accessToken: action.token, refreshToken: action.refreshToken }
    case GET_PLAYLISTS:
      return { ...state, playlists: [...action.playlists], loaded: true }
    default:
      return state
  }
}
