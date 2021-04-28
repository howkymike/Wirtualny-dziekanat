package pl.agh.wd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.agh.wd.model.CourseStudent;
import pl.agh.wd.model.CourseStudentKey;

@Repository
public interface CourseStudentRepository extends JpaRepository<CourseStudent, CourseStudentKey> {

}
