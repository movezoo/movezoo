package com.ssafy.movezoo.game.domain;

import com.ssafy.movezoo.user.domain.User;
import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "MyRacer")
public class MyRacer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "myracer_id")
    private int myracerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "racer_id")
    private Racer racer;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MyRacer myRacer)) return false;
        return myracerId == myRacer.myracerId && Objects.equals(user, myRacer.user) && Objects.equals(racer, myRacer.racer);
    }

    @Override
    public int hashCode() {
        return Objects.hash(myracerId, user, racer);
    }
}