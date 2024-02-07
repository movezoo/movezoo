package com.ssafy.movezoo.user.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserRole {
    USER("ROLE_USER","손님"), ADMIN("ROLE_ADMIN","관리자1");

    private final String key;
    private final String title;

}
