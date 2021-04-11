package pl.agh.wd.payload.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequest {

    private String newPassword;
    private String token;
}
