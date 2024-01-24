package com.ssafy.racing.game.domain;

import com.ssafy.racing.user.domain.User;
import jakarta.persistence.*;

@Entity
@Table(
        name = "LapTime",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"user_id", "track_id"}
                )
        }
)
public class LapTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "laptime_id")
    private int laptimeId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "track_id")
    private String trackId;

    @Column(name = "laptime")
    private Double laptime;
}
