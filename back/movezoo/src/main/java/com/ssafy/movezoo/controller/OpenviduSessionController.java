package com.ssafy.movezoo.controller;

import io.openvidu.java.client.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
public class OpenviduSessionController {

    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    /**
     * @param params The Session properties
     * @return The Session ID
     */
    @PostMapping("/api/sessions")
    public ResponseEntity<String> initializeSession(@RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
        System.out.println("/api/sessions");

        //SessionProperties -> openvidu세션을 생성하기 위한 속성을 정의하는 클래스
        SessionProperties properties = SessionProperties.fromJson(params).build();
        Session session = openvidu.createSession(properties);

        //생성된 세션아이디를 http로 반환, 상태코드 200 ok
        return new ResponseEntity<>(session.getSessionId(), HttpStatus.OK);
    }

    /**
     * @param sessionId The Session in which to create the Connection
     * @param params    The Connection properties
     * @return The Token associated to the Connection
     */
    @PostMapping("/api/sessions/{sessionId}/connections")
    public ResponseEntity<String> createConnection(@PathVariable("sessionId") String sessionId,
                                                   @RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
        System.out.println("/api/sessions/"+" "+sessionId);


        //sessionId 사용하여 OpenVidu에서 해당 세션 get
        Session session = openvidu.getActiveSession(sessionId);

        //세션 존재하지 않으면 404 반환
        if (session == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        //프론트에서 넘어온 json데이터를 사용하여 ConnectionProperties객체생성, openvidu session에 연결할때 필요
        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();

        //openvidu session에 연결생성
        Connection connection = session.createConnection(properties);
        return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
    }

    /*
    required = false -> 매개변수가 필수가 아니다(null)
    required = true -> 매개변수가 필수여야한다
     */
    @GetMapping("api/session/{sessionId}/connections")
    public ResponseEntity<List<String>> getSessionUsers(@PathVariable("sessionId") String sessionId, @RequestBody(required = false) Map<String, Object> params){
        List<String> connectionUsers = new ArrayList<>();

        Session session = openvidu.getActiveSession(sessionId);
        //getActiveConnections -> 활성상태만, getConnections -> 비활성상태도 포함(미디어스트림 제공하지 않는 connection, 음소거 등)
        List<Connection> connections = session.getActiveConnections();

        for(Connection connection : connections){
            connectionUsers.add(connection.getConnectionId());
        }

        return new ResponseEntity<>(connectionUsers, HttpStatus.OK);
    }

}