package pl.agh.wd.payload.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangeActualPasswordRequest {
    private String newPassword;
    private String secondNewPassword;
    private String actualPassword;
}
