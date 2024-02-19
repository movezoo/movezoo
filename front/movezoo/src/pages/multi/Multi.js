import RoomList from "./roomlist/RoomList";
import Room from "./room/Room";
import Game from "./game/Game";
import Result from "./result/Result";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import { useRecoilState } from 'recoil';
import { toast } from 'react-toastify';
import { myGameData, gameStartData, playerGameDataList } from "../../components/play/data.js";

import { isMultiGameStartState, playGameModeState } from '../../components/state/gameState.js'

function Multi() {
  
  const APPLICATION_SERVER_URL =
    process.env.NODE_ENV === "production" ? "" : "https://i10e204.p.ssafy.io/";

  const storedUserData = localStorage.getItem('userData');
  const data = (JSON.parse(storedUserData));

  gameStartData.mode = 'multi'
  gameStartData.selectMap = data.selectedMapName;
  gameStartData.selectCharacter = data.selectedCharacterName;
  myGameData.playerCharacter = data.selectedCharacterName;
  
  // 게임시작관리(props로 념겨줌)
  const [isPlayingGame, setIsPlayingGame] = useState(false);
  const [mySessionId, setMySessionId] = useState(null);
  const [myUserName, setMyUserName] = useState(data.userData.nickname);
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  
  const [page, setPage] = useState(1);  
  
  //창희 추가 start  
  const [connectionId, setConnectionId] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [myRoom, setMyRoom] = useState({});
  const navigate = useNavigate();
  //창희 추가 end
  
  const [isMultiGameStart, setIsMultiGameStart] = useRecoilState(isMultiGameStartState);
  const [playGameMode, setPlayGameMode] = useRecoilState(playGameModeState);
  setPlayGameMode('multi');

  let OV, currentVideoDevice;
  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     event.preventDefault();
  //     event.returnValue = "";
  //     console.log("exiting test", mySessionId, connectionId);
  //     console.log("Exiting page");
  //     leaveSession();
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, [mySessionId, connectionId]);



  // const handleChangeSessionId = e => { setMySessionId(e.target.value); }
  // const handleChangeUserName = e => { setMyUserName(e.target.value); }
  // const handleMainVideoStream = stream => {
  //   if(mainStreamManager !== stream) setMainStreamManager(stream);
  // }

  const deleteSubscriber = streamManager => {
    setSubscribers(prevSubscribers => {
      // streamManager를 사용하여 삭제할 구독자를 찾아서 제외합니다.
      const updatedSubscribers = prevSubscribers.filter(
        (subscriber) => subscriber.stream.streamManager !== streamManager
      );
      return updatedSubscribers;
    });
  }





















  // 방생성 : 방장
  const createRoom = async (roomInfo) => {
    // var roomInfo = {
    //   roomMode: roomMode,
    //   roomTitle: roomTitle,
    //   roomPassword: secretRoomPassword,
    //   maxRange: maxUserCount,
    //   trackId: mapSelect,
    // }
    OV = new OpenVidu();
    OV.enableProdMode(); // log 출력제거

    const newSession = OV.initSession();
    setSession(newSession);

    newSession.on("streamCreated", event => {
      const subscriber = newSession.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });
    newSession.on('connectionDestroyed', (event) => {
      console.log(`connection: ${event.connection}`);
      console.log(event.connection);
    });

    newSession.on("streamDestroyed", event => {
      deleteSubscriber(event.stream.streamManager);
    });

    //창희 추가 start//
    newSession.on("exception", exception => {
      console.warn(exception);
    });

    // 채팅 수신
    newSession.on("signal:my-chat", event => {
      const userName = JSON.parse(event.from.data).clientData;
      const newMessage = {
        id: event.from.connectionId, // 보낸 사람의 아이디
        name: userName,
        message: event.data, // 채팅 메시지 내용
      }
      setChatMessages((chatMessages) => [...chatMessages, newMessage]);
      // this.setState({ chatMessages: updatedMessages });
    });

    newSession.on("signal:master-out", () => {
      console.log("방장입니다. 난 함수 실행 안해요", data.userData.userId);
      // changeSession();
      // 상태 업데이트
      setMyRoom({});
    });

    // 게임시작 수신
    newSession.on("signal:game-start", () => {
      // console.log("game start : ", data.userData.userId);
      // console.log("start start session Id", mySessionId);
      // roomGameStart(mySessionId);
      setPage(3);
    });

    // 모든사람의 게임로딩 상태를 받기
    newSession.on("signal:game-load-success", event => {
      playerGameDataList.forEach(userId => {
        
      })
    })

    //창희 추가 end//

    try {
      const token = await getToken(roomInfo);
      newSession
        .connect(token, { clientData: myUserName })
        .then(async () => {
          setConnectionId(newSession.connection.connectionId);
          const newPublisher = await OV.initPublisherAsync(undefined, {
            audioSource:  undefined, videoSource:  undefined,
            publishAudio: true,      publishVideo: true,
            resolution:   "280x210", frameRate:    30, // 원래: 640x480
            insertMode:   "APPEND",  mirror:       false,
          });

          newSession.publish(newPublisher);
          const devices = await OV.getDevices();
          const videoDevices = devices.filter( device => device.kind === "videoinput" );
          const currentVideoDeviceId = newPublisher.stream
            .getMediaStream()
            .getVideoTracks()[0]
            .getSettings().deviceId;
          currentVideoDevice = videoDevices.find( device => device.deviceId === currentVideoDeviceId );

          setMainStreamManager(newPublisher);
          setPublisher(newPublisher);

          myGameData.playerId = myUserName;
          setPlayGameMode('multi'); // 모드 멀티로 설정
          myGameData.mode='multi'
          let existMyData = false;
          playerGameDataList.forEach((item) => { // 배열에 내아이디가 있는지 확인한다.
            if (item === myGameData.playerId) existMyData = true;
          });
          if (!existMyData) playerGameDataList.push(myGameData); // 배열에 내 데이터가 없다면 추가한다.

          setIsPlayingGame(true);
          console.log(`joinsession : playerId init!!!!!!!! <${myGameData.playerId}>`);
        })
        .catch((error) => {
          console.log(
            "세션에 연결 중 오류가 발생했습니다:",
            error.code,
            error.message
          );
        });
    } catch (error) {
      console.error("Error joining session:", error);
    }
  };

















  // 방입장
  const enterRoom = async (enterSessionId) => {
    OV = new OpenVidu();
    OV.enableProdMode();

    const newSession = OV.initSession();
    setSession(newSession);

    newSession.on("streamCreated", event => {
      const subscriber = newSession.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });

    newSession.on('connectionDestroyed', (event) => {
      console.log(`connection: ${event.connection}`);
      console.log(event.connection);
    });

    newSession.on("streamDestroyed", event => {
      deleteSubscriber(event.stream.streamManager);
    });

    //창희 추가 start//
    newSession.on("exception", exception => {
      console.warn(exception);
    });

    // 채팅 수신
    newSession.on("signal:my-chat", event => {
      const userName = JSON.parse(event.from.data).clientData;
      const newMessage = {
        id: event.from.connectionId, // 보낸 사람의 아이디
        name: userName,
        message: event.data, // 채팅 메시지 내용
      };
      setChatMessages((chatMessages) => [...chatMessages, newMessage]);
      // this.setState({ chatMessages: updatedMessages });
    });

    newSession.on("signal:master-out", () => {
      console.log("방장이 나감 ", data.userData.userId);
      console.log("현재 세션 ", session);
      console.log("현재 세션 ", newSession);
      alert("방장이 방을 삭제했습니다.")
      // changeSession();
      if (newSession) newSession.disconnect();
      
      setIsPlayingGame(false);
      setSession(undefined);
      setSubscribers([]);
      setMySessionId(null);
      setMyUserName(data.userData.nickname);
      setMainStreamManager(undefined);
      setPublisher(undefined);
      console.log("leave session complete!!!");
      navigate("/main");
      // 상태 업데이트
      setMyRoom({});
    });

    // 게임시작 수신
    newSession.on("signal:game-start", () => {
      console.log("game start : ", data.userData.userId);
      
      // roomGameStart(mySessionId);
      // console.log(`mySessionId: ${mySessionId}`);
      
      setPage(3);
    });
    //창희 추가 end//

    try {
      const token = await createToken(enterSessionId);
      newSession
        .connect(token, { clientData: myUserName })
        .then(async () => {
          setConnectionId(newSession.connection.connectionId);
          const newPublisher = await OV.initPublisherAsync(undefined, {
            audioSource:  undefined, videoSource:  undefined,
            publishAudio: true,      publishVideo: true,
            resolution:   "280x210", frameRate:    30, // 원래: 640x480
            insertMode:   "APPEND",  mirror:       false,
          });

          newSession.publish(newPublisher);
          const devices = await OV.getDevices();
          const videoDevices = devices.filter( device => device.kind === "videoinput" );
          const currentVideoDeviceId = newPublisher.stream
            .getMediaStream()
            .getVideoTracks()[0]
            .getSettings().deviceId;
          currentVideoDevice = videoDevices.find( device => device.deviceId === currentVideoDeviceId );

          setMainStreamManager(newPublisher);
          setPublisher(newPublisher);

          myGameData.playerId = myUserName;
          setPlayGameMode('multi'); // 모드 멀티로 설정
          myGameData.mode='multi'
          let existMyData = false;
          playerGameDataList.forEach((item) => { // 배열에 내아이디가 있는지 확인한다.
            if (item === myGameData.playerId) existMyData = true;
          });
          if (!existMyData) playerGameDataList.push(myGameData); // 배열에 내 데이터가 없다면 추가한다.

          setIsPlayingGame(true);
          console.log( `joinsession : playerId init!!!!!!!! <${myGameData.playerId}>`);

          // //발급받은 토큰으로 연결 완료 되면 sessionId set
          // setMySessionId(enterSessionId);
          setPage(2);
        })
        .catch((error) => {
          console.log(
            "세션에 연결 중 오류가 발생했습니다:",
            error.code,
            error.message
          );
          alert("방 입장에 문제가 생겼습니다. \n방 목록을 갱신 해주세요!")
        });
    } catch (error) {
      console.error("Error joining session:", error);
      alert("방 입장에 문제가 생겼습니다. \n방 목록을 갱신 해주세요!")
    }
  };










  const exitRoom = async () => {
    await axios.patch(
      APPLICATION_SERVER_URL + "api/room/exit",
      {
        roomSessionId: mySessionId,
        connectionId: connectionId,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  };

  const deleteRoom = async () => {
    console.log("delete room", APPLICATION_SERVER_URL + `api/room/delete/${mySessionId}`);
    await axios.delete(
      APPLICATION_SERVER_URL + `api/room/delete/${mySessionId}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  };

  const leaveSession = async () => {
    //1.mySessionId로 룸을 들고온다
    const masterId = myRoom.roomMasterId;


    console.log("Exit ", mySessionId, masterId, data.userData.userId);

    //방장일 경우
    //signal을 보내 모든 유저의 세션을 닫도록한다. 또한 redis에서 방을 삭제한다

    //문제!!!! 방장이 아닌애들ㅇ alert이 안나온다
    //마스터구별을 어떻게 하는지 모르겟다
    if (masterId === data.userData.userId) {
      console.log("out? ", connectionId);

      await deleteRoom();

      //시그널
      if (session) {
        session
          .signal({
            type: "master-out",
          })
          .then(() => {
            console.log("master out signal sned");
            // if (mainStreamManager) {
            //   mainStreamManager.stream.disposeWebRtcPeer();
            // }
            // if (publisher) {
            //   publisher.stream.disposeWebRtcPeer();
            // }
          })
          .catch((error) => {
            console.error(error);
          });
        changeSession();
        toast.error("방이 삭제되었습니다.");
      }

    } else {
      await exitRoom();
      changeSession()
      toast.error("방에서 나갑니다.");
    }
  };

  const changeSession = async () => {
    if (session) {
      await session.disconnect();
    }
    setIsPlayingGame(false);
    setSession(undefined);
    setSubscribers([]);
    setMySessionId(null);
    setMyUserName(data.userData.nickname);
    setMainStreamManager(undefined);
    setPublisher(undefined);
    console.log("leave session complete!!!");
    navigate("/main");
  }

  // const switchCamera = async () => {
  //   try {
  //     const devices = await OV.getDevices();
  //     const videoDevices = devices.filter(
  //       (device) => device.kind === "videoinput"
  //     );

  //     if (videoDevices && videoDevices.length > 1) {
  //       const newVideoDevice = videoDevices.filter(
  //         (device) => device.deviceId !== currentVideoDevice.deviceId
  //       );

  //       if (newVideoDevice.length > 0) {
  //         const newPublisher = OV.initPublisher(undefined, {
  //           videoSource: newVideoDevice[0].deviceId,
  //           publishAudio: true,
  //           publishVideo: true,
  //           mirror: true,
  //         });

  //         await session.unpublish(mainStreamManager);
  //         await session.publish(newPublisher);

  //         setMainStreamManager(newPublisher);
  //         setPublisher(newPublisher);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error switching camera:", error);
  //   }
  // };

  const getToken = async (roomInfo) => {
    const sessionId = await createSession(roomInfo);
    return await createToken(sessionId);
  };

  //방 만들기(사용자가 입력한 방정보를 넣는다, 세션아이디는 서버에서 만들어 반환)
  const createSession = async (roomInfo) => {
    console.log(roomInfo)

    
    try {
      const response = await axios.post(
        APPLICATION_SERVER_URL + "api/room",
        {
          roomMode: roomInfo.roomMode,
          roomTitle: roomInfo.roomTitle,
          roomPassword: roomInfo.roomPassword,
          maxRange: roomInfo.maxRange,
          trackId: roomInfo.trackId,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("make room ", response.data);
      return response.data.roomSessionId;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  };

  //방 입장을 위한 토큰 발급받기(백에서 발급된 세션아이디로 join)
  const createToken = async (sessionId) => {
    console.log("createToken ", sessionId, myUserName);
    try {
      const response = await axios.post(
        APPLICATION_SERVER_URL + "api/room/enter",
        {
          roomSessionId: sessionId,
          nickname: myUserName,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const roomInfo = await axios.post(
        APPLICATION_SERVER_URL + "api/room/find-sessionId",
        {
          roomSessionId: sessionId,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // console.log("roomInfo ", roomInfo.data)
      if(roomInfo.data.roomStatus === true) return;

      setMyRoom(roomInfo.data);
      setMySessionId(roomInfo.data.roomSessionId);

      return response.data;
    } catch (error) {
      console.error("Error creating token:", error);
      throw error;
    }
  };

  // useEffect(() => {
  //   joinSession();
  //   console.log(mainStreamManager);
  //   console.log(session);
  //   // console.log(`mySessionId: ${mySessionId}`)
  // }, [mySessionId]);

  const func = (sessionId) => {
    console.log(`sessionId: ${sessionId}`);
    setMySessionId(sessionId);
    setMyUserName(data.userData.nickname);
    setMainStreamManager(mainStreamManager);
    setSubscribers(subscribers);
    setPublisher(publisher);
  };

  return (
    <div>
      {page === 1 ?
        <RoomList
          setPage={setPage}
          func={func}
          createRoom={createRoom}
          enterRoom={enterRoom}
          mySessionId={mySessionId}
        /> : null}
      {page === 2 ? (
        <Room
          setPage={setPage}
          session={session}
          myRoom={myRoom}
          mainStreamManager={mainStreamManager}
          subscribers={subscribers}
          setSubscribers={setSubscribers}
          publisher={publisher}
          mySessionId={mySessionId}
          connectionId={connectionId}
          chatMessage={chatMessage}
          setChatMessage={setChatMessage}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          leaveSession={leaveSession}
        />
      ) : null}
      {page === 3 ? (
        <Game
          setPage={setPage}
          session={session}
          mainStreamManager={mainStreamManager}
          subscribers={subscribers}
          publisher={publisher}
          mySessionId={mySessionId}
          isPlayingGame={isPlayingGame}
          leaveSession={leaveSession}
        />
      ) : null}
      {page === 4 ? (
        <Result
          setPage={setPage}
          session={session}
          myRoom={myRoom}
          mainStreamManager={mainStreamManager}
          subscribers={subscribers}
          setSubscribers={setSubscribers}
          publisher={publisher}
          mySessionId={mySessionId}
          connectionId={connectionId}
          chatMessage={chatMessage}
          setChatMessage={setChatMessage}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          leaveSession={leaveSession}
        />
      ) : null}
    </div>
  );
}

export default Multi;
