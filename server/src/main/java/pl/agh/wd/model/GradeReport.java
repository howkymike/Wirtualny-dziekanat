package pl.agh.wd.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
public class GradeReport {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String message;

    private Long lecturerId;
    
    private Date sendDate;

    private boolean isRead;

    @JsonBackReference
    @ManyToOne
    private CourseStudent courseStudent;
}
