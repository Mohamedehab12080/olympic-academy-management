package bs.lib.test.sql.db.adapter;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import bs.lib.test.core.service.IntegrationTestService;
import bs.lib.test.sql.db.adapter.model.dto.AutoIncTableDTO;
import bs.lib.test.sql.db.adapter.model.entity.AutoIncTable;
import bs.lib.test.sql.db.adapter.repository.jpa.AutoIncTableJPARepository;

import java.io.IOException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static bs.lib.sql.db.adapter.model.enums.SQLDatabaseAdapterErrors.FIELD_NOT_UPDATABLE;
import static bs.lib.test.sql.db.adapter.common.SQLScripts.CLEAR_DATABASE;
import static bs.lib.test.sql.db.adapter.common.SQLScripts.DB_CONFIG_TEST_INSERT_RECORD;

@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "bs.lib.sql-db-adapter.entities\"[AutoIncTable]\".attributes\"[code]\".title-en=Code",
                "bs.lib.sql-db-adapter.entities\"[AutoIncTable]\".attributes\"[code]\".is-updatable=false"
        })

public class IsUpdatableConfigAutoIncConfigTest {

    private final String API_PATH = "/test/inc/auto";
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private AutoIncTableJPARepository jpaRepository;

    @LocalServerPort
    private int port;
    private RestClient restClient;

    private static AutoIncTableDTO REQUEST_DTO;

    @BeforeEach
    public void setup() {
        restClient = RestClient.create("http://localhost:" + port);
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        REQUEST_DTO = AutoIncTableDTO.builder()
                .titleEn("Unique Config")
                .titleAr("اعداد فريد")
                .code("UNIQUE001")
                .build();
    }


    // ==================== UPDATE TESTS (using POST with ID) ====================

    @Test
    @Sql(scripts = CLEAR_DATABASE, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(scripts = DB_CONFIG_TEST_INSERT_RECORD, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    void test_isUpdatableFalse_updateCode_fail() throws IOException {

        REQUEST_DTO.setId(1);
        REQUEST_DTO.setCode("AAAA");

        RestClientResponseException ex = assertThrows(RestClientResponseException.class,
                () -> restClient.post()
                        .uri(API_PATH)
                        .body(REQUEST_DTO)
                        .retrieve()
                        .toBodilessEntity());

        String expectedMsg="Failed to Update 'AutoIncTable', due to 'Code' aren't updatable attributes";
        IntegrationTestService.assertBadRequest(ex, FIELD_NOT_UPDATABLE, expectedMsg);
    }

    @Test
    @Sql(scripts = CLEAR_DATABASE, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(scripts = DB_CONFIG_TEST_INSERT_RECORD, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    void test_defaultIsUpdatable_updateTitleEn_success() {
        REQUEST_DTO.setId(1);
        REQUEST_DTO.setTitleEn("Updated Title En");
        REQUEST_DTO.setCode("CODE001");

        Integer savedId= restClient.post()
                .uri(API_PATH)
                .body(REQUEST_DTO)
                .retrieve()
                .body(Integer.class);

        List<AutoIncTable> allRecords= jpaRepository.findAll();
        assertEquals(1, allRecords.size());
        assertTrue(allRecords.stream().anyMatch(e->e.getId().equals(savedId)),"Failed to update AutoIncTable for titleEn");

    }

    @Test
    @Sql(scripts = CLEAR_DATABASE, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    void test_isUpdatableFalse_updateCode_nullValue_success() {

        REQUEST_DTO.setCode(null);

        Integer createdId = restClient.post()
                .uri(API_PATH)
                .body(REQUEST_DTO)
                .retrieve()
                .body(Integer.class);

        REQUEST_DTO.setId(createdId);
        REQUEST_DTO.setCode("NEWCODE300");

        restClient.post()
                .uri(API_PATH)
                .body(REQUEST_DTO)
                .retrieve()
                .toBodilessEntity();
        List<AutoIncTable> found= jpaRepository.findAll();
        assertTrue(found.stream().anyMatch(t -> t.getId().equals(REQUEST_DTO.getId())),"Failed to update AutoIncTable after null code");

    }
}
