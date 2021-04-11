package pl.agh.wd.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

/**
 * Basic users table, should be extended to allow additional properties
 *
 * @author howkymike
 */

@Entity
@Table(	name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email")
        })
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue
    private long id;

    @NotBlank
    @Size(max = 32)
    private String username;

    @NotBlank
    @Size(max = 64)
    @Email
    private String email;

    @NotBlank
    @Size(max = 128)
    private String password;

    @NotBlank
    private Boolean isNew;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(	name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.isNew = true;
    }

}
