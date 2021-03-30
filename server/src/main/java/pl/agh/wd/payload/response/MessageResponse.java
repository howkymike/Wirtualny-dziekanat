package pl.agh.wd.payload.response;

import lombok.Getter;
import lombok.Setter;

/**
 * Handles API responses
 *
 * @author: howkymike
 */

@Getter
@Setter
public class MessageResponse {
    private String message;

    public MessageResponse(String message) {
        this.message = message;
    }
}
