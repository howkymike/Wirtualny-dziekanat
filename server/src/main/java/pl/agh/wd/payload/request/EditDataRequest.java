package pl.agh.wd.payload.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class EditDataRequest {
    @NotBlank
    private String email;

    @NotBlank
    private String country;

    @NotBlank
    private String city;

    @NotBlank
    private String address;

    @NotBlank
    private String telephone;

    @NotBlank
    private String postalCode;
}
