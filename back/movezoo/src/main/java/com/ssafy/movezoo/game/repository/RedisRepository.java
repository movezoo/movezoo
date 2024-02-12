package com.ssafy.movezoo.game.repository;

import com.ssafy.movezoo.game.domain.Room;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface RedisRepository extends CrudRepository<Room, Long> {
    @Override
    Room save(Room room);

    @Override
    List<Room> findAll();

    @Override
    Optional<Room> findById(Long roomId);



    Optional<Room> findRoomByRoomSessionId(String roomSessionId);

//    List<Room> findByRoomTitleAndRoomMode(String roomTitle, int roomMode);


    @Override
    boolean existsById(Long roomId);

    boolean existsByRoomSessionId(String roomSessionId);

    @Override
    void deleteById(Long roomId);

    @Override
    void deleteAll();
}
