import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getPlaylists, getAccessToken } from '../store/playlists'

/**
 * COMPONENT
 */

class UserHome extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log('PROPS ACTION TOKEN', this.props.accessToken)
    const { accessToken, refreshToken } = this.props
    console.log('pulled out from props', accessToken)
    this.props.setInitialToken(accessToken, refreshToken)
    this.props.retrievePlaylists(this.props.userId)
  }

  render() {
    const playlists = this.props.playlists
    console.log('here are my playlists', this.props.playlists)
    return (
      <div>
        <h3>Welcome, {this.props.name}</h3>
        <div>{playlists.items}</div>
      </div>
    )
  }
}

// const UserHome = props => {
//   const { name, accessToken, playlists, userId } = props
//   // const test = props.retrievePlaylists(userId)

//   return (
//     <div>
//       <h3>Welcome, {accessToken}</h3>
//       <div>{playlists.items}</div>
//     </div>
//   )
// }

/**
 * CONTAINER
 */
const mapStateToProps = state => {
  return {
    email: state.user.email,
    name: state.user.name,
    userId: state.user.spotifyId,
    accessToken: state.user.accessToken,
    refreshToken: state.user.refreshToken,
    playlists: state.playlists.playlists
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
