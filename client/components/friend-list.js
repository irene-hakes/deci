import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getFriends, getAccessToken, selectFriend } from '../store/playlists'

class FriendList extends Component {

  componentDidMount() {
    const { accessToken, refreshToken } = this.props
    this.props.setInitialToken(accessToken, refreshToken)
    this.props.retrieveFriends()
  }

  render() {
    let visibility = 'hide'
    const friends = this.props.friends
    let open = 'close-button'
    if (this.props.menuVisibility) {
      visibility = 'show'
      open = 'open-button'
    }
    if (this.props.loaded) {
      return (
        <div id="friend-list"
          // onMouseDown={this.props.handleMouseDown}
          className={visibility}
        >
          <button id={open} onClick={this.props.handleMouseDown}>&#9664;</button>
          <h4>My Friends</h4>
          <div id="friends-container">
            {
              friends.map(friend => {
                return (
                  <Link to={`/user/${friend.spotifyId}`} key={friend.spotifyId} onClick={() => {
                    this.props.pickFriend(friend)
                    this.props.handleMouseDown()
                  }}>
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
        <div id="playlist-header">Loading...</div>
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
  pickFriend: friend => dispatch(selectFriend(friend))
})

export default connect(mapStateToProps, mapDispatchToProps)(FriendList)
