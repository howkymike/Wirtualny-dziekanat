package pl.agh.wd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pl.agh.wd.model.Clerk;

import java.util.Optional;

@Repository
public interface ClerkRepository extends JpaRepository<Clerk, Long> {
    Optional<Clerk> findByUserUsername(String username);
}