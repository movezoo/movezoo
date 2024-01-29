package com.ssafy.movezoo.user.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ssafy.movezoo.friendship.domain.Friend;
import com.ssafy.movezoo.friendship.domain.FriendRequest;
import com.ssafy.movezoo.game.domain.LapTime;
import com.ssafy.movezoo.game.domain.MyRacer;
import com.ssafy.movezoo.user.dto.UserRole;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {
    @Id
    @GeneratedValue
    private int userId;

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

    // 권한 String
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<LapTime> lapTimes = new ArrayList<>();

    //내가 친구요청을 받은 리스트
    //cascade = CascadeType.ALL는 연관관계의 주인이 아닌쪽!(one)
    @OneToMany(mappedBy = "toUser", cascade = CascadeType.ALL)
    private List<FriendRequest> receivedFriendRequests = new ArrayList<>();

    //친구 관계인 사용자를 표시
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Friend> friends = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<MyRacer> myRacers = new ArrayList<>();


    // 회원가입 용 Constructor
    @Builder
    public User(String userEmail, String password, String nickname){
        this.userEmail = userEmail;
        this.password = password;   // 암호화 해서 넣기 (PasswordEncoder 사용)
        this.nickname = nickname;
        this.coin=0;
        this.volume=50;
        this.mic=50;
        this.cameraSensitivity=50;
        this.role=UserRole.USER;
    }


    // 친구 추가 메서드
    public void addFriend(User friend) {
        this.friends.add(new Friend(this,friend));
//        friend.friends.add(new Friend(friend,this));
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


    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", userEmail='" + userEmail + '\'' +
                ", googleUserEmail='" + googleUserEmail + '\'' +
                ", password='" + password + '\'' +
                ", nickname='" + nickname + '\'' +
                ", coin=" + coin +
                '}';
    }

}
