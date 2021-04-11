package pl.agh.wd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pl.agh.wd.model.FirstTimeToken;

import java.util.Optional;

@Repository 
public interface FirstTimeTokenRepository extends JpaRepository<FirstTimeToken, Long> {
    Optional<FirstTimeToken> findByToken(String token);
}
