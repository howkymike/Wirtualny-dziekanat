package pl.agh.wd.payload.request;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

import javax.validation.constraints.*;

/**
 * Used for /api/auth/register request
 *
 * @author howkymike
 */

@Getter
@Setter
public class RegisterRequest {
    @NotBlank
    @Size(min = 5, max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    private Set<String> role;

    @NotBlank
    @Size(min = 8, max = 40)
    private String password;

}