package pl.agh.wd.payload.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import java.util.Set;

@Getter
@Setter
public class AssignCourseLecturerRequest {
    @NotBlank
    private Set<Long> courseLecturerIds;

    @NotBlank
    private Set<Long> labLecturerIds;
}
