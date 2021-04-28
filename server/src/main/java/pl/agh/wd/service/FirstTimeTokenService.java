package pl.agh.wd.service;

import lombok.RequiredArgsConstructor;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.agh.wd.model.User;
import pl.agh.wd.model.FirstTimeToken;
import pl.agh.wd.repository.FirstTimeTokenRepository;

@Service
@RequiredArgsConstructor
public class FirstTimeTokenService {
    
    @Autowired
    private final FirstTimeTokenRepository tokenRepository;

    public Optional<User> getUserByToken(String token){
        Optional<FirstTimeToken> fToken = tokenRepository.findByToken(token);
        return fToken.map(FirstTimeToken::getUser);
    }

}
