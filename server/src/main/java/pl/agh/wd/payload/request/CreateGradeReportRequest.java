package pl.agh.wd.payload.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

@Setter
@Getter
public class CreateGradeReportRequest {

    @NotBlank
    private String message;

    @NotEmpty
    private Long lecturerId;
}
