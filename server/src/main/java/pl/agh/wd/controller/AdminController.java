package pl.agh.wd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.agh.wd.payload.response.MessageResponse;
import pl.agh.wd.payload.response.PlatformInfoResponse;
import pl.agh.wd.repository.RoleRepository;
import pl.agh.wd.repository.UserRepository;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.ThreadInfo;
import java.lang.management.ThreadMXBean;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Admin related API
 *
 * @author howkymike
 */

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @GetMapping("/supersecret")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public String adminSecret() {
        return "You are powerful now :D";
    }

    @GetMapping("/platforminfo")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> platformInfo() {
        return ResponseEntity.ok(new PlatformInfoResponse());
    }
}
