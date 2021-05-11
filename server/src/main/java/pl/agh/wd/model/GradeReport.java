package pl.agh.wd.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
@Getter
@Setter
public class GradeReport {
    @Id
    private Long id;

    private String message;

    @JsonBackReference
    @ManyToOne
    private CourseStudent courseStudent;
}
