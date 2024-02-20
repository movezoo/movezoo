// import React, { Component } from "react";
// import MyOpenViduVideoComponent from "./MyOvVideo";
// import "./UserVideo.css";

// export default class UserVideoComponent extends Component {
//   getNicknameTag() {
//     // Gets the nickName of the user
//     return JSON.parse(this.props.streamManager.stream.connection.data)
//       .clientData;
//   }

//   render() {
//     return (
//       <div>
//         {this.props.streamManager !== undefined ? (
//           <div className="streamcomponent">
//             <MyOpenViduVideoComponent streamManager={this.props.streamManager}/>
//             <div>
//               <p>{this.getNicknameTag()}</p>
//             </div>
//           </div>
//         ) : null}
//       </div>
//     );
//   }
// }




import MyOvVideo from "./MyOvVideo";
import "./UserVideo.css";

const MyVideoComponent = (props) => {
  const getNicknameTag = () => {
    // Gets the nickName of the user
    return JSON.parse(props.streamManager.stream.connection.data).clientData;
  };

  const { streamManager, mySession, isPlayingGame } = props
  return (
    <div>
      {streamManager !== undefined ? (
        <div className="streamcomponent">
          <MyOvVideo
            streamManager={streamManager}
            mySession={mySession}
            isPlayingGame={isPlayingGame}
          />
          <div>
            <p style={{ textAlign: "center" }}>{getNicknameTag()}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MyVideoComponent;