package com.ssafy.racing.users.domain;


import com.ssafy.racing.friendship.domain.Friend;
import com.ssafy.racing.friendship.domain.FriendRequest;
import com.ssafy.racing.game.domain.LapTime;
import com.ssafy.racing.game.domain.MyRacer;
import com.ssafy.racing.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Users {
    @Id
    @GeneratedValue
    private Long usersId;

    private String usersEmail;

    private String googleUsersEmail;

    private String password;

    private String nickname;

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



    // Constructor
    @Builder
    public Users(String usersEmail, String password, String nickname){
        this.usersEmail = usersEmail;
        this.password = password;
        this.nickname = nickname;
    }


    // 친구 추가 메서드
    public void addFriend(Users friend) {
        Friend friendship = new Friend(this, friend);
        friends.add(friendship);
    }

    //===연관관계 편의 메서드 예시===//
//    public void addChildCategory(Category child){
//        this.child.add(child);
//        child.setParent(this);
//    }

    public Users(String usersEmail, String password, String nickname){
        this.usersEmail=usersEmail;
        this.password=password;
        this.nickname=nickname;
        this.coin=0;
        this.volume=50;
        this.mic=50;
        this.cameraSensitivity=50;
    }

    public Users(String googleUsersEmail){
        this.googleUsersEmail=googleUsersEmail;
        this.coin=0;
        this.volume=50;
        this.mic=50;
        this.cameraSensitivity=50;
    }

    protected Users(){

    }
}
