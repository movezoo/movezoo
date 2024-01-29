package com.ssafy.movezoo.game.domain;

import com.ssafy.movezoo.user.domain.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Objects;

@Entity
@Table(name = "MyRacer")
@Getter
@Setter
public class MyRacer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "myracer_id")
    private int myracerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "racer_id")
    private Racer racer;

    @Override
    public String toString() {
        return "MyRacer{" +
                "myracerId=" + myracerId +
                ", user=" + user.getUserId() +
                ", racer=" + racer.getRacerName() +
                '}';
    }
}