package com.ssafy.movezoo.friendship.domain;

import com.ssafy.movezoo.user.domain.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Friend {

    @Id
    @GeneratedValue
    private int friendId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne( fetch = FetchType.LAZY)
    @JoinColumn(name = "friend_user_id")
    private User friendUser;

    public Friend(User user, User friendUser) {
        this.user = user;
        this.friendUser = friendUser;
    }

    public Friend() {

    }
}

