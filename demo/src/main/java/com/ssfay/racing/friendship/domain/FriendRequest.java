package com.ssfay.racing.friendship.domain;

import com.ssfay.racing.users.domain.Users;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Table(name = "FriendRequest")
public class FriendRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "friend_request_id")
    private int friendRequestId;

    @ManyToOne
    @JoinColumn(name = "from_user_id")
    private Users fromUsers;

    @ManyToOne
    @JoinColumn(name = "to_user_id")
    private Users toUsers;

    public FriendRequest(Users fromUsers, Users toUsers) {
        this.fromUsers = fromUsers;
        this.toUsers = toUsers;
    }

}

