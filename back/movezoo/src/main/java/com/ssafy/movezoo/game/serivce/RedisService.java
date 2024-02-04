package com.ssafy.movezoo.game.serivce;

import com.ssafy.movezoo.game.domain.Room;
import com.ssafy.movezoo.game.dto.CreateRoomRequestDto;
import com.ssafy.movezoo.game.repository.RedisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RedisService {

    private final RedisRepository redisRepository;

//    private final int LIMIT_TIME=3*60;  //3분

    // 방 만들기
    public void createRoom(int userId, CreateRoomRequestDto dto) {
        Room room = new Room(userId, dto.getRoomSessionId(), dto.getRoomTitle(), dto.getRoomMode(), dto.getMaxRange());
        redisRepository.save(room);
    }

    public void createSecretRoom(int userId, CreateRoomRequestDto dto) {
        Room room = new Room(userId, dto.getRoomSessionId(), dto.getRoomTitle(), dto.getRoomMode(), dto.getMaxRange(), dto.getRoomPassword());
        redisRepository.save(room);
    }

    // 방 정보 가져오기
    public Optional<Room> getRoomInfoBySessionId(String roomSessionId){
        return redisRepository.findByRoomSessionId(roomSessionId);
    }

    // 전체 방 목록 가져오기
    public List<Room> getRoomList() {
        return redisRepository.findAll();
    }

    // 방 입장 (현재 방 참가 인원 +1)
    public boolean enterRoom(String roomSessionId) {
//        Optional<Room> optionalRoom = redisRepository.findById(roomId);
//        Room room = optionalRoom.get();
        Room room = redisRepository.findByRoomSessionId(roomSessionId).get();

        try {
            int maxUser = room.getMaxUserCount();
            int currUser = room.getCurrentUserCount();

            if (currUser < maxUser){    // 입장 가능한 방이라면 입장
                room.setCurrentUserCount(currUser + 1);
                redisRepository.save(room);
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }

    // 방 나가기
    public boolean exitRoom(Long roomId) {
        // id로 방 정보 가져오기
        Room room= redisRepository.findById(roomId).get();

        try {
            int currUser = room.getCurrentUserCount();
            room.setCurrentUserCount(currUser - 1);
            redisRepository.save(room);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
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

//    // 방 모드로 검색
//    public List<Room> searchByRoomMode(int roomMode){
//        return redisRepository.findAllByRoomMode(roomMode);
//    }
//
//    // 방 제목 검색
//    public List<Room> searchByRoomTitle(String roomTitle){
//        return redisRepository.findAllByRoomTitle(roomTitle);
//    }
//
//    // 방 모드 필터링 & 방 제목 검색
//    public List<Room> searchByRoomTitleAndRoomMode(String roomTitle, int roomMode){
//        System.out.println(roomTitle + " && "+ roomMode);
//
//        return redisRepository.findByRoomTitleAndRoomMode(roomTitle, roomMode);
//    }

}
