package pl.agh.wd.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pl.agh.wd.model.Clerk;
import pl.agh.wd.model.Professor;
import pl.agh.wd.model.Student;
import pl.agh.wd.repository.ClerkRepository;
import pl.agh.wd.repository.ProfessorRepository;
import pl.agh.wd.repository.StudentRepository;

@Service
public class UserService {
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ClerkRepository clerkRepository;

    @Autowired
    private ProfessorRepository professorRepository;
    
    public Iterable<Student> getStudentList() {
        return studentRepository.findAll();
    }

    public Iterable<Clerk> getClerkList() {
        return clerkRepository.findAll();
    }

    public Iterable<Professor> getProfessorList() {
        return professorRepository.findAll();
    }
}
