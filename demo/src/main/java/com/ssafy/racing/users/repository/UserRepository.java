package com.ssafy.racing.users.repository;

import com.ssafy.racing.users.domain.Users;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
@Transactional
public class UserRepository {

    private final EntityManager em;

    public Users save(Users users) {
        em.persist(users);
        return users;
    }

    public void delete(Users users) {
        em.remove(users);
    }

    public List<Users> findAll() {
        return em.createQuery("select u from Users u", Users.class)
                .getResultList();
    }

    public long totalCount() {
        return em.createQuery("select count(u) from Users u", Long.class)
                .getSingleResult();
    }

    //아이디는 pk
    public Users findById(Long id) {
        return em.find(Users.class, id);
    }

    public Users findByEmail(String usersEmail) {
        return em.createQuery("select u from Users u where u.usersEmail = :usersEmail", Users.class)
                .setParameter("usersEmail", usersEmail)
                .getSingleResult();
    }

    public Users findByNickname(String nickname) {
        return em.createQuery("select u from Users u where u.nickname = :nickname", Users.class)
                .setParameter("nickname", nickname)
                .getSingleResult();
    }

    //파라미터로 객체보다는 아이디만 넘기는것이 직관적이다.
    public int updatePassword(String usersEmail, String password) {
        return em.createQuery("update Users u set u.password = :password where u.usersEmail=:usersEmail")
                .setParameter("password", password)
                .setParameter("usersEmail", usersEmail)
                .executeUpdate();
    }

    public int updateNickname(Long usersId, String nickname) {
        return em.createQuery("update Users u set u.nickname = :nickname where u.usersId = :usersId")
                .setParameter("nickname", nickname)
                .setParameter("usersId", usersId)
                .executeUpdate();
    }

    public int updateVolumeAndMic(Long usersId, int volume, int mic) {
        return em.createQuery("update Users u set u.volume=:volume, u.mic=:mic where u.usersId=:usersId")
                .setParameter("volume", volume)
                .setParameter("mic", mic)
                .setParameter("usersId", usersId)
                .executeUpdate();
    }

}

