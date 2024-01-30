package com.ssafy.movezoo.game.domain;


import com.ssafy.movezoo.user.domain.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

@Entity
@Getter
@Setter
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
    @Column(name = "lapTime_id")
    private int lapTimeId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "track_id")
    private int trackId;

    @Column(name = "record")
    private Double record;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof LapTime lapTime)) return false;
        return lapTimeId == lapTime.lapTimeId && trackId == lapTime.trackId && Objects.equals(user, lapTime.user) && Objects.equals(record, lapTime.record);
    }

    @Override
    public int hashCode() {
        return Objects.hash(lapTimeId, user, trackId, record);
    }

    @Override
    public String toString() {
        return "LapTime{" +
                "lapTimeId=" + lapTimeId +
                ", user=" + user.getUserId() +
                ", trackId=" + trackId +
                ", record=" + record +
                '}';
    }
}
