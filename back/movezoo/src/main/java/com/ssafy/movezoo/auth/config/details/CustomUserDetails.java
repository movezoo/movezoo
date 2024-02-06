package com.ssafy.movezoo.auth.config.details;

import com.ssafy.movezoo.user.domain.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

@Getter
public class CustomUserDetails implements UserDetails, OAuth2User {

    private User user;
    private Map<String, Object> attributes;

    // 일반로그인
    public CustomUserDetails(User user) {
        this.user = user;
    }

    // OAuth 로그인
    public CustomUserDetails(User user, Map<String, Object> attributes) {
        this.user = user;
        this.attributes = attributes;
    }

    // 계정이 갖고있는 권한 return
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(user.getRole().name()));

        System.out.println("Authorities : "+authorities);

        return authorities;
    }

    // get Password 메서드
    @Override
    public String getPassword() {
        return user.getPassword();
    }

    // get Username 메서드 (생성한 User은 userId 사용)
    @Override
    public String getUsername() {
        return String.valueOf(user.getUserId());
    }

    // 계정 만료 여부 (true: 만료X)
    @Override
    public boolean isAccountNonExpired() {
        // 만료되었는지 확인하는 로직
        return true;
    }

    // 계정 잠금 여부 (true: 잠기지 않음)
    @Override
    public boolean isAccountNonLocked() {
        // 잠금되었는지 확인하는 로직
        return true;
    }

    // 비밀번호 만료 여부 (true: 만료X)
    @Override
    public boolean isCredentialsNonExpired() {
        // 만료되었는지 확인하는 로직
        return true;
    }

    // 계정 활성화(사용가능) 여부 (true: 활성화)
    @Override
    public boolean isEnabled() {
        // 활성화되었는지 확인하는 로직
         return true;
    }

    // OAuth2
    @Override
    public String getName() {
        return String.valueOf(user.getUserId());
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public String toString() {
        return "CustomUserDetails{" +
                "user=" + user +
                '}';
    }

}