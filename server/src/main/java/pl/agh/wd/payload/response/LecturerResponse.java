package pl.agh.wd.payload.response;

import lombok.Getter;
import lombok.Setter;
import pl.agh.wd.model.Professor;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class LecturerResponse {
    @NotBlank
    private String title;

    @NotBlank
    private long facultyId;

    public LecturerResponse(Professor professor){
        title = professor.getTitle();
        facultyId = professor.getFaculty().getFaculty_id();
    }
}
