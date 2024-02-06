package com.ssafy.movezoo.game.repository;

import com.ssafy.movezoo.game.domain.MyRacer;
import com.ssafy.movezoo.game.domain.Racer;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class RacerRepository {
    private final EntityManager em;

    public Racer save(Racer racer){
        em.persist(racer);
        return racer;
    }
    public Racer findById(Integer racerId){
        return em.find(Racer.class, racerId);
    }

    public List<Racer> findAllRacer(){
        return em.createQuery("select r from Racer r",Racer.class).getResultList();
    }

}
