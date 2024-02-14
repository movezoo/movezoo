package com.ssafy.movezoo.game.controller;

import com.ssafy.movezoo.game.dto.RoomResponseDto;
import io.openvidu.java.client.*;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import com.ssafy.movezoo.game.domain.Room;
import com.ssafy.movezoo.game.dto.CreateRoomRequestDto;
import com.ssafy.movezoo.game.dto.RoomSessionIdDto;
import com.ssafy.movezoo.game.serivce.RedisService;
import com.ssafy.movezoo.global.dto.SimpleResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@RestController
//@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api")
public class RedisController {

    private final RedisService redisService;

    private OpenVidu openvidu;

    @Autowired
    public RedisController(RedisService redisService) {
        this.redisService = redisService;
        this.openvidu = redisService.getOpenvidu();
    }

    // 방 만들기
    @PostMapping("/room")
    public ResponseEntity<RoomResponseDto> createRoom(Authentication authentication, @RequestBody CreateRoomRequestDto dto) throws OpenViduJavaClientException, OpenViduHttpException {
        log.info("make room {}", dto);
        log.info("make room master {}", dto);
        SimpleResponseDto simpleResponseDto = new SimpleResponseDto();
        simpleResponseDto.setSuccess(true);
        log.info("room make {}", authentication);
        if(authentication==null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);

        System.out.println(authentication);
        int userId = Integer.parseInt(authentication.getName());

        //랜덤아이디 생성
        String randomSessionId = makeRandomSessionId();
        dto.setRoomSessionId(randomSessionId);

        //openvidu session create start
        Map<String, Object> params = new HashMap<>();
        params.put("customSessionId", randomSessionId);

        //SessionProperties -> openvidu세션을 생성하기 위한 속성을 정의하는 클래스
        //세션값은 내가 읨의로 부여
        SessionProperties properties = SessionProperties.fromJson(params).build();
        Session session = openvidu.createSession(properties);

        log.info("room session info {}", session.getSessionId());
        //openvidu session create end

        // roomSessionId 중복 체크 필요
        if (redisService.isDuplicateRoomSessionId(dto.getRoomSessionId())) {  // 세션 아이디가 중복이라면
            System.out.println("세션 아이디가 중복입니다.");
            simpleResponseDto.setMsg("세션 아이디가 중복입니다.");
            simpleResponseDto.setSuccess(false);

            return ResponseEntity.badRequest().body(null);
        }

        try {
            if (dto.getRoomPassword() != null && !dto.getRoomPassword().isEmpty()) {     // 비밀방일 경우
                Room room = redisService.createSecretRoom(userId, dto);
                log.info("make secret room {}", room);
                simpleResponseDto.setMsg("비밀방 생성 성공");

                RoomResponseDto roomResponseDto = RoomResponseDto.builder()
                        .roomId(room.getId())
                        .roomSessionId(room.getRoomSessionId())
                        .secretRoom(room.isSecretRoom())
                        .secretRoomPassword(room.getSecretRoomPassword())
                        .roomStatus(room.isRoomStatus())
                        .trackId(room.getTrackId())
                        .roomTitle(room.getRoomTitle())
                        .roomMode(room.getRoomMode())
                        .currentUserCount(room.getCurrentUserCount())
                        .maxUserCount(room.getMaxUserCount())
                        .roomMasterId(room.getRoomMasterId())
                        .trackId(room.getTrackId())
                        .build();
                return ResponseEntity.status(HttpStatus.OK).body(roomResponseDto);
            } else {
                Room room = redisService.createRoom(userId, dto);
                RoomResponseDto roomResponseDto = RoomResponseDto.builder()
                        .roomId(room.getId())
                        .roomSessionId(room.getRoomSessionId())
                        .secretRoom(room.isSecretRoom())
                        .secretRoomPassword(room.getSecretRoomPassword())
                        .roomStatus(room.isRoomStatus())
                        .trackId(room.getTrackId())
                        .roomTitle(room.getRoomTitle())
                        .roomMode(room.getRoomMode())
                        .currentUserCount(room.getCurrentUserCount())
                        .maxUserCount(room.getMaxUserCount())
                        .roomMasterId(room.getRoomMasterId())
                        .trackId(room.getTrackId())
                        .build();
                log.info("make room {}", room);
                return ResponseEntity.status(HttpStatus.OK).body(roomResponseDto);
            }

        } catch (Exception e) {
            e.printStackTrace();
            simpleResponseDto.setMsg("방 생성 실패");
            simpleResponseDto.setSuccess(false);

            return ResponseEntity.badRequest().body(null);
        }
    }

    private String makeRandomSessionId() {
        return UUID.randomUUID().toString();
    }

    // 방 목록
    @GetMapping("/room")
    public List<Room> getRoomList() {
        List<Room> roomList = redisService.getRoomList();
        roomList.sort(new Comparator<Room>() {
            @Override
            public int compare(Room o1, Room o2) {
                return o2.getCreationDateTime().compareTo(o1.getCreationDateTime());
            }
        });

        return roomList;
    }

    @PostMapping("/room/find-sessionId")
    public ResponseEntity<RoomResponseDto> getFastEnterRoomSession(@RequestBody(required = true)Map<String,Object> params) {
        String sessionId =(String) params.get("roomSessionId");
        System.out.println("find-sessionId "+sessionId);
        Optional<Room> findRoom = redisService.findByRoomSessionId(sessionId);

        if(findRoom.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);

        Room room = findRoom.get();
        RoomResponseDto roomResponseDto = RoomResponseDto.builder()
                .roomSessionId(room.getRoomSessionId())
                .secretRoom(room.isSecretRoom())
                .roomId(room.getId())
                .roomTitle(room.getRoomTitle())
                .secretRoomPassword(room.getSecretRoomPassword())
                .roomStatus(room.isRoomStatus())
                .roomMode(room.getRoomMode())
                .roomMasterId(room.getRoomMasterId())
                .currentUserCount(room.getCurrentUserCount())
                .trackId(room.getTrackId())
                .maxUserCount(room.getMaxUserCount())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(roomResponseDto);
    }


    //빠른입장시 가장 늦게 만들어진 방 세션 반환
    // 방 목록
    @GetMapping("/room/fast-enter-room-session")
    public ResponseEntity<RoomResponseDto> getFastEnterRoomSession() {
        List<Room> roomList = redisService.getRoomList();
        roomList.sort(new Comparator<Room>() {
            @Override
            public int compare(Room o1, Room o2) {
                return o1.getCreationDateTime().compareTo(o2.getCreationDateTime());
            }
        });

        for(Room room : roomList){
            if(!room.isRoomStatus() && room.getMaxUserCount()>room.getCurrentUserCount() && room.getSecretRoomPassword()==null){

                Session session = openvidu.getActiveSession(room.getRoomSessionId());
                if(session==null || session.getConnections().isEmpty()) continue;

                RoomResponseDto roomResponseDto = RoomResponseDto.builder()
                        .roomSessionId(room.getRoomSessionId())
                        .roomId(room.getId())
                        .roomTitle(room.getRoomTitle())
                        .roomMasterId(room.getRoomMasterId())
                        .roomMode(room.getRoomMode())
                        .roomStatus(room.isRoomStatus())
                        .roomSessionId(room.getRoomSessionId())
                        .build();
                return ResponseEntity.status(HttpStatus.OK).body(roomResponseDto);
            }
        }
        return ResponseEntity.status(HttpStatus.OK).body(null);


    }

    // 방 들어가기
    @PostMapping("/room/enter")
    public ResponseEntity<String> enterRoom(@RequestBody RoomSessionIdDto dto) throws OpenViduJavaClientException, OpenViduHttpException {
        log.info("room enter info {} ", dto);
        SimpleResponseDto simpleResponseDto = new SimpleResponseDto();

        String sessionId = dto.getRoomSessionId();
        String nickname = dto.getNickname();

        //sessionId 사용하여 OpenVidu에서 해당 세션 get
        System.out.println(sessionId);
        System.out.println(nickname);
        Session session = openvidu.getActiveSession(sessionId);

        log.info("room enter {} {}",sessionId,nickname);

        //redis에도 있어야하지만, openvidu session에도 연결되어있어야한다.
        if (session == null || redisService.isPlay(sessionId)) {
            log.info("session check {}", session);
            log.info("redisService.isPlay(sessionId) {}",redisService.isPlay(sessionId));
            return ResponseEntity.status(HttpStatus.OK).body(null);
        }

        Optional<Room> roomInfoBySessionId = redisService.findByRoomSessionId(sessionId);
        if (roomInfoBySessionId.isPresent()) System.out.println(roomInfoBySessionId.get().toString());
        if (redisService.enterRoom(sessionId)) {
            //프론트에서 넘어온 json데이터를 사용하여 ConnectionProperties객체생성, openvidu session에 연결할때 필요
            Map<String, Object> params = new HashMap<>();
            params.put("nickname", nickname);
            ConnectionProperties properties = ConnectionProperties.fromJson(params).build();

            //openvidu session에 연결생성
            Connection connection = session.createConnection(properties);
            return ResponseEntity.status(HttpStatus.OK).body(connection.getToken());
        } else {
            simpleResponseDto.setSuccess(false);
            simpleResponseDto.setMsg("방 입장 실패");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PatchMapping("/room/start")
    public ResponseEntity<String> changeRoomStatus(@RequestBody(required = true) Map<String, Object> params) {
        String sessionId = (String) params.get("roomSessionId");
        redisService.changRoomStatus(sessionId);
        return ResponseEntity.status(HttpStatus.OK).body("game start");
    }

    @DeleteMapping("/room/delete/{sessionId}")
    public ResponseEntity<String> deleteRoom(@PathVariable("sessionId") String sessionId){
        log.info("delete room {}",sessionId);
        Optional<Room> findRoom = redisService.findByRoomSessionId(sessionId);
        if (findRoom.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body("not exist room");
        }

        Room room = findRoom.get();
        log.info("delete room {}", room.toString());
        redisService.deleteRoom(room.getId());
        return ResponseEntity.status(HttpStatus.OK).body("master out");
    }

    // 방 나가기 (방장 -> 방 폭파 / 방장 X -> 방 퇴장)
    @PatchMapping("/room/exit")
    public ResponseEntity<Map<String,Integer>> exitRoom(Authentication authentication, @RequestBody(required = true) Map<String, Object> params) throws OpenViduJavaClientException, OpenViduHttpException {
        String sessionId = (String) params.get("roomSessionId");
        String connectionId = (String) params.get("connectionId");
        String resultKey = "userCount";

        Map<String ,Integer> result = new HashMap<>();
        result.put(resultKey,-1);

        log.info("room exit {} {}", sessionId, connectionId);
        if(sessionId == null || connectionId == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
        SimpleResponseDto simpleResponseDto = new SimpleResponseDto();

        Optional<Room> findRoom = redisService.findByRoomSessionId(sessionId);
        if (findRoom.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }

        Room room = findRoom.get();

        //세션을 삭제하는것이 아니라 connectionId만 제외하기 위해(게임 끝나고 재화)서 세션에서 제외한다.
        // 나가려는 사용자가 방장 X -> 퇴장, 세션에서도 제외한다.(프론트에서 보이지 않아도 백엔드쪽에는 정보가 남아있다, connectionId 제거)
        redisService.exitRoom(room.getId());
        Session session = openvidu.getActiveSession(sessionId);
        if (session == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        List<Connection> connections = session.getConnections();

//        String result = "";
        log.info("session {} connections {}", session.getSessionId(),connections.size());
        for (Connection connection : connections) {
            if (connection.getConnectionId().equals(connectionId)) {
                session.forceDisconnect(connection);
                break;
            }
        }

        Optional<Room> updateRoom = redisService.findByRoomSessionId(sessionId);
        if(updateRoom.isPresent()){
            result.put(resultKey,updateRoom.get().getCurrentUserCount());
            return ResponseEntity.status(HttpStatus.OK).body(result);
        }
        //세션에 연결된 connection이 0명이면 session close해야한다 -> 방장이 나가는 경우 세션을 close한다
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }


    //openvidu session을 닫는다. 방장이 나가면 같은 세션에 있는 사용자들도 나가진다
    public boolean deleteSession(String sessionId) throws OpenViduJavaClientException, OpenViduHttpException {
        Session session = openvidu.getActiveSession(sessionId);
        if (session == null) return false;
        session.close();
        return true;
    }


    // 방 삭제
    public ResponseEntity<SimpleResponseDto> removeRoom(@RequestParam("sessionId") String roomSessionId) {
        Room room = redisService.findByRoomSessionId(roomSessionId).get();

        if (room != null) {
            redisService.deleteRoom(room.getId());
        }

        SimpleResponseDto simpleResponseDto = new SimpleResponseDto(true, "방 삭제 성공");
        return ResponseEntity.ok().body(simpleResponseDto);
    }


    // 방 제목 및 모드로 검색
    @GetMapping("/room-filter")
    public List<Room> searchByTitleAndMode(
            @RequestParam(name = "title", required = false) String roomTitle,
            @RequestParam(name = "mode", required = false) Integer roomMode) {

        System.out.println("roomMode: " + roomMode + " , roomTitle: " + roomTitle);

        List<Room> roomList = getRoomList();

        // mode 필터링
        if (roomMode != null) {
            System.out.println("Mode Filtering");
            int size = roomList.size();
            for (int i = size - 1; i >= 0; i--) {
                Room currRoom = roomList.get(i);
                if (currRoom.getRoomMode() != roomMode)
                    roomList.remove(currRoom);
            }
        }

//        System.out.println("--------------------------Mode Filter--------------------------");
//        for (Room room : roomList){
//            System.out.println(room.toString()+ "    ");
//        }

        // title 필터링
        if (roomTitle != null) {
            System.out.println("Title Filtering");
            int size = roomList.size();
            for (int i = size - 1; i >= 0; i--) {
                Room currRoom = roomList.get(i);
                if (!currRoom.getRoomTitle().equals(roomTitle))
                    roomList.remove(currRoom);
            }
        }
//        System.out.println("--------------------------Title Filter--------------------------");
//        for (Room room : roomList){
//            System.out.println(room.toString()+ "    ");
//        }

        return roomList;
    }

    public ResponseEntity<SimpleResponseDto> deleteAllRoom() {
        redisService.deleteAllRoom();

        SimpleResponseDto simpleResponseDto = new SimpleResponseDto();
        simpleResponseDto.setSuccess(true);
        simpleResponseDto.setMsg("all room delete");
        return ResponseEntity.status(HttpStatus.OK).body(simpleResponseDto);
    }


    // -------------------------TEST delete-------------------------//

/*    openvidu session List확인
    @GetMapping("openvidu/session/room-list")
    public ResponseEntity<List<String>> findAllSession() {
        List<String> roomList = new ArrayList<>();

        List<Session> sessions = openvidu.getActiveSessions();
        for (Session session : sessions) {
            roomList.add(session.getSessionId());
        }

        return ResponseEntity.status(HttpStatus.OK).body(roomList);
    }

    //openvidu session connection확인
    @GetMapping("openvidu/session/{sessionId}")
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

    //redis room List 확익
    //@GetMapping("/room")

    //redis room currentUser 확인
    @GetMapping("room/redis/{roomSessionId}")
    public ResponseEntity<Integer> getRoomCurrentUser(@PathVariable("roomSessionId") String roomSessionId){
        Optional<Room> findRoom = redisService.getRoomInfoBySessionId(roomSessionId);
        if(findRoom.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(0);
        return ResponseEntity.status(HttpStatus.OK).body(findRoom.get().getCurrentUserCount());
    }*/


}
