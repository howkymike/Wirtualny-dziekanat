package pl.agh.wd.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Entity
@Table(name = "course")
@Getter
@Setter
@NoArgsConstructor
public class Course {

    @Id
    @GeneratedValue
    private long id;

    @Column(name="lecture_time", nullable = true)
    private int lecture_time;

    @Column(name="laboratory_time", nullable = true)
    private int laboratory_time;

    @Column(name="ects")
    private int ects;

    @Column(name="exam")
    private boolean exam;

    @Column(name="name")
    private String name;

    @OneToMany(mappedBy = "course")
    @NotFound(action = NotFoundAction.IGNORE)
    private Set<CourseStudent> courseStudents;

    @ManyToMany
    @JoinTable(name = "course_lecturer",
            joinColumns = @JoinColumn(name = "course_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "lecturer_id", referencedColumnName = "user_id"))
    private Set<Lecturer> courseLecturers;

    @ManyToOne
    @JoinColumn(name="fieldofstudy_id", nullable=true)
    private FieldOfStudy fieldOfStudy;

    public Course(String name, int lecture_time, int laboratory_time, int ects, boolean exam) {
        this.name = name;
        this.lecture_time = lecture_time;
        this.laboratory_time = laboratory_time;
        this.ects = ects;
        this.exam = exam;
    }

    public Course(String name, int lecture_time, int laboratory_time, int ects, boolean exam, CourseStudent... courseStudents) {
        this(name, lecture_time, laboratory_time, ects, exam);
        for(CourseStudent courseStudent : courseStudents) courseStudent.setCourse(this);
        this.courseStudents = Stream.of(courseStudents).collect(Collectors.toSet());
    }
}