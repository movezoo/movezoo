package com.ssafy.movezoo.openvidu.controller;

import com.ssafy.movezoo.game.domain.Room;
import com.ssafy.movezoo.game.serivce.RedisService;
import io.openvidu.java.client.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

//@CrossOrigin(origins = "*")
//@RestController
@RequiredArgsConstructor
@Slf4j
public class OpenviduSessionController {

    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;

    private final RedisService redisService;

    //    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    //입력받은 sessionId로 세션을 생성한다.
    @PostMapping("/api/openvidu/sessions")
    public ResponseEntity<String> initializeSession(@RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
        log.info("/api/sessions");

        //SessionProperties -> openvidu세션을 생성하기 위한 속성을 정의하는 클래스
        //세션값은 내가 읨의로 부여
        SessionProperties properties = SessionProperties.fromJson(params).build();
        Session session = openvidu.createSession(properties);

        System.out.println(params);

        //생성된 세션아이디를 http로 반환, 상태코드 200 ok
        return new ResponseEntity<>(session.getSessionId(), HttpStatus.OK);
    }

    //initializeSession함수로 생성된 세션으로 연결
    @PostMapping("/api/openvidu/sessions/{sessionId}/connections")
    public ResponseEntity<String> createConnection(@PathVariable("sessionId") String sessionId,
                                                   @RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {

        log.info("/api/sessions/{} ", sessionId);

        //sessionId 사용하여 OpenVidu에서 해당 세션 get
        Session session = openvidu.getActiveSession(sessionId);

        //세션 존재하지 않으면 404 반환
        if (session == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        //프론트에서 넘어온 json데이터를 사용하여 ConnectionProperties객체생성, openvidu session에 연결할때 필요
        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();

        log.info("{}", params);


        /**
         * 방을 만들어서 접속시 이미 redis에 생성을 했으므로 sessionId로 찾기 가능
         */
        redisService.findByRoomSessionId(sessionId);

        //openvidu session에 연결생성
        Connection connection = session.createConnection(properties);
        return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
    }

    /*
    required = false -> 매개변수가 필수가 아니다(null)
    required = true -> 매개변수가 필수여야한다
     */

    //방에 접속되어 있는 유저 리스트
    @GetMapping("api/openvidu/session/{sessionId}")
    public ResponseEntity<List<String>> getSessionUsers(@PathVariable("sessionId") String sessionId, @RequestBody(required = false) Map<String, Object> params) {
        List<String> connectionUsers = new ArrayList<>();

        Session session = openvidu.getActiveSession(sessionId);
        //getActiveConnections -> 활성상태만, getConnections -> 비활성상태도 포함(미디어스트림 제공하지 않는 connection, 음소거 등)
        List<Connection> connections = session.getConnections();

        for (Connection connection : connections) {
            connectionUsers.add(connection.getConnectionId());
        }

        return new ResponseEntity<>(connectionUsers, HttpStatus.OK);
    }

    //deleteampping에서는 RequestBody를 사용할수 없다
    //유저를 방에서 내보내기(아이디를 가져와서 방장이면 방삭제)
    @DeleteMapping("api/openvidu/session")
    public ResponseEntity<String> deleteSessionUser(@RequestParam String sessionId, @RequestParam String connectionId, Authentication authentication) throws OpenViduJavaClientException, OpenViduHttpException {

//        log.info("api/openvidu/session {}", authentication.getName());
        log.info("api/openvidu/session {} {}", sessionId,connectionId);


        Optional<Room> findRoom = redisService.findByRoomSessionId(sessionId);
        if (findRoom.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("not exist room");
        }

        //방장이 나갈경우 방 삭제
        int masterId = findRoom.get().getRoomMasterId();

//        if (Integer.parseInt(authentication.getName()) == masterId) {
//            deleteSession(sessionId);
//            redisService.deleteRoom(findRoom.get().getId());
//            return ResponseEntity.status(HttpStatus.OK).body("master out");
//        }

        //방장이 아닐경우 세션에서 connectionId를 찾아서 연결 해제
        Session session = openvidu.getActiveSession(sessionId);
        if(session == null)  return ResponseEntity.status(HttpStatus.OK).body("not exist session "+sessionId);
        List<Connection> connections = session.getConnections();

//        String result = "";
        log.info("connections size {}", connections.size());
        for (Connection connection : connections) {
            log.info("{} {}", connection.getConnectionId(),connectionId);
            if (connection.getConnectionId().equals(connectionId)) {
                session.forceDisconnect(connection);
//                result= connectionId;
                break;
            }
        }

        //세션에 연결된 connection이 0명이면 session close해야한다
        return ResponseEntity.status(HttpStatus.OK).body(connectionId + " out");
    }

    //방 삭제
    public boolean deleteSession(String sessionId) throws OpenViduJavaClientException, OpenViduHttpException {
        Session session = openvidu.getActiveSession(sessionId);
        if (session == null) return false;
        session.close();

        return true;
    }

    //전체 방 리스트
    @GetMapping("api/openvidu/session/room-list")
    public ResponseEntity<List<String>> findAllSession() {
        List<String> roomList = new ArrayList<>();

        List<Session> sessions = openvidu.getActiveSessions();
        for (Session session : sessions) {
            roomList.add(session.getSessionId());
        }

        return ResponseEntity.status(HttpStatus.OK).body(roomList);
    }


    //--------------------------delete----------------------//

}