package com.ssafy.racing.game.domain;

import com.ssfay.racing.users.domain.Users;
import jakarta.persistence.*;

@Entity
@Table(name = "Racer")
public class Racer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "racer_id")
    private int racerId;

    @Column(name = "racer_name")
    private String racerName;

    @Column(name = "racer_price")
    private int racerPrice;
}


