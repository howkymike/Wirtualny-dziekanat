package pl.agh.wd.payload.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import java.util.Set;

@Getter
@Setter
public class UpdateRoleRequest {

    @NotBlank
    private long id;

    @NotBlank
    private String name;
}
