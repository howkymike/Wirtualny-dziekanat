package pl.agh.wd.payload.response;

import pl.agh.wd.model.FieldOfStudy;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class FieldOfStudyResponse {
    @NotBlank
    private String faculty;

    @NotBlank
    private String fieldOfStudy;

    public FieldOfStudyResponse(FieldOfStudy fieldOfStudy) {
        this.faculty = fieldOfStudy.getFaculty().getName();
        this.fieldOfStudy = fieldOfStudy.getName();
    }
}
