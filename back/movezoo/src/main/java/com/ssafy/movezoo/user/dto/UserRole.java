package com.ssafy.movezoo.user.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserRole {
    USER("ROLE_USER"), ADMIN("ROLE_ADMIN"), SOCIAL("ROLE_SOCIAL");

    private final String name;

}
