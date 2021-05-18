package pl.agh.wd.payload.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SetGradeRequest {
    private String type;
    private double grade;
    private long studentId;
    private long courseId;
}
