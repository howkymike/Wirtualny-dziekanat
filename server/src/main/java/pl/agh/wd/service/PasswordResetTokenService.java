package pl.agh.wd.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.agh.wd.model.PasswordResetToken;
import pl.agh.wd.model.User;
import pl.agh.wd.repository.PasswordResetTokenRepository;

import java.util.Calendar;

@Service
@RequiredArgsConstructor
public class PasswordResetTokenService {

    @Autowired
    private final PasswordResetTokenRepository tokenRepository;

    public User getUserByToken(String token){
        return tokenRepository.findByToken(token).getUser();
    }

    public String validatePasswordResetToken(String token){
        final PasswordResetToken passwordResetToken = tokenRepository.findByToken(token);

        return !isTokenFound(passwordResetToken)? "invalidToken" :
                isTokenExpired(passwordResetToken)? "expired" : null;
    }

    private boolean isTokenExpired(PasswordResetToken token){
        final Calendar calendar = Calendar.getInstance();
        return token.getExpiryDate().before(calendar.getTime());
    }

    private boolean isTokenFound(PasswordResetToken token){ return token != null; }
}
