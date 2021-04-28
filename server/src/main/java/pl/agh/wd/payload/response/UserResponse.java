package pl.agh.wd.payload.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;
import pl.agh.wd.model.Role;
import pl.agh.wd.model.User;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponse {

    @NotBlank
    private long id;

    @NotBlank
    private String username;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String name;

    @NotBlank
    private String surname;

    @NotBlank
    private String city;

    @NotBlank
    private String country;

    @NotBlank
    private String postalCode;

    @NotBlank
    private String telephone;

    @NotBlank
    private String address;

    private Set<String> roles;
    private LecturerResponse lecturer;
    private StudentResponse student;
    private ClerkResponse staff;

    public UserResponse(User user){
        id = user.getId();
        username = user.getUsername();
        email = user.getEmail();
        name = user.getName();
        surname = user.getSurname();
        city = user.getCity();
        country = user.getCountry();
        postalCode = user.getPostalCode();
        telephone = user.getTelephone();
        address = user.getAddress();

        roles = new HashSet<>();
        for (Role role : user.getRoles()){
            roles.add(role.getName().name());
        }
    }
}
