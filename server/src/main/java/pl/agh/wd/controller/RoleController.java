package pl.agh.wd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.agh.wd.payload.response.RolesResponse;
import pl.agh.wd.repository.RoleRepository;

@PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_CLERK')")
@RestController
@RequestMapping("/api/roles")
public class RoleController {

    @Autowired
    RoleRepository roleRepository;

    @GetMapping
    public ResponseEntity<?> getRoles(){
        return ResponseEntity.ok(new RolesResponse(roleRepository.findAll()));
    }
}
