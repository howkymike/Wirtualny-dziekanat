package pl.agh.wd.service;

import java.util.Date;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import pl.agh.wd.model.User;

/**
 * Basic implementation of UserDetails
 * For now it only adds email
 *
 * @author howkymike
 */

public class UserDetailsImpl implements UserDetails{
    private static final long serialVersionUID = 1L;

    private static final long MAX_LOCK_TIME = 24 * 60 * 60 * 1000;

    private final Long id;

    private final String username;

    private final String email;

    private final Boolean isNew;

    @JsonIgnore
    private final String password;

    private final Collection<? extends GrantedAuthority> authorities;

    private final Boolean isLocked;

    private final Date lockedAt;

    public UserDetailsImpl(Long id, String username, String email, String password, Boolean isNew,
                           Collection<? extends GrantedAuthority> authorities, Boolean isLocked, Date lockedAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
        this.isNew = isNew;
        this.isLocked = isLocked;
        this.lockedAt = lockedAt;
    }

    public static UserDetailsImpl build(User user) {
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toList());

        return new UserDetailsImpl(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getPassword(),
                user.getIsNew(),
                authorities,
                user.isLocked(),
                user.getLockedAt());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        Date now = new Date();
        long lockedFor = now.getTime() - lockedAt.getTime();

        Boolean lockExpired = lockedFor >= MAX_LOCK_TIME;

        return (!isLocked || lockExpired);
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public boolean isNew() {
        return isNew;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }
}
