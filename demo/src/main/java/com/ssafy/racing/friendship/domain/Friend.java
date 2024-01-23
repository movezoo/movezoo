package com.ssafy.racing.friendship.domain;

import com.ssafy.racing.users.domain.Users;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
public class Friend {

    @Id
    @GeneratedValue
    private int friendId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Users users;

    @ManyToOne( fetch = FetchType.LAZY)
    @JoinColumn(name = "friend_user_id")
    private Users friendUsers;

    public Friend(Users users, Users friendUsers) {
        this.users = users;
        this.friendUsers = friendUsers;
    }
}

