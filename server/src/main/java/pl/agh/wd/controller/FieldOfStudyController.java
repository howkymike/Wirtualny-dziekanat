package pl.agh.wd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.agh.wd.repository.FieldOfStudyRepository;

@RestController
@RequestMapping("/api/fieldofstudy")
public class FieldOfStudyController {

    @Autowired
    FieldOfStudyRepository fieldOfStudyRepository;

    @GetMapping
    public ResponseEntity<?> getFaculties(){
        return ResponseEntity.ok(fieldOfStudyRepository.findAll());
    }


}
