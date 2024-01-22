package com.ssfay.racing.users.domain;

import jakarta.persistence.Entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.time.LocalDate;

@Entity
public class Users {
    @Id
    @GeneratedValue
    private Long usersId;

    private String usersEmail;

    private String googleUsersEmail;

    private String password;

    private String nickname;

    private LocalDate enrollDate;

    private int coin;

    private String profileImgUrl;

    private int volume;

    private int mic;

    private int cameraSensitivity;
}
