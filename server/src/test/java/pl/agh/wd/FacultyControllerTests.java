package pl.agh.wd;

import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import pl.agh.wd.controller.FacultyController;
import pl.agh.wd.jwt.JwtAuthEntryPoint;
import pl.agh.wd.jwt.JwtUtils;
import pl.agh.wd.model.Faculty;
import pl.agh.wd.repository.*;

import static org.hamcrest.Matchers.*;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import pl.agh.wd.service.UserDetailsServiceImpl;

import java.util.Arrays;
import java.util.List;


@WebMvcTest(controllers = FacultyController.class)
public class FacultyControllerTests {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private JwtUtils jwtUtils;

    @MockBean
    private JwtAuthEntryPoint jwtAuthEntryPoint;

    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @MockBean
    private FacultyRepository facultyRepository;

    @Test
    @WithMockUser(username = "admin",password = "admin", roles={"ADMIN"})
    void givenFaculties_returnAllFacultiesObjects() throws Exception {
        Faculty iet = new Faculty("IET");
        Faculty gig = new Faculty("GiG");

        List<Faculty> allEmployees = Arrays.asList(iet, gig);

        given(facultyRepository.findAll()).willReturn(allEmployees);

        mvc.perform(get("/api/faculties")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                //.andDo(print())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is("IET")))
                .andExpect(jsonPath("$[1].name", is("GiG")));
    }
}
