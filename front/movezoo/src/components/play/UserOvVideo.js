// import React, { Component } from "react";
import { useEffect, useRef } from "react";

// export default class OpenViduVideoComponent extends Component {
//   constructor(props) {
//     super(props);
//     // 비디오 엘리먼트를 보관할 ref 생성
//     this.videoRef = React.createRef();
//   }

//   componentDidUpdate(prevProps) {
//     // 컴포넌트 프롭스와 비디오 ref의 존재 여부 확인
//     if (prevProps && !!this.videoRef) {
//       // 프롭스가 업데이트될 때 비디오 엘리먼트를 StreamManager에 추가
//       this.props.streamManager.addVideoElement(this.videoRef.current);
//     }
//   }

//   componentDidMount() {
//     // 컴포넌트 프롭스와 비디오 ref의 존재 여부 확인
//     if (this.props && !!this.videoRef) {
//       // 초기 렌더링 시에 비디오 엘리먼트를 StreamManager에 추가
//       this.props.streamManager.addVideoElement(this.videoRef.current);
//     }
//   }

//   render() {
//     return <video autoPlay={true} ref={this.videoRef} />;
//   }
// }
const UserOvVideo = (props) => {
  // Create a ref to store the video element
  const { streamManager } = props;
  const videoRef = useRef();

  useEffect(() => {
    // Check for existence of component props and video ref
    if (!!videoRef.current) {
      // Add video element to StreamManager during initial rendering
      streamManager.addVideoElement(videoRef.current);
    }

    // No need for a clean-up function in this case

  }, [streamManager]); // Dependency array ensures useEffect runs when streamManager changes

  return <video autoPlay={true} ref={videoRef} style={{ transform: 'scaleX(-1)' }}/>;
};

export default UserOvVideo;