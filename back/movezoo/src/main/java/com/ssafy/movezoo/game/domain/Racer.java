package com.ssafy.movezoo.game.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

@Entity
@Getter
@Setter
@Table(name = "Racer")
public class Racer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "racer_id")
    private int racerId;

    @Column(name = "racer_name", unique = true)
    private String racerName;

    @Column(name = "racer_price")
    private int racerPrice;
    protected Racer(){

    }
    public Racer(String racerName, int racerPrice){
        this.racerName = racerName;
        this.racerPrice =racerPrice;
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Racer racer)) return false;
        return getRacerId() == racer.getRacerId() && getRacerPrice() == racer.getRacerPrice() && Objects.equals(getRacerName(), racer.getRacerName());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getRacerId(), getRacerName(), getRacerPrice());
    }

    @Override
    public String toString() {
        return "Racer{" +
                "racerId=" + racerId +
                ", racerName='" + racerName + '\'' +
                ", racerPrice=" + racerPrice +
                '}';
    }
}


