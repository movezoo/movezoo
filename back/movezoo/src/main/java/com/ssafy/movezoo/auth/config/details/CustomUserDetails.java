package com.ssafy.movezoo.auth.config.details;

import com.ssafy.movezoo.user.domain.User;
import jakarta.annotation.Nullable;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.*;

@Getter
public class CustomUserDetails implements UserDetails, OAuth2User {

    private User user;
    private Map<String, Object> attributes;

//    public CustomUserDetails(User user) {
//        this.user = user;
//    }

    public CustomUserDetails(User user, Map<String, Object> attributes) {
        this.user = user;
        this.attributes = attributes;
    }

    public CustomUserDetails(User user) {
        this.user = user;
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

    // 계정이 만료 되었는지 (true: 만료X)
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // 계정이 잠겼는지 (true: 잠기지 않음)
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    // 비밀번호가 만료되었는지 (true: 만료X)
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // 계정이 활성화(사용가능)인지 (true: 활성화)
    @Override
    public boolean isEnabled() {
        return true;
    }

    // OAuth2User
    @Override
    public String getName() {
        return String.valueOf(user.getUserId());
    }

    @Override
    public Map<String, Object> getAttributes() {
        return Collections.unmodifiableMap(attributes);
    }

    @Override
    @Nullable
    @SuppressWarnings("unchecked")
    public <A> A getAttribute(String name) {
        return OAuth2User.super.getAttribute(name);
    }


    @Override
    public String toString() {
        return "CustomUserDetails{" +
                "user=" + user +
                '}';
    }

}