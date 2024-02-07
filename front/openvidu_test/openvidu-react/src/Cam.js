import { OpenVidu } from "openvidu-browser";

import axios from "axios";
import React, { Component } from "react";
import "./Cam.css";
import UserVideoComponent from "./UserVideoComponent";

const APPLICATION_SERVER_URL =
  // process.env.NODE_ENV === "production" ? "" : "https://demos.openvidu.io/";
  // process.env.NODE_ENV === "production" ? "" : "https://i10e204.p.ssafy.io/";
  process.env.NODE_ENV === "production" ? "" : "http://localhost:5000/";

class Cam extends Component {
  constructor(props) {
    super(props);

    // These properties are in the state's component in order to re-render the HTML whenever their values change
    this.state = {
      mySessionId: "SessionA",
      myUserName: "Participant" + Math.floor(Math.random() * 100),
      connectionId: '',
      session: undefined,
      mainStreamManager: undefined, // Main video of the page. Will be the 'publisher' or one of the 'subscribers'
      publisher: undefined,
      subscribers: [],
      videoEnabled: false,
      audioEnabled: false,
      chatMessage: "", // 채팅 메시지를 저장할 변수
      chatMessages: [], // 채팅 메시지를 저장할 배열
    };

    this.enterRoom = this.enterRoom.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.switchCamera = this.switchCamera.bind(this);
    this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);
    this.toggleAudio = this.toggleAudio.bind(this); // 바인딩 추가
    this.toggleVideo = this.toggleVideo.bind(this);
    this.handleChangeChatMessage = this.handleChangeChatMessage.bind(this);
    this.sendChatMessage = this.sendChatMessage.bind(this);
  }

  componentDidMount() {
    // window.addEventListener("beforeunload", this.handleBeforeUnload);
    window.addEventListener("beforeunload", this.onbeforeunload);
  }


  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
  }

  handleBeforeUnload(event) {
    // Prevent the default behavior (showing the confirmation dialog)
    event.preventDefault();
    // Chrome requires returnValue to be set
    event.returnValue = '';
  }

  onbeforeunload(event) {
    this.leaveSession();
  }


  handleChangeSessionId(e) {
    this.setState({
      mySessionId: e.target.value,
    });
  }

  handleChangeUserName(e) {
    this.setState({
      myUserName: e.target.value,
    });
  }

  handleMainVideoStream(stream) {
    if (this.state.mainStreamManager !== stream) {
      this.setState({
        mainStreamManager: stream,
      });
    }
  }

  deleteSubscriber(streamManager) {
    let subscribers = this.state.subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      this.setState({
        subscribers: subscribers,
      });
    }
  }

  //리스트를 클릭하든, 방을 만들던 백에서 만든 sessionId를 사용한다.
  //enterRoom(sessionId)
  enterRoom() {
    // --- 1) Get an OpenVidu object ---

    this.OV = new OpenVidu();

    // --- 2) Init a session ---

    this.setState(
      {
        session: this.OV.initSession(),
      },
      () => {
        var mySession = this.state.session;

        // --- 3) Specify the actions when events take place in the session ---

        // On every new Stream received...
        mySession.on("streamCreated", (event) => {
          // Subscribe to the Stream to receive it. Second parameter is undefined
          // so OpenVidu doesn't create an HTML video by its own
          var subscriber = mySession.subscribe(event.stream, undefined);
          var subscribers = this.state.subscribers;
          subscribers.push(subscriber);

          // Update the state with the new subscribers
          this.setState({
            subscribers: subscribers,
          });
        });

        // On every Stream destroyed...
        mySession.on("streamDestroyed", (event) => {
          // Remove the stream from 'subscribers' array
          this.deleteSubscriber(event.stream.streamManager);
        });

        // On every asynchronous exception...
        mySession.on("exception", (exception) => {
          console.warn(exception);
        });

        // --- 4) Connect to the session with a valid user token ---


        //채팅을 위한 setting
        mySession.on('signal:my-chat', (event) => {

          console.log();

          const { chatMessages } = this.state;
          const userName = JSON.parse(event.from.data).clientData;
          const newMessage = {
            id: event.from.connectionId, // 보낸 사람의 아이디
            name: userName,
            message: event.data, // 채팅 메시지 내용
          };

          // 기존 채팅 메시지 배열에 새로운 메시지 추가
          const updatedMessages = [...chatMessages, newMessage];

          console.log(updatedMessages);
          // 상태 업데이트
          this.setState({ chatMessages: updatedMessages });
        });

        // Get a token from the OpenVidu deployment
        //getToken(sessionId)
        this.getToken().then((token) => {
          // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
          // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname

          //redis에 방 만들기


          mySession
            .connect(token, { clientData: this.state.myUserName })
            .then(async () => {
              // --- 5) Get your own camera stream ---

              this.setState({ connectionId: mySession.connection.connectionId });

              // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
              // element: we will manage it on our own) and with the desired properties
              let publisher = await this.OV.initPublisherAsync(undefined, {
                audioSource: undefined, // The source of audio. If undefined default microphone
                videoSource: undefined, // The source of video. If undefined default webcam
                publishAudio: false, // Whether you want to start publishing with your audio unmuted or not
                publishVideo: false, // Whether you want to start publishing with your video enabled or not
                resolution: "640x480", // The resolution of your video
                frameRate: 30, // The frame rate of your video
                insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
                mirror: true, // Whether to mirror your local video or not
              });

              // --- 6) Publish your stream ---

              mySession.publish(publisher);

              // Obtain the current video device in use
              var devices = await this.OV.getDevices();
              var videoDevices = devices.filter(
                (device) => device.kind === "videoinput"
              );
              var currentVideoDeviceId = publisher.stream
                .getMediaStream()
                .getVideoTracks()[0]
                .getSettings().deviceId;
              var currentVideoDevice = videoDevices.find(
                (device) => device.deviceId === currentVideoDeviceId
              );

              // Set the main video in the page to display our webcam and store our Publisher
              this.setState({
                currentVideoDevice: currentVideoDevice,
                mainStreamManager: publisher,
                publisher: publisher,
              });
            })
            .catch((error) => {
              console.log(
                "There was an error connecting to the session:",
                error.code,
                error.message
              );
            });
        });
      }
    );
  }


  // 채팅 메시지 업데이트
  handleChangeChatMessage(event) {
    this.setState({ chatMessage: event.target.value });
  }


  // 채팅 메시지 함수
  sendChatMessage() {
    const { session, chatMessage } = this.state;
    if (session && chatMessage.trim() !== "") {
      session.signal({
        data: chatMessage,
        to: [],
        type: "my-chat",
      }).then(() => {
        console.log("Message successfully sent");

        // 채팅 메시지를 보낸 후 텍스트 상자 비우기
        this.setState({ chatMessage: "" });
      }).catch(error => {
        console.error(error);
      });
    }
  }

  //브라우저자체를 닫으면 이게 실행안되서 오류발생
  async leaveSession() {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---


    const response = await axios.patch(
      APPLICATION_SERVER_URL + "api/exit",
      {
        "roomSessionId": this.state.mySessionId,
        "connectionId": this.state.connectionId
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const mySession = this.state.session;

    if (mySession) {
      mySession.disconnect();
    }

    // Empty all properties...
    this.OV = null;
    this.setState({
      session: undefined,
      subscribers: [],
      mySessionId: "SessionA",
      myUserName: "Participant" + Math.floor(Math.random() * 100),
      mainStreamManager: undefined,
      publisher: undefined,
    });


  }

  async switchCamera() {
    try {
      const devices = await this.OV.getDevices();
      var videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      if (videoDevices && videoDevices.length > 1) {
        var newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== this.state.currentVideoDevice.deviceId
        );

        if (newVideoDevice.length > 0) {
          // Creating a new publisher with specific videoSource
          // In mobile devices the default and first camera is the front one
          var newPublisher = this.OV.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          //newPublisher.once("accessAllowed", () => {
          await this.state.session.unpublish(this.state.mainStreamManager);

          await this.state.session.publish(newPublisher);
          this.setState({
            currentVideoDevice: newVideoDevice[0],
            mainStreamManager: newPublisher,
            publisher: newPublisher,
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  // 음소거기능
  toggleAudio() {
    const { publisher } = this.state;
    if (publisher) {
      const audioEnabled = !this.state.audioEnabled;
      publisher.publishAudio(audioEnabled);
      this.setState({ audioEnabled });
    }
  }

  async toggleVideo() {
    const { publisher } = this.state;
    if (publisher) {
      const videoEnabled = !this.state.videoEnabled;
      publisher.publishVideo(videoEnabled);
      this.setState({ videoEnabled });
    }
  }



  render() {
    const mySessionId = this.state.mySessionId;
    const myUserName = this.state.myUserName;

    return (
      <div className="container">
        {this.state.session === undefined ? (
          <div id="join">
            <div id="img-div">
              <img
                src="resources/images/openvidu_grey_bg_transp_cropped.png"
                alt="OpenVidu logo"
              />
            </div>
            <div id="join-dialog" className="jumbotron vertical-center">
              <h1> Join a video session </h1>
              <form className="form-group" onSubmit={this.enterRoom}>
                <p>
                  <label>Participant: </label>
                  <input
                    className="form-control"
                    type="text"
                    id="userName"
                    value={myUserName}
                    onChange={this.handleChangeUserName}
                    required
                  />
                </p>
                <p>
                  <label> Session: </label>
                  <input
                    className="form-control"
                    type="text"
                    id="sessionId"
                    value={mySessionId}
                    onChange={this.handleChangeSessionId}
                    required
                  />
                </p>
                <p className="text-center">
                  <input
                    className="btn btn-lg btn-success"
                    name="commit"
                    type="submit"
                    value="JOIN"
                  />
                </p>
              </form>
            </div>


          </div>
        ) : null}

        {this.state.session !== undefined ? (
          <div id="session">
            <div id="session-header">
              <h1 id="session-title">{mySessionId}</h1>
              <input
                className="btn btn-large btn-danger"
                type="button"
                id="buttonLeaveSession"
                onClick={this.leaveSession}
                value="Leave session"
              />
              <input
                className="btn btn-large btn-success"
                type="button"
                id="buttonSwitchCamera"
                onClick={this.switchCamera}
                value="Switch Camera"
              />
            </div>

            {this.state.mainStreamManager !== undefined ? (
              <div id="main-video" className="col-md-6">
                <UserVideoComponent
                  streamManager={this.state.mainStreamManager}
                />

                {/* 음소거 버튼 추가 */}
                <input
                  className="btn btn-large btn-primary"
                  type="button"
                  id="buttonToggleAudio"
                  onClick={this.toggleAudio}
                  value={this.state.audioEnabled ? 'Mute Audio' : 'Unmute Audio'}
                />
                {/* 음소거 버튼 추가 */}

                {/* 카메라 on off 추가 */}
                <input
                  className="btn btn-large btn-warning"
                  type="button"
                  id="buttonToggleVideo"
                  onClick={this.toggleVideo}
                  value={this.state.videoEnabled ? 'Turn Video Off' : 'Turn Video On'}
                />
                {/* 카메라 on off 추가 */}
                <div className="col-md-6">
                  <ul className="chat-container">
                    {this.state.chatMessages.map((message, index) => (
                      <li key={index} className={message.id === this.state.connectionId ? "chat-message-right" : "chat-message-left"}>
                        {message.name} : {message.message}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type your message..."
                    value={this.state.chatMessage}
                    onChange={this.handleChangeChatMessage}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={this.sendChatMessage}
                    >
                      Send
                    </button>
                  </div>
                </div>

                {/* 공통 채팅 보여주는  */}

              </div>

            ) : null}
            <div id="video-container" className="col-md-6">
              {this.state.publisher !== undefined ? (
                <div
                  className="stream-container col-md-6 col-xs-6"
                  onClick={() =>
                    this.handleMainVideoStream(this.state.publisher)
                  }
                >
                  <UserVideoComponent streamManager={this.state.publisher} />
                </div>
              ) : null}
              {this.state.subscribers.map((sub, i) => (
                <div
                  key={sub.id}
                  className="stream-container col-md-6 col-xs-6"
                  onClick={() => this.handleMainVideoStream(sub)}
                >
                  <span>{sub.id}</span>
                  <UserVideoComponent streamManager={sub} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  /**
   * --------------------------------------------
   * GETTING A TOKEN FROM YOUR APPLICATION SERVER
   * --------------------------------------------
   * The methods below request the creation of a Session and a Token to
   * your application server. This keeps your OpenVidu deployment secure.
   *
   * In this sample code, there is no user control at all. Anybody could
   * access your application server endpoints! In a real production
   * environment, your application server must identify the user to allow
   * access to the endpoints.
   *
   * Visit https://docs.openvidu.io/en/stable/application-server to learn
   * more about the integration of OpenVidu in your application server.
   */
  //async getToken(sessionId)
  async getToken() {
    const sessionId = await this.createSession(this.state.mySessionId);
    //만약 방 생성이면 세션을 만들고 createroom하기
    return await this.createToken(sessionId);
  }

  //세션을 만들고 입장만 하지않는것, createRoom과 동일 근데!!! customSessionId만 set가능하니까 redis에 들어갈 방정보는 따로 관리하는 함수를 작성해야한다
  async createSession(sessionId) {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "api/room",
      { customSessionId: sessionId },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("create session ", response.data.roomSessionId);
    return response.data.roomSessionId; // The sessionId
  }

  async createToken(sessionId) {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "api/room/enter",
      {
        "roomSessionId": sessionId,
        "nickname": this.state.myUserName
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("create Token ", response.data);
    return response.data; // The token
  }
}

export default Cam;
