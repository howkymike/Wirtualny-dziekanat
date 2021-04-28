package pl.agh.wd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.agh.wd.model.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

}
