package pl.agh.wd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.agh.wd.model.CourseStudent;
import pl.agh.wd.model.CourseStudentKey;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseStudentRepository extends JpaRepository<CourseStudent, CourseStudentKey> {
    Optional<CourseStudent> findCourseStudentByStudentUserName(String name);
    List<CourseStudent> findAllByStudentId(long studentID);
}
