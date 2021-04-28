package pl.agh.wd.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * Basic users table, should be extended to allow additional properties
 *
 * @author howkymike
 * @author sadowicz
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
    @JsonIgnore
    @Size(max = 128)
    private String password;

    @NotBlank
    @JsonIgnore
    private Boolean isNew;

    @NotBlank
    @Size(max = 128)
    private String name;

    @NotBlank
    @Size(max = 128)
    private String surname;
    @JsonIgnore
    private boolean locked = false;
    @JsonIgnore
    private int failedLoginCounter = 0;

    @JsonIgnore
    @Temporal(TemporalType.TIMESTAMP)
    private Date lockedAt = new Date(0);

    @Size(max=128)
    private String city;

    @Size(max=128)
    private String country;

    @Size(max=128)
    private String postalCode;

    @Size(max=128)
    private String telephone;

    @Size(max=128)
    private String address;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(	name = "user_role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.isNew = true;
    }


    public User(String username, String email, String password, String firstName, String lastName, String country,
                String city, String address, String postalCode, String telephone, Set<Role> roles, boolean isNew ) {
        this(username, email, password);
        this.name = firstName;
        this.surname = lastName;
        this.country = country;
        this.city = city;
        this.address = address;
        this.postalCode = postalCode;
        this.telephone = telephone;
        this.roles = roles;
        this.isNew = isNew;
    }

}
