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
import static bs.lib.sql.db.adapter.model.enums.SQLDatabaseAdapterErrors.*;
import static bs.lib.test.sql.db.adapter.common.SQLScripts.*;

@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "bs.lib.sql-db-adapter.entities\"[AutoIncTable]\".attributes\"[code]\".title-en=Code",
                "bs.lib.sql-db-adapter.entities\"[AutoIncTable]\".attributes\"[code]\".is-unique=true",
                "bs.lib.sql-db-adapter.entities\"[AutoIncTable]\".attributes\"[titleAr]\".is-unique=false"
        })
public class IsUniqueConfigAutoIncConfigTest {

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

    // ==================== CREATE TESTS ====================

    @Test
    @Sql(scripts = CLEAR_DATABASE, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(scripts = DB_CONFIG_TEST_INSERT_RECORD, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    void test_isUniqueTrue_codeDuplicate_fail() throws IOException {

        REQUEST_DTO.setCode("CODE001"); // duplicated code
        RestClientResponseException ex = assertThrows(RestClientResponseException.class,
                () -> restClient.post()
                        .uri(API_PATH)
                        .body(REQUEST_DTO)
                        .retrieve()
                        .toBodilessEntity());

        String expectedMsg="Failed to Create 'AutoIncTable', due to Code 'CODE001' already exists";
        System.out.println(ex.getMessage());
        IntegrationTestService.assertBadRequest(ex, UNIQUE_CONSTRAINT_VIOLATION, expectedMsg);
    }

    @Test
    @Sql(scripts = CLEAR_DATABASE, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(scripts = DB_CONFIG_TEST_INSERT_RECORD, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    void test_isUniqueTrue_codeNonDuplicate_success() {

        Integer savedId=restClient.post()
                .uri(API_PATH)
                .body(REQUEST_DTO)
                .retrieve()
                .body(Integer.class);

        List<AutoIncTable> found=jpaRepository.findAll();
        assertEquals(2,found.size());
        assertTrue(found.stream().anyMatch(ai->ai.getId().equals(savedId)),"Failed to create AutoIncTable");

    }

    @Test
    @Sql(scripts = CLEAR_DATABASE, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(scripts = DB_CONFIG_TEST_INSERT_RECORD, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    void test_defaultIsUnique_titleEnDuplicate_success() {

        REQUEST_DTO.setTitleEn("Test Title");
        Integer savedId = restClient.post()
                .uri(API_PATH)
                .body(REQUEST_DTO)
                .retrieve()
                .body(Integer.class);

        List<AutoIncTable> found=jpaRepository.findAll();
        assertEquals(2,found.size());
        assertTrue(found.stream().anyMatch(ai->ai.getId().equals(savedId)),"Failed to create AutoIncTable");


    }

}
