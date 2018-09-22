import React, { Component } from 'react'

export default class FriendButton extends Component {
  render() {
    return (
      <button type="button" id="friend-button" className="btn btn-outline-dark" onMouseDown={this.props.handleMouseDown}>Friends</button>
    )
  }
}
