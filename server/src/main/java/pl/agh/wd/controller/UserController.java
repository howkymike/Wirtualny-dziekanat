package pl.agh.wd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import pl.agh.wd.model.User;
import pl.agh.wd.payload.request.EditDataRequest;
import pl.agh.wd.payload.request.UpdateUserRequest;
import pl.agh.wd.payload.response.ListResponse;
import pl.agh.wd.payload.response.MessageResponse;
import pl.agh.wd.payload.response.SuccessResponse;
import pl.agh.wd.repository.UserRepository;
import pl.agh.wd.service.UserService;

import java.util.Optional;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    UserRepository userRepository;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/{type}")
    public ResponseEntity<?> index(@PathVariable("type") String type) {

        switch(type) {
            case "student":
                return ResponseEntity.ok(new ListResponse(type, userService.getStudentList()));
            
            case "clerk":
                return ResponseEntity.ok(new ListResponse(type, userService.getClerkList()));

            case "professor":
                return ResponseEntity.ok(new ListResponse(type, userService.getProfessorList()));

        }

        return ResponseEntity.ok(new SuccessResponse(false, "DDD"));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@RequestBody UpdateUserRequest request, @PathVariable Long userId) {
        User user = userService.getUserById(request.getId());

        if(user == null) {
            return  ResponseEntity.badRequest().body(new MessageResponse("User id is invalid."));
        }
        else {
            userService.updateUser(user, request);
            return ResponseEntity.ok(new MessageResponse("User updated."));
        }
    }

    @PatchMapping("/update")
    public ResponseEntity<?> updateData(@Valid @RequestBody EditDataRequest request) {
        if(request.getEmail().isBlank() || request.getCountry().isBlank() || request.getCity().isBlank() ||
            request.getAddress().isBlank() || request.getPostalCode().isBlank() || request.getTelephone().isBlank())
            return ResponseEntity.badRequest().body(new MessageResponse("Uzupełnij wszystkie pola"));

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Optional<User> userOptional = userService.findByUsername(userDetails.getUsername());

        if (!userOptional.isPresent())
            return ResponseEntity.badRequest().body(new MessageResponse("Nie jesteś zalogowany"));

        User user = userOptional.get();

        user.setEmail(request.getEmail());
        user.setCountry(request.getCountry());
        user.setCity(request.getCity());
        user.setAddress(request.getAddress());
        user.setTelephone(request.getTelephone());
        user.setPostalCode(request.getPostalCode());

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Zaktualizowano dane"));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId){
        User user = userService.getUserById(userId);

        if(user == null){
            return  ResponseEntity.badRequest().body(new MessageResponse("User id is invalid."));
        }else{
            userService.deleteUser(user);
            return ResponseEntity.ok(new MessageResponse("User deleted."));
        }
    }

    @GetMapping("/{type}/me")
    public ResponseEntity<?> getData(@PathVariable("type") String type)
    {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = "";
        if (principal instanceof UserDetails) {
            username = ((UserDetails)principal).getUsername();
        } else {
            username = principal.toString();
        }
        Optional<User> userOptional = userService.findByUsername(username);
        if (userOptional.isPresent())
            return ResponseEntity.ok(userOptional.get());
        return ResponseEntity.badRequest().body(new MessageResponse("User not authorized"));
    }
}
