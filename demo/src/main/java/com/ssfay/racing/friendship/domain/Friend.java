package com.ssfay.racing.friendship.domain;

import com.ssfay.racing.users.domain.Users;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
public class Friend {

    @Id
    @GeneratedValue
    private int friendId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users users;

    @ManyToOne
    @JoinColumn(name = "friend_user_id")
    private Users friendUsers;

    public Friend(Users users, Users friendUsers) {
        this.users = users;
        this.friendUsers = friendUsers;
    }
}

