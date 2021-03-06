package pl.agh.wd.payload.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class UpdateLecturerRequest {

    @NotBlank
    private String title;

    @NotBlank
    private long facultyId;
}
