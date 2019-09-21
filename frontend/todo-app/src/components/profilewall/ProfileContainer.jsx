import React, { Component } from "react";
import rmitlogo from "../../img/rmit-logo.png";
import judo from "../../img/judo.jpg";
import updateinfobtn from "../../img/setting.svg"
import msgbtn from "../../img/message.svg"
import notificationbtn from "../../img/notification.svg"
import "./profile.scss";
import AuthenticationService from "../todo/AuthenticationService";
import AccountProfileService from "../../api/todo/AccountProfileService";

class ProfileContainer extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      username: this.props.username,
      firstname: '',
      lastname: '',
      avatarlink: '',
      backgroundlink: ''
    }

  }
  componentDidMount() {
    console.warn("componentDidMount CC");
    this.refreshInfo();
    console.log(this.state);
  }

  refreshInfo() {
    let username = AuthenticationService.getLoggedInUserName();

    AccountProfileService.retrieveDetails(username)
      .then(response => {

        this.setState({
          username: username,
          firstname: response.data.firstname,
          lastname: response.data.lastname,


        });
      })
    AccountProfileService.getAvatarLink(username)
      .then(response => {
        this.setState({
          avatarlink: response.data
        })
      })

    AccountProfileService.getBackgroundLink(username)
      .then(response => {
        this.setState({
          backgroundlink: response.data
        })
      })

  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="ui-block">
              <div className="top-header-thumb">
                <img className="banner" src={this.state.backgroundlink}></img>
              </div>
              <div className="profile-section">
                <div className="row">
                  <div className="col1">
                    <ul className="profile-menu">
                      <li className="list-item">
                        <a>Timeline</a>
                      </li>
                      <li className="list-item">
                        <a>About</a>
                      </li>
                      <li className="list-item">
                        <a>Friends</a>
                      </li>
                    </ul>
                  </div>
                  <div className="avatar-container">
                    <div className="image-cropper">
                      <img
                        src={this.state.avatarlink}
                        className="profile-pic"
                        alt="avatar"
                      ></img>
                    </div>
                    <div className="avatar-author-content">{this.state.firstname} {this.state.lastname}</div>
                  </div>
                  <div className="col2">
                    <ul className="profile-menu">
                      <li className="list-item">
                        <a>Photos</a>
                      </li>
                      <li className="list-item">
                        <a>Videos</a>
                      </li>
                      <li className="list-item">
                        <div className="more">...</div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="control-block-button">
                  <button className="control-button"><img src={updateinfobtn}></img></button>
                  <button className="control-button"><img src={msgbtn}></img></button>
                  <button className="control-button"><img src={notificationbtn}></img></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileContainer;
