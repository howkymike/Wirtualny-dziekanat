package pl.agh.wd.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "course")
@Getter
@Setter
@NoArgsConstructor
public class Course {

    @Id
    @GeneratedValue
    private long course_id;

    @Column(name="lecture_time", nullable = true)
    protected int lecture_time;

    @Column(name="laboratory_time", nullable = true)
    protected int laboratory_time;

    @Column(name="ects")
    protected int ects;

    @Column(name="exam")
    protected boolean exam;

    @Column(name="name")
    protected String name;

    // I don't know if x2 currentCourses won't bug.
    @ManyToMany(mappedBy = "currentCourses")
    Set<Student> students;

    @ManyToMany(mappedBy = "currentCourses")
    Set<Student> professors;

    @ManyToOne
    @JoinColumn(name="fieldOfStudy_id", nullable=false)
    private FieldOfStudy fieldOfStudy;



}