package com.ssafy.movezoo.game.serivce;

import com.ssafy.movezoo.game.domain.Room;
import com.ssafy.movezoo.game.dto.CreateRoomRequestDto;
import com.ssafy.movezoo.game.repository.RedisRepository;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.Session;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RedisService {

    private final RedisRepository redisRepository;

    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    public OpenVidu getOpenvidu() {
        return openvidu;
    }

    //    private final int LIMIT_TIME=3*60;  //3분

    @Scheduled(fixedRate = 6000L)
    public void updateOpenViduSession(){
        try {
            openvidu.fetch();
        } catch (Exception e) {
            log.error(e.toString());
        }
//        log.info("openvidu session cleaning...");
        List<Room> roomList = getRoomList();
        for (Room room : roomList) {
            String sessionId = room.getRoomSessionId();
            // 해당 세션ID로 유효한 세션이 없으면 방 제거
            Session session = openvidu.getActiveSession(sessionId);

            if (session == null) {
//                log.info("starvation session close {}",sessionId);
                deleteRoom(room.getId());
            }
        }
//        log.info("openvidu session clean complete");
    }

    // 방 만들기
    public Room createRoom(int userId, CreateRoomRequestDto dto) {
        Room room = new Room(userId, dto.getRoomSessionId(), dto.getRoomTitle(), dto.getRoomMode(), dto.getMaxRange(), dto.getTrackId());
        return redisRepository.save(room);
    }

    public Room createSecretRoom(int userId, CreateRoomRequestDto dto) {
        Room room = new Room(userId, dto.getRoomSessionId(), dto.getRoomTitle(), dto.getRoomMode(), dto.getMaxRange(), dto.getRoomPassword(), dto.getTrackId());
        return redisRepository.save(room);
    }

    // 방 정보 가져오기
    public Optional<Room> findByRoomSessionId(String roomSessionId){
        return redisRepository.findRoomByRoomSessionId(roomSessionId);
    }
//    public Optional<Room> findByRoomSessionId(String roomSessionId) {
//        ValueOperations<String, Room> ops = redisTemplate.opsForValue();
//        return Optional.ofNullable(ops.get(roomSessionId));
//    }

    // 전체 방 목록 가져오기
    public List<Room> getRoomList() {
        return redisRepository.findAll();
    }

    public boolean isPlay(String roomSessionId){
        Optional<Room> findRoom = redisRepository.findRoomByRoomSessionId(roomSessionId);
        return findRoom.map(Room::isRoomStatus).orElse(false);
    }

    public void changRoomStatus(String roomSessionId){
        Optional<Room> findRoom = redisRepository.findRoomByRoomSessionId(roomSessionId);
        if(findRoom.isPresent()){
            Room room = findRoom.get();
            room.setRoomStatus(true);
            redisRepository.save(room);
        }
    }


    // 방 입장 (현재 방 참가 인원 +1)
    public boolean enterRoom(String roomSessionId) {

        Optional<Room> roomByRoomSessionId = redisRepository.findRoomByRoomSessionId(roomSessionId);

        if(roomByRoomSessionId.isEmpty()){
            return false;
        }

        Room room = roomByRoomSessionId.get();


        log.info("enter room {}", room.toString());


        try {
            int maxUser = room.getMaxUserCount();
            int currUser = room.getCurrentUserCount();

            if (currUser < maxUser){    // 입장 가능한 방이라면 입장
                room.setCurrentUserCount(currUser + 1);
                redisRepository.save(room);
                return true;
            }
        } catch (Exception e) {
            log.error("enterRoom error",e);
        }

        return false;
    }

    // 방 나가기
    public boolean exitRoom(Long roomId) {
        // id로 방 정보 가져오기
        Optional<Room> roomById = redisRepository.findById(roomId);

        if(roomById.isEmpty()){
            return false;
        }
        Room room = roomById.get();
        try {
            int currUser = room.getCurrentUserCount();
            room.setCurrentUserCount(currUser - 1);
            redisRepository.save(room);

            return true;
        } catch (Exception e) {
            log.error("exit room error",e);
        }
        return false;
    }

    // 방 삭제
    public void deleteRoom(Long roomId) {
        redisRepository.deleteById(roomId);
    }

    // 방 중복체크
    public boolean isDuplicateRoomSessionId(String roomSessionId){
        return redisRepository.existsByRoomSessionId(roomSessionId);
    }

    public void deleteAllRoom(){
        redisRepository.deleteAll();
    }

}
