package pl.agh.wd.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * same note as in the Lecturer.java
 *
 * @author howkymike
 * @author bakoo
 */
@Entity
@Table(name = "student")
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties({"courseStudents"})
public class Student {

    @Id
    private Long id;

    @OneToOne(fetch= FetchType.LAZY)
    @MapsId
    private User user;

    @Column(name="index")
    private int index;

    @Column(name="level_of_studies")
    private String levelOfStudies;

    @Column(name="commencment_of_studies")
    private Date commencmentOfStudies;

    // This should get us a many-to-many through a Student weak entity that has a User PKEY id as user_id.
    @OneToMany(mappedBy = "student", fetch = FetchType.LAZY)
    private Set<CourseStudent> courseStudents = new HashSet<>();

    @ManyToMany(mappedBy = "currentStudents")
    Set<FieldOfStudy> fieldsOfStudy;

    public Student(User user, int index, String levelOfStudies) {
        this.user = user;
        this.index = index;
        this.levelOfStudies = levelOfStudies;
        // For now student is created on his commencment date. Change may be necessary depending on needs.
        this.commencmentOfStudies = new Date(System.currentTimeMillis());
    }
}