package com.ssafy.movezoo.game.repository;

import com.ssafy.movezoo.game.domain.MyRacer;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class MyRacerRepository {
    private final EntityManager em;

    public MyRacer findById(Integer racerId){
        return em.find(MyRacer.class, racerId);
    }

    public Optional<MyRacer> findByUserIdAndRacerId(Integer userId, Integer racerId){
        List<MyRacer> resultList = em.createQuery("select mr from MyRacer mr where mr.user.userId=:userId and mr.racer.racerId=:racerId",MyRacer.class)
                .setParameter("userId", userId)
                .setParameter("racerId", racerId)
                .getResultList();

        return resultList.stream().findAny();

    }

    public List<MyRacer> findMyAllMyRacer(Integer userId){
        return em.createQuery("select mr from MyRacer mr where mr.user.userId=:userId", MyRacer.class)
                .setParameter("userId",userId)
                .getResultList();
    }
}
