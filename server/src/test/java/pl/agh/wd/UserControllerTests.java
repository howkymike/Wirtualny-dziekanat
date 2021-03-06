package pl.agh.wd;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.transaction.annotation.Transactional;
import pl.agh.wd.controller.UserController;
import pl.agh.wd.model.*;
import pl.agh.wd.payload.request.UpdateClerkRequest;
import pl.agh.wd.payload.request.UpdateLecturerRequest;
import pl.agh.wd.payload.request.UpdateStudentRequest;
import pl.agh.wd.payload.request.UpdateUserRequest;
import pl.agh.wd.repository.*;
import java.util.Collections;
import java.util.Objects;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UserControllerTests {

    @Autowired
    private UserController controller;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ClerkRepository clerkRepository;

    @Autowired
    private LecturerRepository lecturerRepository;


    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Test
    void contextLoads() {
        assertThat(controller).isNotNull();
    }

    @Test
    @WithMockUser(username = "admin", roles={"ADMIN"})
    void indexFunctionTest() {

        {
            String type = "student";
            ResponseEntity<?> response = controller.index(type);
            assert(Objects.requireNonNull(response.getBody()).toString().contains("pl.agh.wd.payload.response.ListResponse"));
            assert(response.getStatusCode().toString().equals("200 OK"));
        }

        {
            String type = "clerk";
            ResponseEntity<?> response = controller.index(type);
            assert(Objects.requireNonNull(response.getBody()).toString().contains("pl.agh.wd.payload.response.ListResponse"));
            assert(response.getStatusCode().toString().equals("200 OK"));
        }

        {
            String type = "lecturer";
            ResponseEntity<?> response = controller.index(type);
            assert(Objects.requireNonNull(response.getBody()).toString().contains("pl.agh.wd.payload.response.ListResponse"));
            assert(response.getStatusCode().toString().equals("200 OK"));
        }

        {
            String type = "ayaya";
            ResponseEntity<?> response = controller.index(type);
            assert(Objects.requireNonNull(response.getBody()).toString().contains("pl.agh.wd.payload.response.SuccessResponse"));
            assert(response.getStatusCode().toString().equals("400 BAD_REQUEST"));
        }

        {
            String type = "";
            ResponseEntity<?> response = controller.index(type);
            assert(Objects.requireNonNull(response.getBody()).toString().contains("pl.agh.wd.payload.response.SuccessResponse"));
            assert(response.getStatusCode().toString().equals("400 BAD_REQUEST"));
        }

        {
            String type = "student1";
            ResponseEntity<?> response = controller.index(type);
            assert(Objects.requireNonNull(response.getBody()).toString().contains("pl.agh.wd.payload.response.SuccessResponse"));
            assert(response.getStatusCode().toString().equals("400 BAD_REQUEST"));
        }
    }

    @Test
    @WithMockUser(username = "admin", roles={"ADMIN"})
    void updateUserFailTest() {

        {
            Optional<User> optionalUser = userRepository.findById(9999999L);
            assert(optionalUser.isEmpty());

            UpdateUserRequest updateRequest = new UpdateUserRequest();
            updateRequest.setId(9999999L);
            ResponseEntity<?> response = controller.updateUser(updateRequest, 9999999L);

            assert(Objects.requireNonNull(response.getBody()).toString().contains("pl.agh.wd.payload.response.MessageResponse"));
            assert(response.getStatusCode().toString().equals("400 BAD_REQUEST"));
        }

    }

    @Test
    @Transactional
    @WithMockUser(username = "admin", roles={"ADMIN"})
    void updateUserRoleTest() {
        {
            User user = new User("bogdanobanani", "deluxe@gmail.com", encoder.encode("zloto"));
            userRepository.save(user);
            {
                Optional<User> userOptional = userRepository.findByUsername("bogdanobanani");
                assert(userOptional.isPresent());

                Optional<Student> optionalStudent = studentRepository.findByUserUsername(userOptional.get().getUsername());
                assert(optionalStudent.isEmpty());

                Optional<Lecturer> optionalLecturer = lecturerRepository.findByUserUsername(userOptional.get().getUsername());
                assert(optionalLecturer.isEmpty());

                Optional<Clerk> optionalClerk = clerkRepository.findByUserUsername(userOptional.get().getUsername());
                assert(optionalClerk.isEmpty());

                String telephone = userOptional.get().getTelephone();
                String postalCode = userOptional.get().getPostalCode();
                String country = userOptional.get().getCountry();
                String city = userOptional.get().getCity();
                String address = userOptional.get().getAddress();

                assert(telephone == null);
                assert(postalCode == null);
                assert(country == null);
                assert(city == null);
                assert(address == null);
                assert(userOptional.get().getEmail().equals("deluxe@gmail.com"));

                UpdateUserRequest updateRequest = new UpdateUserRequest();
                updateRequest.setTelephone("123");
                updateRequest.setPostalCode("456");
                updateRequest.setCountry("nowa wies");
                updateRequest.setCity("polska");
                updateRequest.setAddress("myslenice");
                updateRequest.setId(userOptional.get().getId());
                updateRequest.setUsername("bogdanobananideluxe");
                updateRequest.setEmail("silentdisco@gmail.com");
                updateRequest.setName("bogaty");
                updateRequest.setSurname("fchu");

                updateRequest.setRoles(Collections.singleton("ROLE_STUDENT"));
                UpdateStudentRequest studentRequest = new UpdateStudentRequest();
                studentRequest.setIndex(304294);
                updateRequest.setStudent(studentRequest);
                ResponseEntity<?> responseStudent = controller.updateUser(updateRequest, 0L);
                assert(Objects.requireNonNull(responseStudent.getBody()).toString().contains("pl.agh.wd.payload.response.MessageResponse"));
                assert(responseStudent.getStatusCode().toString().equals("200 OK"));
                Optional<User> userOptionalAfter = userRepository.findByUsername("bogdanobananideluxe");
                assert(userOptionalAfter.isPresent());
                assert(userOptionalAfter.get().getTelephone().equals("123"));
                assert(userOptionalAfter.get().getPostalCode().equals("456"));
                assert(userOptionalAfter.get().getCountry().equals("nowa wies"));
                assert(userOptionalAfter.get().getCity().equals("polska"));
                assert(userOptionalAfter.get().getAddress().equals("myslenice"));
                assert(userOptionalAfter.get().getUsername().equals("bogdanobananideluxe"));
                assert(userOptionalAfter.get().getEmail().equals("silentdisco@gmail.com"));
                assert(userOptionalAfter.get().getName().equals("bogaty"));
                assert(userOptionalAfter.get().getSurname().equals("fchu"));

                Optional<Student> optionalStudentAfter = studentRepository.findById(userOptionalAfter.get().getId());
                assert(optionalStudentAfter.isPresent());
                assert(optionalStudentAfter.get().getIndex() == 304294);
                updateRequest.setStudent(null);

                UpdateClerkRequest clerkRequest = new UpdateClerkRequest();
                clerkRequest.setFacultyId(1L);
                Optional<Faculty> optionalFaculty = facultyRepository.findById(1L);
                assert(optionalFaculty.isPresent());

                updateRequest.setClerk(clerkRequest);
                updateRequest.setRoles(Collections.singleton("ROLE_CLERK"));

                ResponseEntity<?> responseClerk = controller.updateUser(updateRequest, 99999L);
                assert(Objects.requireNonNull(responseClerk.getBody()).toString().contains("pl.agh.wd.payload.response.MessageResponse"));
                assert(responseClerk.getStatusCode().toString().equals("200 OK"));

                Optional<Clerk> optionalClerkAfter = clerkRepository.findById(userOptionalAfter.get().getId());
                assert(optionalClerkAfter.isPresent());
                assert(optionalClerkAfter.get().getFaculty().getId() == 1L);
                updateRequest.setClerk(null);
                updateRequest.setStudent(null);

                UpdateLecturerRequest lecturerRequest = new UpdateLecturerRequest();
                lecturerRequest.setFacultyId(1L);
                lecturerRequest.setTitle("***pHD");

                Optional<User> optionalUserForLecturer = userRepository.findByUsername("bogdanobananideluxe");
                assert(optionalUserForLecturer.isPresent());
                updateRequest.setId(optionalUserForLecturer.get().getId());
                updateRequest.setLecturer(lecturerRequest);
                updateRequest.setRoles(null);
                updateRequest.setRoles(Collections.singleton("ROLE_LECTURER"));

                ResponseEntity<?> responseLecturer = controller.updateUser(updateRequest, 99999L);

                assert(Objects.requireNonNull(responseLecturer.getBody()).toString().contains("pl.agh.wd.payload.response.MessageResponse"));
                assert(responseLecturer.getStatusCode().toString().equals("200 OK"));

                Optional<Lecturer> optionalLecturerAfter = lecturerRepository.findById(optionalUserForLecturer.get().getId());
                assert(optionalLecturerAfter.isPresent());
                assert(optionalLecturerAfter.get().getFaculty().getId() == 1L);
                assert(optionalLecturerAfter.get().getTitle().equals("***pHD"));

            }
        }
    }

    @Test
    @WithMockUser(username = "admin", roles={"ADMIN"})
    void deleteUserTest() {

        {
            Optional<User> optionalUser = userRepository.findById(9999999L);
            assert(optionalUser.isEmpty());

            ResponseEntity<?> response = controller.deleteUser(9999999L);

            assert(Objects.requireNonNull(response.getBody()).toString().contains("pl.agh.wd.payload.response.MessageResponse"));
            assert(response.getStatusCode().toString().equals("400 BAD_REQUEST"));
        }
        {
            User user = new User("boromir", "gondor@gmail.com", encoder.encode("seanbean"));
            userRepository.save(user);
            {
                Optional<User> optionalUser = userRepository.findByUsername("boromir");
                assert(optionalUser.isPresent());
                ResponseEntity<?> response = controller.deleteUser(optionalUser.get().getId());
                assert(Objects.requireNonNull(response.getBody()).toString().contains("pl.agh.wd.payload.response.MessageResponse"));
                assert(response.getStatusCode().toString().equals("200 OK"));
                Optional<User> deletedUser = userRepository.findByUsername("boromir");
                assert(deletedUser.isEmpty());
            }
        }
    }

    @Test
    @WithMockUser(username = "admin", roles={"ADMIN"})
    void getUserTest() {

        User newUser = new User();
        newUser.setIsNew(false);
        newUser.setUsername("GetUserTestUser");

        userRepository.save(newUser);

        Optional<User> OptionalGetUserTestUser = userRepository.findByUsername("GetUserTestUser");
        assert(OptionalGetUserTestUser.isPresent());

        ResponseEntity<?> responseEntity = controller.getUser(OptionalGetUserTestUser.get().getId());

        assert(responseEntity.getStatusCode().toString().equals("200 OK"));
        assert(Objects.requireNonNull(responseEntity.getBody()).toString().contains("pl.agh.wd.payload.response.UserResponse"));

        Optional<User> OptionalGetUserTestUserN = userRepository.findById(99999L); // super pomys?? generalnie :)
        assert(OptionalGetUserTestUserN.isEmpty());

        ResponseEntity<?> badResponseEntity = controller.getUser(99999L);

        System.out.println(badResponseEntity.getStatusCode());
        System.out.println(badResponseEntity.getBody());
        assert(badResponseEntity.getStatusCode().toString().equals("400 BAD_REQUEST"));
        assert(Objects.requireNonNull(badResponseEntity.getBody()).toString().contains("pl.agh.wd.payload.response.SuccessResponse"));

    }

    @Test
    @WithMockUser(username = "notAdmin", roles={""})
    void getUserTestNonAdmin() {

        boolean caught = false;

        try {
            controller.getUser(1L);
        }
        catch (Exception e)
        {
            caught = true;
            assert(e.getMessage().equals("Access is denied"));
        }
        assert(caught);


    }

    @Test
    @WithMockUser(username = "admin", roles={"ADMIN"})
    void getDataTestWithAdmin() {

        ResponseEntity<?> response = controller.getData("");
        assert(response != null);
        assert(Objects.requireNonNull(response.getBody()).toString().contains("pl.agh.wd.model.User"));
        assert(response.getStatusCode().toString().equals("200 OK"));

    }

    @Test
    @WithMockUser(username = "aaa", roles={""})
    void getDataTestWithBS() {

        ResponseEntity<?> response = controller.getData("");
        assert(Objects.requireNonNull(response.getBody()).toString().contains("pl.agh.wd.payload.response.MessageResponse"));
        assert(response.getStatusCode().toString().equals("400 BAD_REQUEST"));

    }

    @Test
    void getDataTestWithNoUser() {
        try{
            controller.getData("");
            assert(false);
        }
        catch (NullPointerException e)
        {
            assert(e.getMessage() == null);
        }

    }


}


