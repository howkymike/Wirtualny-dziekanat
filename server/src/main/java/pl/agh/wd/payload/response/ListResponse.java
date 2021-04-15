package pl.agh.wd.payload.response;

import lombok.Getter;
import lombok.Setter;



@Getter
@Setter
public class ListResponse {
    private String type;
    private Iterable<?> list;

    public ListResponse(String type, Iterable<?> list) {
        this.type = type;
        this.list = list;
    }
}