package pl.agh.wd.payload.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class UpdateClerkRequest extends UpdateRoleRequest {

    @NotBlank
    private long facultyId;
}
