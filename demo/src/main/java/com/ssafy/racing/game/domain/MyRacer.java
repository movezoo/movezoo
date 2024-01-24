package com.ssafy.racing.game.domain;

import com.ssafy.racing.user.domain.User;
import jakarta.persistence.*;

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
}