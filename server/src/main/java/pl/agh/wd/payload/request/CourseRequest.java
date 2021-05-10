package pl.agh.wd.payload.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import java.util.Set;

@Getter
@Setter
public class CourseRequest {
    

    @NotBlank
    String name;

    @NotBlank
    int lecture_time;

    @NotBlank
    int laboratory_time;

    @NotBlank
    int ects;

    @NotBlank
    boolean exam;

    Set<Long> courseStudentIds;

    Set<Long> courseLecturerIds;

    long fieldOfStudyId;
}