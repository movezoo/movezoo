package com.ssafy.racing.game.domain;

import com.ssafy.racing.user.domain.User;
import jakarta.persistence.*;

import java.util.Objects;

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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof LapTime lapTime)) return false;
        return laptimeId == lapTime.laptimeId && Objects.equals(user, lapTime.user) && Objects.equals(trackId, lapTime.trackId) && Objects.equals(laptime, lapTime.laptime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(laptimeId, user, trackId, laptime);
    }
}
