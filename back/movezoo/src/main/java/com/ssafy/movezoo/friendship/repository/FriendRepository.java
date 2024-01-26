package com.ssafy.movezoo.friendship.repository;

import com.ssafy.movezoo.friendship.domain.Friend;
import com.ssafy.movezoo.user.domain.User;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class FriendRepository {
    private final EntityManager em;

    public Friend save(Friend friend) {
        em.persist(friend);
        return friend;
    }

    public List<User> findByUserId(Integer userId){
        return em.createQuery("select f.friendUser from Friend f where f.user.userId=:userId",User.class)
                .setParameter("userId",userId).getResultList();

    }

    public List<User> findByFriendUserId(Integer friendUserId){
        return em.createQuery("select f.user from Friend f where f.friendUser.userId=:friendUserId",User.class)
                .setParameter("friendUserId",friendUserId)
                .getResultList();
    }

    public Optional<Friend> findByUserIdAndFriendUserId(Integer userId, Integer friendUserId){
        List<Friend> friends =  em.createQuery("select f from Friend f where f.user.userId=:userId and f.friendUser.userId=:friendUserId",Friend.class)
                .setParameter("userId",userId)
                .setParameter("friendUserId",friendUserId)
                .getResultList();

        return friends.stream().findAny();
    }

    public int deleteByUserId(Integer userId, Integer friendId){
        return em.createQuery("delete from Friend f where f.user.userId=:userId and f.friendUser.userId=:friendId")
                .setParameter("userId",userId)
                .setParameter("friendId",friendId)
                .executeUpdate();
    }
}
