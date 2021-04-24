package pl.agh.wd.payload.response;

import lombok.Getter;
import lombok.Setter;
import pl.agh.wd.model.Clerk;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class ClerkResponse {
    @NotBlank
    private long facultyId;

    public ClerkResponse(Clerk clerk){
        facultyId = clerk.getFaculty().getFaculty_id();
    }
}
