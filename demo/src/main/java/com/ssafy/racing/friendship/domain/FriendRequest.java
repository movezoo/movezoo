package com.ssafy.racing.friendship.domain;

import com.ssafy.racing.user.domain.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;



@Entity
@Getter
@Setter
public class FriendRequest {

    @Id
    @GeneratedValue
    @Column(name = "friend_request_id")
    private int friendRequestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_user_id")
    private User fromUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_user_id")
    private User toUser;

    public FriendRequest(User fromUser, User toUser) {
        this.fromUser = fromUser;
        this.toUser = toUser;
    }

    public FriendRequest() {

    }
}
