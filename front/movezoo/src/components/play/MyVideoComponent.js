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

const UserVideoComponent = (props) => {
  const getNicknameTag = () => {
    // Gets the nickName of the user
    return JSON.parse(props.streamManager.stream.connection.data).clientData;
  };

  return (
    <div>
      {props.streamManager !== undefined ? (
        <div className="streamcomponent">
          <MyOvVideo streamManager={props.streamManager}
          mySession={props.mySession}
           />
          <div>
            <p>{getNicknameTag()}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UserVideoComponent;