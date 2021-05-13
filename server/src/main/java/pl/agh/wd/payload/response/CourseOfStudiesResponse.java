package pl.agh.wd.payload.response;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import java.util.Set;

@Getter
@Setter
public class CourseOfStudiesResponse {
    /*
    - id    v
    - imie  v
    - nazwisko  v
    - nr albumu v
    - wydział/y
    - kierunek/ki
    - poziom studiów ?      add to model
    - data rozpoczęcia studiów      add to model
     */

    @NotBlank
    private long id;

    @NotBlank
    private String name;

    @NotBlank
    private String surname;

    @NotBlank
    private int index;

    private Set<String> faculties;

    private Set<String> fieldsOfStudies;

    private String levelOfStudies;

    private String commencmentOfStudies;

}
