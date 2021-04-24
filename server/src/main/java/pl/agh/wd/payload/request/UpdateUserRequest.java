package pl.agh.wd.payload.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Set;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class UpdateUserRequest {

    @NotBlank
    private long id;

    @NotBlank
    @Size(min = 5, max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(min = 5, max = 20)
    private String name;

    @NotBlank
    @Size(min = 5, max = 20)
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

    private UpdateLecturerRequest lecturerData;

    private UpdateClerkRequest stuffData;

    private UpdateStudentRequest studentData;
}
