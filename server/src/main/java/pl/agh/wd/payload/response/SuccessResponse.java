package pl.agh.wd.payload.response;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class SuccessResponse {
    private boolean ok;
    private String msg;

    public SuccessResponse(boolean ok, String msg) {
        this.ok = ok;
        this.msg = msg;
    }
}
