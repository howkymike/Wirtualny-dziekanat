package pl.agh.wd.payload.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GradeList {
    private long studentId;
    private double laboratoryGrade;
    private double examGrade;
    private double finalGrade;
}
