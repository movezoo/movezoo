package com.ssafy.racing.friendship.service;

import com.ssafy.racing.friendship.domain.FriendRequest;
import com.ssafy.racing.friendship.dto.FriendRequestDto;
import com.ssafy.racing.friendship.dto.FriendResponseDto;
import com.ssafy.racing.friendship.repository.FriendRepository;
import com.ssafy.racing.friendship.repository.FriendRequestRepository;
import com.ssafy.racing.user.domain.User;
import com.ssafy.racing.user.repository.UserRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class FriendRequestService {
    private final FriendRequestRepository friendRequestRepository;
    private final FriendRepository friendRepository;
    private final UserRepository userRepository;

    public List<FriendResponseDto> findFriendRequestList(Integer userId) {
        List<FriendResponseDto> result = new ArrayList<>();
        List<FriendRequest> byUserId = friendRequestRepository.findByUserId(userId);

        for(FriendRequest fr :byUserId){
            User user = fr.getToUser();
            if(user.getUserId() == userId) {
                FriendResponseDto frd = new FriendResponseDto(user.getUserId(),user.getNickname(),user.getProfileImgUrl());
                result.add(frd);
            }
        }
        return result;
    }

    public boolean addFriendRequest(Integer userId, Integer friendId) {

        //자기자신에게 보낼경우, 이미 친구인 경우
        if ((int) userId == (int) friendId || friendRepository.findByUserIdAndFriendUserId(userId, friendId).isPresent()) {
            return false;
        }

        System.out.println(friendRequestRepository.findByUserIdAndFriendId(friendId, userId));
        //이미 친구 요청을 보냈을때
        if (friendRequestRepository.findByUserIdAndFriendId(friendId, userId).isPresent()) {
            return false;
        }

        User toUser = userRepository.findById(friendId);
        User fromUser = userRepository.findById(userId);
        FriendRequest friendRequest = new FriendRequest(fromUser, toUser);

        friendRequestRepository.save(friendRequest);

        return true;
    }

    public boolean deleteFriendRequest(Integer userId, Integer friendRequestId) {
        if ((int) userId == (int) friendRequestId)
            return false;

        int result = friendRequestRepository.deleteByUserId(userId, friendRequestId);
        return result>0;
    }
}
