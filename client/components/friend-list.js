import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getFriends, getAccessToken } from '../store/playlists'

class FriendList extends Component {
  render() {
    let visibility = 'hide'
    if (this.props.menuVisibility) {
      visibility = 'show'
    }
    return (
      <div id="friend-list"
        onMouseDown={this.props.handleMouseDown}
        className={visibility}
      >
        <div>Hello World</div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  // friends: state.user.friends,
  accessToken: state.user.accessToken,
  refreshToken: state.user.refreshToken,
})

const mapDispatchToProps = dispatch => ({
  retrieveFriends: () => dispatch(getFriends())
})

export default connect(mapStateToProps, mapDispatchToProps)(FriendList)
