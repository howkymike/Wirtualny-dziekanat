package pl.agh.wd.payload.response;

import lombok.Getter;
import lombok.Setter;
import pl.agh.wd.model.Student;

@Getter
@Setter
public class StudentResponse {

    private int index;

    public StudentResponse(Student student){
        index = student.getIndex();
    }
}
