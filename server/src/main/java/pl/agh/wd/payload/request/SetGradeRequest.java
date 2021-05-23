package pl.agh.wd.payload.request;

import java.util.Collection;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SetGradeRequest {
    private long id;
    private Collection<GradeList> grades;
}
