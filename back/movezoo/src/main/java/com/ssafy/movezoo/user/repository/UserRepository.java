package com.ssafy.movezoo.user.repository;

import com.ssafy.movezoo.user.domain.User;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
@Transactional
public class UserRepository {

    private final EntityManager em;

    public User save(User user) {
        em.persist(user);
        return user;
    }

    public void delete(User user) {
        em.remove(user);
    }

    public List<User> findAll() {
        return em.createQuery("select u from User u", User.class)
                .getResultList();
    }

    public int totalCount() {
        return em.createQuery("select count(u) from User u", Integer.class)
                .getSingleResult();
    }

    //아이디는 pk
    public User findById(int userId) {
        return em.find(User.class, userId);
    }

    public User findByEmail(String userEmail) {
        return em.createQuery("select u from User u where u.userEmail = :userEmail", User.class)
                .setParameter("userEmail", userEmail)
                .getSingleResult();
    }

    public User findByNickname(String nickname) {
        return em.createQuery("select u from User u where u.nickname = :nickname", User.class)
                .setParameter("nickname", nickname)
                .getSingleResult();
    }

    //파라미터로 객체보다는 아이디만 넘기는것이 직관적이다.
    public int updatePassword(String userEmail, String password) {
        return em.createQuery("update User u set u.password = :password where u.userEmail=:userEmail")
                .setParameter("password", password)
                .setParameter("userEmail", userEmail)
                .executeUpdate();
    }

    public int updateNickname(int userId, String nickname) {
        return em.createQuery("update User u set u.nickname = :nickname where u.userId = :userId")
                .setParameter("nickname", nickname)
                .setParameter("userId", userId)
                .executeUpdate();
    }

    public int updateSetting(int userId, int volume, int mic, int cameraSensitivity) {
        return em.createQuery("update User u set u.volume=:volume, u.mic=:mic, u.cameraSensitivity=:cameraSensitivity where u.userId=:userId")
                .setParameter("volume", volume)
                .setParameter("mic", mic)
                .setParameter("cameraSensitivity", cameraSensitivity)
                .setParameter("userId", userId)
                .executeUpdate();
    }

}

