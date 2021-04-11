package pl.agh.wd.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

/**
 * roles table
 * It is created here but populated using data.sql file.
 *
 */

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
public class Student {

    @Id
    @Column(name="user_id")
    private long user_id;

    @OneToOne
    @PrimaryKeyJoinColumn(name="user_id", referencedColumnName="id")
    protected User owner;

    @Column(name="index")
    protected int index;

    public void setOwner(User owner)
    {
        this.owner = owner;
        this.user_id = owner.getId();
    }

    // This should get us a many-to-many through a Student weak entity that has a User PKEY id as user_id.
    // TODO: resolve adding stuff to course_student table
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "course_students",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "course_id"))
    private Set<Course> currentCourses;

    @ManyToMany(mappedBy = "currentStudents")
    Set<FieldOfStudy> fieldsOfStudy;

}