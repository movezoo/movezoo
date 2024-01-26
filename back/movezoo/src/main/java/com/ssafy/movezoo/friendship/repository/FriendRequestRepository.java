package com.ssafy.movezoo.friendship.repository;

import com.ssafy.movezoo.friendship.domain.FriendRequest;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class FriendRequestRepository {

    private final EntityManager em;

    public FriendRequest save(FriendRequest friendRequest) {
        em.persist(friendRequest);
        return friendRequest;
    }

    public List<FriendRequest> findByUserId(Integer userId) {
        return em.createQuery("select fr from FriendRequest fr where fr.toUser.userId=:userId", FriendRequest.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    public Optional<FriendRequest> findByUserIdAndFriendId(Integer userId, Integer friendRequestId) {
        List<FriendRequest> friendRequestList = em.createQuery("select fr from FriendRequest fr where fr.toUser.userId=:userId and fr.fromUser.userId=:friendRequestId", FriendRequest.class)
                .setParameter("userId", userId)
                .setParameter("friendRequestId", friendRequestId)
                .getResultList();
        return  friendRequestList.stream().findAny();
    }

    public int deleteByUserId(Integer userId, Integer friendRequestId) {
        return em.createQuery("delete from FriendRequest fr where fr.toUser.userId=:userId and fr.fromUser.userId=:friendRequestId")
                .setParameter("userId", userId)
                .setParameter("friendRequestId", friendRequestId)
                .executeUpdate();
    }

}
