package com.ssfay.racing.game.domain;

import com.ssfay.racing.users.domain.Users;
import jakarta.persistence.*;

@Entity
@Table(
        name = "LapTime",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"users_id", "track_id"}
                )
        }
)
public class LapTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "laptime_id")
    private int laptimeId;

    @ManyToOne
    @JoinColumn(name = "users_id")
    private Users users;

    @Column(name = "track_id")
    private String trackId;

    @Column(name = "laptime")
    private Double laptime;
}
