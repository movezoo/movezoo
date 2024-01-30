package com.ssafy.movezoo.friendship.service;

import com.ssafy.movezoo.friendship.domain.Friend;
import com.ssafy.movezoo.friendship.dto.FriendResponseDto;
import com.ssafy.movezoo.friendship.repository.FriendRepository;
import com.ssafy.movezoo.user.domain.User;
import com.ssafy.movezoo.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class FriendService {

    private final UserRepository userRepository;
    private final FriendRepository friendRepository;

    //참조순환이 발생해서 재귀.. 친구 설정하는게 너무 어렵다
//    public List<Friend> findFriendList(Integer userId){
//        User findUser = userRepository.findById(userId);
//        System.out.println(findUser);
//        return findUser.getFriends();
//    }

    public List<FriendResponseDto> findFriendList(Integer userId) {
        List<User> byUserId = friendRepository.findByUserId(userId);
        List<FriendResponseDto> result = new ArrayList<>();
        for(User user : byUserId){
            FriendResponseDto frd = new FriendResponseDto(user.getUserId(),user.getNickname(),user.getProfileImgUrl());
            result.add(frd);
        }

        return result;

    }

//    public boolean addFriend(Integer userId,Integer friendId){
//        //중복되면 하지않는다.
//        //자기자신도안한다
//        User user = userRepository.findById(userId);
//        User friend = userRepository.findById(friendId);
//        System.out.println(user);
//        if(friend == null) return false;
//        user.addFriend(friend);
//        return true;
//    }

    public boolean addFriend(Integer userId, Integer friendId) {
        //중복되면 하지않는다.
        //자기자신도안한다

        //친구요청에 있어야 추가할수있다.


        if ((int) userId == (int) friendId || friendRepository.findByUserIdAndFriendUserId(userId, friendId).isPresent())
            return false;

        User user = userRepository.findById(userId);
        User friend = userRepository.findById(friendId);

        friendRepository.save(new Friend(user, friend));
        friendRepository.save(new Friend(friend, user));

        return true;
    }

    public boolean deleteFriend(int userId, int friendId) {
        if(friendRepository.findByUserIdAndFriendUserId(userId,friendId)!=null) friendRepository.deleteByUserId(userId,friendId);
        else return false;

        if(friendRepository.findByUserIdAndFriendUserId(friendId,userId)!=null) friendRepository.deleteByUserId(friendId,userId);
        else return false;

        return true;
    }

}
