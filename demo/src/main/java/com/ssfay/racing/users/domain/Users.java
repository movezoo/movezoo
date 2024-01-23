package com.ssfay.racing.users.domain;

import com.ssfay.racing.friendship.domain.Friend;
import com.ssfay.racing.friendship.domain.FriendRequest;
import com.ssfay.racing.game.domain.LapTime;
import com.ssfay.racing.game.domain.MyRacer;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Users {
    @Id
    @GeneratedValue
    private Long usersId;

    private String usersEmail;

    private String googleUsersEmail;

    private String password;

    private String nickname;

    private LocalDate enrollDate;

    private int coin;

    private String profileImgUrl;

    private int volume;

    private int mic;

    private int cameraSensitivity;

    private String authNumber;

    private String tempPassword;

    @OneToMany(mappedBy = "users", cascade = CascadeType.ALL)
    private List<LapTime> lapTimes = new ArrayList<>();

    //내가 친구요청을 보낸 리스트
    //cascade = CascadeType.ALL는 연관관계의 주인이 아닌쪽!(one)
    @OneToMany(mappedBy = "fromUsers", cascade = CascadeType.ALL)
    private List<FriendRequest> sentFriendRequests = new ArrayList<>();

    //내가 친구요청을 받은 리스트
    @OneToMany(mappedBy = "toUsers", cascade = CascadeType.ALL)
    private List<FriendRequest> receivedFriendRequests = new ArrayList<>();

    //친구 관계인 사용자를 표시
    @OneToMany(mappedBy = "users", cascade = CascadeType.ALL)
    private List<Friend> friends = new ArrayList<>();

    @OneToMany(mappedBy = "users", cascade = CascadeType.ALL)
    private List<MyRacer> myRacers = new ArrayList<>();

    // 친구 추가 메서드
    public void addFriend(Users friend) {
        Friend friendship = new Friend(this, friend);
        friends.add(friendship);
    }
}
