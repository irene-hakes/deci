import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getFriends, getAccessToken } from '../store/playlists'

class FriendList extends Component {

  componentDidMount() {
    const { accessToken, refreshToken } = this.props
    this.props.setInitialToken(accessToken, refreshToken)
    this.props.retrieveFriends()
  }

  render() {
    let visibility = 'hide'
    const friends = this.props.friends
    if (this.props.menuVisibility) {
      visibility = 'show'
    }
    if (this.props.loaded) {
      return (
        <div id="friend-list"
          // onMouseDown={this.props.handleMouseDown}
          className={visibility}
        >
          <button id="close-button" className="btn btn-outline-dark" type="button" onClick={this.props.handleMouseDown}>&#9664;</button>
          <div id="friends-container">
            {
              friends.map(friend => {
                return (
                  <Link to={`/user/${friend.spotifyId}`} key={friend.id}>
                    <li className="friend" key={friend.spotifyId}>{friend.name}</li>
                  </Link>
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

const mapStateToProps = (state) => ({
  accessToken: state.user.accessToken,
  refreshToken: state.user.refreshToken,
  loaded: state.playlists.loadedFriends,
  friends: state.playlists.friends
})

const mapDispatchToProps = dispatch => ({
  retrieveFriends: () => dispatch(getFriends()),
  setInitialToken: (token, refreshToken) => dispatch(getAccessToken(token, refreshToken)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FriendList)
