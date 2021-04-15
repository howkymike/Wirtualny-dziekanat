package pl.agh.wd.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import pl.agh.wd.model.Clerk;

@Repository
public interface ClerkRepository extends CrudRepository<Clerk, Long> {
    
}