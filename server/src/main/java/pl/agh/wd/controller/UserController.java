package pl.agh.wd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import pl.agh.wd.model.*;
import pl.agh.wd.payload.request.UpdateUserRequest;
import pl.agh.wd.payload.response.ListResponse;
import pl.agh.wd.payload.response.MessageResponse;
import pl.agh.wd.payload.response.SuccessResponse;
import pl.agh.wd.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

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
    public ResponseEntity<?> putUser(@RequestBody UpdateUserRequest request, @PathVariable Long userId) {
        User user = userService.getUserById(request.getId());

        if(user == null) {
            return  ResponseEntity.badRequest().body(new MessageResponse("User id is invalid."));
        }
        else {
            userService.updateUser(user, request);
            return ResponseEntity.ok(new MessageResponse("User updated."));
        }
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
}
