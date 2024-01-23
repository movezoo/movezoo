package com.ssfay.racing.game.domain;

import com.ssfay.racing.users.domain.Users;
import jakarta.persistence.*;

@Entity
@Table(name = "MyRacer")
public class MyRacer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "myracer_id")
    private int myracerId;

    @ManyToOne
    @JoinColumn(name = "users_id")
    private Users users;

    @ManyToOne //??? ontoone아닌가요
    @JoinColumn(name = "racer_id")
    private Racer racer;
}