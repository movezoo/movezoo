package com.ssafy.racing.user.domain;


import com.ssafy.racing.friendship.domain.Friend;
import com.ssafy.racing.friendship.domain.FriendRequest;
import com.ssafy.racing.game.domain.LapTime;
import com.ssafy.racing.game.domain.MyRacer;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {
    @Id
    @GeneratedValue
    private Integer userId;

    private String userEmail;

    private String googleUserEmail;

    private String password;

    private String nickname;

    private int coin;

    private String profileImgUrl;

    private int volume;

    private int mic;

    private int cameraSensitivity;

    private String authNumber;

    private String tempPassword;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<LapTime> lapTimes = new ArrayList<>();

    //내가 친구요청을 보낸 리스트
    //cascade = CascadeType.ALL는 연관관계의 주인이 아닌쪽!(one)
    @OneToMany(mappedBy = "fromUser", cascade = CascadeType.ALL)
    private List<FriendRequest> sentFriendRequests = new ArrayList<>();

    //내가 친구요청을 받은 리스트
    @OneToMany(mappedBy = "toUser", cascade = CascadeType.ALL)
    private List<FriendRequest> receivedFriendRequests = new ArrayList<>();

    //친구 관계인 사용자를 표시
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Friend> friends = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<MyRacer> myRacers = new ArrayList<>();


    // 회원가입 용 Constructor
    @Builder
    public User(String userEmail, String password, String nickname){
        this.userEmail = userEmail;
        this.password = password;
        this.nickname = nickname;
        this.coin=0;
        this.volume=50;
        this.mic=50;
        this.cameraSensitivity=50;
    }


    // 친구 추가 메서드
    public void addFriend(User friend) {
        Friend friendship = new Friend(this, friend);
        friends.add(friendship);
    }

    //===연관관계 편의 메서드 예시===//
//    public void addChildCategory(Category child){
//        this.child.add(child);
//        child.setParent(this);
//    }

    public User(String googleUserEmail){
        this.googleUserEmail=googleUserEmail;
        this.coin=0;
        this.volume=50;
        this.mic=50;
        this.cameraSensitivity=50;
    }
}
