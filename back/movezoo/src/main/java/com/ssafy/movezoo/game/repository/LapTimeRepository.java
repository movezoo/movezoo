package com.ssafy.movezoo.game.repository;

import com.ssafy.movezoo.game.domain.LapTime;
import com.ssafy.movezoo.game.dto.LapTimeResponseDto;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class LapTimeRepository {

    private final EntityManager em;

    public List<LapTimeResponseDto> findLapTimeList(int trackId){
        return em.createQuery("select new com.ssafy.movezoo.game.dto.LapTimeResponseDto(l.trackId,u.nickname,u.profileImgUrl,l.record) from LapTime l join User u on u.userId=l.user.userId where l.trackId=:trackId order by l.record ASC", LapTimeResponseDto.class)
                .setParameter("trackId",trackId)
                .getResultList();
    }

    //user를 찾아서 양방향 매핑 정보로 가지고 올수도있다.
//    public Optional<LapTimeResponseDto> findUserLapTime(int userId, int trackId){
//        List<LapTimeResponseDto> resultList = em.createQuery("select new com.ssafy.movezoo.game.dto.LapTimeResponseDto(l.trackId,u.nickname,u.profileImgUrl,l.record) from LapTime l join User u on u.userId where u.userId=:userId and l.trackId=:trackId", LapTimeResponseDto.class)
//                .setParameter("userId", userId)
//                .setParameter("trackId", trackId)
//                .getResultList();
//
//        return resultList.stream().findAny();
//    }

    public Optional<LapTime> findUserLapTime(int userId, int trackId){
        List<LapTime> resultList = em.createQuery("select l from LapTime l join User u on u.userId=l.user.userId where u.userId=:userId and l.trackId=:trackId", LapTime.class)
                .setParameter("userId", userId)
                .setParameter("trackId", trackId)
                .getResultList();

        return resultList.stream().findAny();
    }



}
