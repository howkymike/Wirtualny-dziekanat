package pl.agh.wd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.agh.wd.repository.FacultyRepository;

@RestController
@RequestMapping("/api/faculties")
public class FacultyController {

    @Autowired
    FacultyRepository facultyRepository;

    @GetMapping
    public ResponseEntity<?> getFaculties(){
        return ResponseEntity.ok(facultyRepository.findAll());
    }

}
