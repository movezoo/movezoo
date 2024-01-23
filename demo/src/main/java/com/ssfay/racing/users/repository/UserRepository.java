package com.ssfay.racing.users.repository;

import com.ssfay.racing.users.domain.Users;
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

    public List<Users> findByEmail(String usersEmail) {
        return em.createQuery("select u from Users u where u.usersEmail = :usersEmail", Users.class)
                .setParameter("usersEmail", usersEmail)
                .getResultList();
    }

    //벌크(bulk)성 수정 쿼리 : 모든 직원의 연봉을 10%올려라! (ex. 한명한명 하는게 아니라 한번에 모든 직원에 update수행)
    public int bulkAge(int age){
        return em.createQuery("update Member m set m.age = m.age+1 where m.age >= :age")
                .setParameter("age", age)
                .executeUpdate();
    }

    //파라미터로 객체보다는 아이디만 넘기는것이 직관적이다.
    public int updatePassword(Users users, String password){
        return em.createQuery("update Users u set u.password = :password where u.usersId=:usersId")
                .setParameter("password",password)
                .setParameter("userId",users.getUsersId())
                .executeUpdate();
    }





}

