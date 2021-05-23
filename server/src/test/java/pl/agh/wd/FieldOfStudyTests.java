package pl.agh.wd;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import pl.agh.wd.controller.FieldOfStudyController;
import pl.agh.wd.model.*;
import pl.agh.wd.repository.*;
import java.util.List;
import java.util.Optional;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class FieldOfStudyTests {


    @Autowired
    private FieldOfStudyRepository fieldOfStudyRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private FieldOfStudyController fieldOfStudyController;

    @Test
    @WithMockUser(username = "admin", roles={"ADMIN"})
    void testGetFaculties() {

        Faculty newFaculty = new Faculty();
        newFaculty.setName("FOStestFaculty");

        Optional <Faculty> optionalFaculty = facultyRepository.findByName("FOStestFaculty");
        assert(optionalFaculty.isEmpty());

        facultyRepository.save(newFaculty);

        optionalFaculty = facultyRepository.findByName("FOStestFaculty");
        assert(optionalFaculty.isPresent());

        FieldOfStudy newFOS = new FieldOfStudy();
        newFOS.setFaculty(newFaculty);
        newFOS.setName("FOStestFOS");

        Optional<FieldOfStudy> optionalFOS = fieldOfStudyRepository.findByName("FOStestFOS");
        assert(optionalFOS.isEmpty());

        fieldOfStudyRepository.save(newFOS);

        optionalFOS = fieldOfStudyRepository.findByName("FOStestFOS");
        assert(optionalFOS.isPresent());


        List<FieldOfStudy> FOSList = fieldOfStudyRepository.findAll();
        assert(!FOSList.isEmpty());

        boolean found = false;
        for (FieldOfStudy fos  : FOSList) {
            if (fos.getName().equals("FOStestFOS")) {
                found = true;
                break;
            }
        }
        assert(found);

        found = false;
        ResponseEntity<?> responseEntity = fieldOfStudyController.getFaculties();
        List<FieldOfStudy> lista = (List<FieldOfStudy>) responseEntity.getBody();
        assert(lista != null);
        assert(!lista.isEmpty());
        for (FieldOfStudy fos  : lista) {
            System.out.println(fos.getName());
            if (fos.getName().equals("FOStestFOS")) {
                found = true;
                break;
            }
        }
        assert(found);
        assert(responseEntity.getStatusCode().toString().equals("200 OK"));


    }


}


