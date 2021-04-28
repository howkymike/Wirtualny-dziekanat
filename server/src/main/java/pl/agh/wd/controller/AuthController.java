package pl.agh.wd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import pl.agh.wd.payload.request.ChangeActualPasswordRequest;
import pl.agh.wd.payload.request.FirstTimeRequest;
import pl.agh.wd.payload.request.LoginRequest;
import pl.agh.wd.payload.request.RegisterRequest;
import pl.agh.wd.payload.response.FirstTimeResponse;
import pl.agh.wd.payload.response.JwtResponse;
import pl.agh.wd.payload.response.MessageResponse;
import pl.agh.wd.payload.response.SuccessResponse;
import pl.agh.wd.jwt.JwtUtils;
import pl.agh.wd.model.FirstTimeToken;
import pl.agh.wd.model.Role;
import pl.agh.wd.model.RoleEnum;
import pl.agh.wd.model.User;
import pl.agh.wd.repository.RoleRepository;
import pl.agh.wd.repository.UserRepository;
import pl.agh.wd.repository.FirstTimeTokenRepository;
import pl.agh.wd.service.UserDetailsImpl;
import pl.agh.wd.service.FirstTimeTokenService;

import javax.validation.Valid;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.UUID;


/**
 * Responsible for handling login and register calls
 *
 * @author howkymike
 * @author FEJTWOW
 */

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final String[] REGISTER_PRIVILEGE_ROLES = {"ROLE_ADMIN"};

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    private FirstTimeTokenService tokenService;

    @Autowired
    FirstTimeTokenRepository tokenRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        if(!userDetails.isNew()) {
            return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles
            ));
        } else {
            Optional<User> userOptional = userRepository.findById(userDetails.getId());

            if(userOptional.isPresent()) {
                FirstTimeToken token = new FirstTimeToken(UUID.randomUUID().toString(), userOptional.get());

                tokenRepository.save(token);

                return ResponseEntity.ok(new FirstTimeResponse(
                    token.getToken()
                ));
            } else 
                return ResponseEntity.badRequest().body(new SuccessResponse(false, "User not found"));
          
        }
    }

    @PostMapping("/firsttime")
    public ResponseEntity<?> firstTime(@Valid @RequestBody FirstTimeRequest request) {
        Optional<User> user = tokenService.getUserByToken(request.getToken());
        
        if(!user.isPresent()) {
            return ResponseEntity.badRequest()
                    .body(new SuccessResponse(false, "Wrong link"));
        }

        if(!request.getPassword().equals(request.getPassword2())) {
            return ResponseEntity.badRequest()
                    .body(new SuccessResponse(false, "Passwords are diffrent"));
        }
        

        User usr = user.get();

        usr.setPassword(encoder.encode(request.getPassword()));
        usr.setIsNew(false);

        userRepository.save(usr);

        return ResponseEntity.ok(new SuccessResponse(true, "Password changed"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {

        boolean privUser = false;
        Object currentPrincipal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(currentPrincipal instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) currentPrincipal;
            privUser = userDetails.getAuthorities().stream()
                    .anyMatch(r -> Arrays.asList(REGISTER_PRIVILEGE_ROLES).contains(r.getAuthority()));
        }
        if(!privUser)
            return ResponseEntity.
                    badRequest().
                    body(new MessageResponse("Error: You do not have power to create people!"));

        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(RoleEnum.ROLE_STUDENT)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(RoleEnum.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    case "lecturer":
                        Role modRole = roleRepository.findByName(RoleEnum.ROLE_LECTURER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);

                        break;
                    default:
                        Role userRole = roleRepository.findByName(RoleEnum.ROLE_STUDENT)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Success: User has been registered."));
    }

    @PostMapping("/changeactualpassword")
    public ResponseEntity<?> changeActualPassword(@Valid @RequestBody ChangeActualPasswordRequest request) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String username = "";
        if (principal instanceof UserDetails) {
            username = ((UserDetails)principal).getUsername();
        } else {
            username = principal.toString();
        }

        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (encoder.matches(request.getActualPassword(),user.getPassword())) {
                if (request.getNewPassword().equals(request.getSecondNewPassword())) {
                    user.setPassword(encoder.encode(request.getNewPassword()));
                    userRepository.save(user);
                    return ResponseEntity.ok().body(new MessageResponse("Success: Password changed"));
                }
                return ResponseEntity.badRequest().body(new MessageResponse("Fail: Passwords are different"));
            }
            return ResponseEntity.badRequest().body(new MessageResponse("Fail: Actual password doesnt match to user password"));
        }
        return ResponseEntity.badRequest().body(new MessageResponse("Fail: You are not loged in"));
    }
}
