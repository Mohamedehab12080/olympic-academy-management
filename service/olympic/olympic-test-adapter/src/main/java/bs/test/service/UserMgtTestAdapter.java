package bs.test.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import bs.olympic.common.model.vto.ErrorVTO;
import bs.olympic.user.model.dto.LoginUserDTO;
import bs.olympic.user.model.vto.LoginUserVTO;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.RestClient;


import java.io.IOException;

import static bs.test.model.TestData.*;

public class UserMgtTestAdapter {
    private static final RestClient USER_MGT_REST_CLIENT = RestClient.create(USER_MGT_BASE_URL);
    private static final ObjectMapper mapper = new ObjectMapper();

    public static ErrorVTO readErrorVTO(ClientHttpResponse res) throws IOException {
        return mapper.readValue(res.getBody(), ErrorVTO.class);
    }

    public static LoginUserVTO login(String username, String password) {
        LoginUserDTO body = LoginUserDTO.builder().email(username)
                .password(password).build();

        ResponseEntity<LoginUserVTO> response = USER_MGT_REST_CLIENT.post().uri(LOGIN_API_PATH)
                .body(body).retrieve().toEntity(LoginUserVTO.class);
        return response.getBody();
    }

    public static LoginUserVTO loginAsSuperAdmin() {
        LoginUserDTO body = LoginUserDTO.builder().email(SUPER_ADMIN_EMAIL)
                .password(SUPER_ADMIN_PASSWORD).build();

        ResponseEntity<LoginUserVTO> response = USER_MGT_REST_CLIENT.post().uri(LOGIN_API_PATH)
                .body(body).retrieve().toEntity(LoginUserVTO.class);
        return response.getBody();
    }

}
