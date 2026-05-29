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
import bs.lib.test.sql.db.adapter.model.dto.NonAutoIncTableDTO;
import bs.lib.test.sql.db.adapter.model.entity.NonAutoIncTable;
import bs.lib.test.sql.db.adapter.repository.jpa.NonAutoIncTableJPARepository;

import java.io.IOException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static bs.lib.sql.db.adapter.model.enums.SQLDatabaseAdapterErrors.FIELD_NOT_UPDATABLE;
import static bs.lib.test.sql.db.adapter.common.SQLScripts.CLEAR_DATABASE;
import static bs.lib.test.sql.db.adapter.common.SQLScripts.DB_CONFIG_TEST_INSERT_RECORD;

@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "bs.lib.sql-db-adapter.entities\"[NonAutoIncTable]\".attributes\"[code]\".title-en=Code",
                "bs.lib.sql-db-adapter.entities\"[NonAutoIncTable]\".attributes\"[code]\".is-unique=true",
                "bs.lib.sql-db-adapter.entities\"[NonAutoIncTable]\".attributes\"[code]\".is-updatable=false",
        })
public class IsUpdatableConfigNonAutoIncConfigTest {

    private final String API_PATH = "/test/non/inc/auto";
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private NonAutoIncTableJPARepository jpaRepository;

    @LocalServerPort
    private int port;
    private RestClient restClient;

    private static NonAutoIncTableDTO REQUEST_DTO;

    @BeforeEach
    public void setup() {
        restClient = RestClient.create("http://localhost:" + port);
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        REQUEST_DTO = NonAutoIncTableDTO.builder()
                .id(1)
                .titleEn("Unique Config")
                .titleAr("اعداد فريد")
                .code("UNIQUE001")
                .build();
    }



    // ==================== UPDATE TESTS ====================

    @Test
    @Sql(scripts = CLEAR_DATABASE, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(scripts = DB_CONFIG_TEST_INSERT_RECORD, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    void test_isUpdatableFalse_updateCode_fail() throws IOException {

        RestClientResponseException ex = assertThrows(RestClientResponseException.class,
                () -> restClient.post()
                        .uri(API_PATH)
                        .body(REQUEST_DTO)
                        .retrieve()
                        .toBodilessEntity());

        String expectedMsg="Failed to Update 'NonAutoIncTable', due to 'Code' aren't updatable attributes";
        IntegrationTestService.assertBadRequest(ex, FIELD_NOT_UPDATABLE,expectedMsg);
    }

    @Test
    @Sql(scripts = CLEAR_DATABASE, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(scripts = DB_CONFIG_TEST_INSERT_RECORD, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    void test_defaultIsUpdatable_updateTitleEn_success() {

        REQUEST_DTO.setTitleEn("Updated Title En");
        REQUEST_DTO.setCode("CODE001");
        restClient.post()
                .uri(API_PATH)
                .body(REQUEST_DTO)
                .retrieve().toBodilessEntity();

       Optional<NonAutoIncTable> nonAutoInc = jpaRepository.findById(REQUEST_DTO.getId());
       assertTrue(nonAutoInc.isPresent());
       assertEquals(REQUEST_DTO.getId(),nonAutoInc.get().getId(), "Failed to update non-auto-inc table");
    }

    @Test
    @Sql(scripts = CLEAR_DATABASE, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    void testCreateWithNullCode_UpdateWithCode_Success() {
        REQUEST_DTO.setCode(null);
        restClient.post()
                .uri(API_PATH)
                .body(REQUEST_DTO)
                .retrieve().toBodilessEntity();

        REQUEST_DTO.setCode("NEWCODE300");
        restClient.post()
                .uri(API_PATH)
                .body(REQUEST_DTO)
                .retrieve().toBodilessEntity();

        Optional<NonAutoIncTable> nonAutoInc = jpaRepository.findById(REQUEST_DTO.getId());
        assertTrue(nonAutoInc.isPresent());
        assertEquals(REQUEST_DTO.getId(), nonAutoInc.get().getId() ,"Failed to update non-auto-inc table after null code");
    }

}
