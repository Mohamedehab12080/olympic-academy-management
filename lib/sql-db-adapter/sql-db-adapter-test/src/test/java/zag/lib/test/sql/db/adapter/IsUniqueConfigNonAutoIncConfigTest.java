package bs.lib.test.sql.db.adapter;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
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
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static bs.lib.sql.db.adapter.model.enums.SQLDatabaseAdapterErrors.*;
import static bs.lib.test.sql.db.adapter.common.SQLScripts.*;

@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "bs.lib.sql-db-adapter.entities\"[NonAutoIncTable]\".attributes\"[code]\".title-en=Code",
                "bs.lib.sql-db-adapter.entities\"[NonAutoIncTable]\".attributes\"[code]\".is-unique=true",
                "bs.lib.sql-db-adapter.entities\"[NonAutoIncTable]\".attributes\"[titleAr]\".is-unique=false"
        })
@EnableAutoConfiguration(exclude = {
        SecurityAutoConfiguration.class,
        SecurityFilterAutoConfiguration.class,
        UserDetailsServiceAutoConfiguration.class,
        org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration.class
})
public class IsUniqueConfigNonAutoIncConfigTest {

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

    // ==================== CREATE TESTS ====================

    @Test
    @Sql(scripts = CLEAR_DATABASE, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(scripts = DB_CONFIG_TEST_INSERT_RECORD, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    void test_isUniqueTrue_codeDuplicate_fail() throws IOException {

        REQUEST_DTO.setId(2);
        REQUEST_DTO.setCode("CODE001");

        RestClientResponseException ex = assertThrows(RestClientResponseException.class,
                () -> restClient.post()
                        .uri(API_PATH)
                        .body(REQUEST_DTO)
                        .retrieve()
                        .toBodilessEntity());
        String expectedMsg="Failed to Create 'NonAutoIncTable', due to Code 'CODE001' already exists";
        IntegrationTestService.assertBadRequest(ex, UNIQUE_CONSTRAINT_VIOLATION,expectedMsg);
    }

    @Test
    @Sql(scripts = CLEAR_DATABASE, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(scripts = DB_CONFIG_TEST_INSERT_RECORD, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    void test_isUniqueTrue_codeNonDuplicate_success() {
        REQUEST_DTO.setId(2);
        Integer savedId =restClient.post()
                .uri(API_PATH)
                .body(REQUEST_DTO)
                .retrieve()
                .body(Integer.class);
        List<NonAutoIncTable> allRecords= jpaRepository.findAll();
        assertEquals(2, allRecords.size());
        assertTrue(allRecords.stream().anyMatch(e->e.getId().equals(savedId)));
    }

    @Test
    @Sql(scripts = CLEAR_DATABASE, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(scripts = DB_CONFIG_TEST_INSERT_RECORD, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    void test_isUniqueFalse_titleArDuplicate_success() {

        REQUEST_DTO.setId(2);
        REQUEST_DTO.setTitleAr("عنوان تجريبي");

        restClient.post()
                .uri(API_PATH)
                .body(REQUEST_DTO)
                .retrieve().toBodilessEntity();

        List<NonAutoIncTable> allRecords= jpaRepository.findAll();
        assertEquals(2, allRecords.size());
        assertTrue(allRecords.stream().anyMatch(e->e.getId().equals(REQUEST_DTO.getId())));


    }

    @Test
    @Sql(scripts = CLEAR_DATABASE, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    @Sql(scripts = DB_CONFIG_TEST_INSERT_RECORD, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
    void test_defaultIsUnique_titleEnDuplicate_success() {

        REQUEST_DTO.setId(2);
        REQUEST_DTO.setTitleEn("Test Title");

        restClient.post()
                .uri(API_PATH)
                .body(REQUEST_DTO)
                .retrieve().toBodilessEntity();

        List<NonAutoIncTable> allRecords= jpaRepository.findAll();
        assertEquals(2, allRecords.size());
        assertTrue(allRecords.stream().anyMatch(e->e.getId().equals(REQUEST_DTO.getId())));
    }

}