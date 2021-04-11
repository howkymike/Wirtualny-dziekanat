package pl.agh.wd.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.agh.wd.model.User;
import pl.agh.wd.payload.request.ChangePasswordRequest;
import pl.agh.wd.payload.request.ForgetPasswordRequest;
import pl.agh.wd.payload.response.MessageResponse;
import pl.agh.wd.repository.UserRepository;
import pl.agh.wd.service.MailService;
import pl.agh.wd.service.PasswordResetTokenService;
import pl.agh.wd.service.UserDetailsServiceImpl;

import javax.mail.MessagingException;
import javax.validation.Valid;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class ForgetPasswordController {

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final UserDetailsServiceImpl userDetailsService;

    @Autowired
    private final PasswordResetTokenService tokenService;

    @Autowired
    private final MailService mailService;

    @Value("${dziekanat.app.frontendUrl}")
    String frontendUrl;

    @PostMapping("/forgetPassword")
    public ResponseEntity<?> forgetPassword(@Valid @RequestBody ForgetPasswordRequest request){

        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());
        if(userOptional.isEmpty()){
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Uzytkownik o podanej nazwie nie istnieje."));
        }

        User user = userOptional.get();
        String token = UUID.randomUUID().toString();
        userDetailsService.createPasswordResetTokenForUser(user,token);

        try{
            String subject = "Wirtualny dziekanat - Zmiana hasła";
            mailService.sendMail(user.getEmail(), subject, createEmailText(user,token), true);
        }catch(MessagingException e){
            e.printStackTrace();
        }

        return ResponseEntity.ok(new MessageResponse("Link do zmiany hasła został wysłany."));
    }

    @PutMapping("/changePassword")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request){

        String isTokenValid = tokenService.validatePasswordResetToken(request.getToken());
        if(isTokenValid != null){
            return  ResponseEntity.badRequest()
                    .body(new MessageResponse("Link jest niepoprawny."));
        }

        User user = tokenService.getUserByToken(request.getToken());
        if(user != null){
            userDetailsService.changeUserPassword(user,request.getNewPassword());
            return ResponseEntity.ok(new MessageResponse("Hasło zostalo pomyslnie zmienione."));
        }else {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("user not found."));
        }
    }

    private String createEmailText(User user, String token){
        String url = "http://" + frontendUrl + "/changePassword/" + token;

        return (
                "<h3>Witaj " + user.getUsername() + " !</h3>" +
                "<p>Kliknij <a href=\"" + url +  "\">tutaj</a> aby zmienić hasło.</p>" +
                "<br/>" +
                "<div>**************************************************************</div>" +
                "<div>*      Wiadomość została wygenerowana automatycznie.      *</div>" +
                "<div>**************************************************************</div>"
        );
    }
}
