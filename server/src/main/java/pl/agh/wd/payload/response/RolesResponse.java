package pl.agh.wd.payload.response;

import lombok.Getter;
import lombok.Setter;
import pl.agh.wd.model.Role;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class RolesResponse {

    private List<String> roles;

    public RolesResponse(List<Role> roles){
        this.roles = new ArrayList<>();

        for(Role role : roles){
            this.roles.add(role.getName().name());
        }
    }
}
