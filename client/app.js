import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Navbar, FriendList } from './components'
import { withRouter } from 'react-router-dom'
import Routes from './routes'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
    this.toggleMenu = this.toggleMenu.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
  }

  toggleMenu() {
    this.setState({ visible: !this.state.visible })
  }

  handleMouseDown(evt) {
    this.toggleMenu()
    console.log('clicked!')
    evt.stopPropagation()
  }

  render() {
    return (
      <div>
        <Navbar handleMouseDown={this.handleMouseDown} />
        {
          this.props.isLoggedIn && (
            <FriendList handleMouseDown={this.handleMouseDown} menuVisibility={this.state.visible} />
          )
        }
        <Routes />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isLoggedIn: !!state.user.id
})

export default withRouter(connect(mapStateToProps)(App))
