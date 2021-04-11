package pl.agh.wd.payload.response;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class FirstTimeResponse {
    private boolean firstTime;
    private String token;

    public FirstTimeResponse(String token) {
        this.firstTime = true;
        this.token = token;
    } 
}
