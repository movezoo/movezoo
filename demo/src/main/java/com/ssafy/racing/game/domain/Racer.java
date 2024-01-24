package com.ssafy.racing.game.domain;

import jakarta.persistence.*;

import java.util.Objects;

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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Racer racer)) return false;
        return racerId == racer.racerId && racerPrice == racer.racerPrice && Objects.equals(racerName, racer.racerName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(racerId, racerName, racerPrice);
    }
}


