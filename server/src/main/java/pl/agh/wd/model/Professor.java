package pl.agh.wd.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "professors")
@Getter
@Setter
@NoArgsConstructor

public class Professor {

    @Id
    @Column(name="user_id")
    private long user_id;

    @OneToOne(cascade = CascadeType.ALL)
    @PrimaryKeyJoinColumn(name="user_id", referencedColumnName="id")
    protected User owner;

    @Column(name="title")
    protected String title;

    public void setOwner(User owner)
    {
        this.owner = owner;
        this.user_id = owner.getId();
    }

    // This should get us a many-to-many through a Professor weak entity that has a User PKEY id as user_id.
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "course_professors",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "course_id"))
    private Set<Course> currentCourses;

    @ManyToOne
    @JoinColumn(name="faculty_id", nullable=false)
    private Faculty faculty;
}