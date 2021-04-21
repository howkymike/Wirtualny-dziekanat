package pl.agh.wd.payload.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class UpdateLecturerRequest extends UpdateRoleRequest {

    @NotBlank
    private String title;

    @NotBlank
    private int facultyId;
}
