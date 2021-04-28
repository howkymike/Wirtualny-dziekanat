package pl.agh.wd.payload.response;

import lombok.Getter;
import lombok.Setter;
import pl.agh.wd.model.Lecturer;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class LecturerResponse {
    @NotBlank
    private String title;

    @NotBlank
    private long facultyId;

    public LecturerResponse(Lecturer lecturer){
        title = lecturer.getTitle();
        facultyId = lecturer.getFaculty().getId();
    }
}
