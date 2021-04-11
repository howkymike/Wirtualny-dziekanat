package pl.agh.wd.payload.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class FirstTimeRequest {
    @NotBlank
    private String token;

    @NotBlank
    private String password;
    
    @NotBlank
    private String password2;
}
