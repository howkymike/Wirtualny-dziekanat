package pl.agh.wd.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Admin related API
 *
 * @author howkymike
 */

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/supersecret")
    @PreAuthorize("hasRole('STUDENT')")
    public String adminSecret() {
        return "You are powerful now :D";
    }
}
