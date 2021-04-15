package pl.agh.wd.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name="faculties")
@Getter
@Setter
@NoArgsConstructor
public class Faculty {

    @Id
    @GeneratedValue
    private long faculty_id;

    @Column(name="name")
    protected String name;

    // I don't know if multiple "faculty" will break things
    /*@OneToMany(mappedBy="faculty")
    private Set<FieldOfStudy> fieldsOfStudy;

    @OneToMany(mappedBy="faculty")
    private Set<Professor> professors;

    @OneToMany(mappedBy="faculty")
    private Set<Clerk> clerks;*/




}