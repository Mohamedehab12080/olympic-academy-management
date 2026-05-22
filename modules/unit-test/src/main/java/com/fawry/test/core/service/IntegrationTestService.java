package bs.olympic.test.core.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import bs.olympic.common.model.interfaces.Errors;
import bs.olympic.common.model.vto.ErrorVTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.RestClientResponseException;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.http.HttpStatus.FORBIDDEN;

public class IntegrationTestService {
    private static final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    public static void assertCurrentLocalDateTime(Object dateTimeObj) {
        assertNotNull(dateTimeObj);
        assertEquals(LocalDateTime.class, dateTimeObj.getClass());
        LocalDateTime actual = (LocalDateTime) dateTimeObj;

        LocalDateTime now = LocalDateTime.now();

        long diffInSeconds = Math.abs(Duration.between(actual, now).getSeconds());

        assertTrue(diffInSeconds <= 5 && diffInSeconds >= 0);
    }

    public static <T> T clone(T object, Class<T> clazz) {
        try {
            String json = mapper.writeValueAsString(object);
            return mapper.readValue(json, clazz);
        } catch (Exception e) {
            throw new RuntimeException("Failed to clone object: " + e.getMessage(), e);
        }
    }

    public static void assertBadRequest(ClientHttpResponse res, Errors error) throws IOException {
        ErrorVTO errorVTO = mapper.readValue(res.getBody(), ErrorVTO.class);
        assertNotNull(errorVTO);
        assertEquals(error.getFullCode(), errorVTO.getCode());
    }

    public static void assertBadRequest(RestClientResponseException res, Errors expectedError) {
        ErrorVTO errorVTO = assertErrorResponse(res, HttpStatus.BAD_REQUEST);
        assertEquals(expectedError.getFullCode(), errorVTO.getCode());
    }


    public static void assertBadRequest(RestClientResponseException res, Errors expectedError, String expectedMessageEn) {
        ErrorVTO errorVTO = assertErrorResponse(res, HttpStatus.BAD_REQUEST);
        assertEquals(expectedError.getFullCode(), errorVTO.getCode());
        assertEquals(expectedMessageEn, errorVTO.getMessageEn());
    }

    public static void assertForbidden(RestClientResponseException res) {
//        ErrorVTO errorVTO = assertErrorResponse(res, HttpStatus.FORBIDDEN);
//        assertEquals("REST-0002", errorVTO.getCode());
        assertEquals(FORBIDDEN,res.getStatusCode());
    }

    public static void assertUnAuthorized(RestClientResponseException res) {
        ErrorVTO errorVTO = assertErrorResponse(res, HttpStatus.UNAUTHORIZED);
        assertEquals("REST-0003", errorVTO.getCode());
    }

    public static void assertInvalidRequestBody(RestClientResponseException resEx, String... reqBodyErrors) {
        ErrorVTO errorVTO = assertErrorResponse(resEx, HttpStatus.BAD_REQUEST);
        assertEquals("REST-0004", errorVTO.getCode());

        if (reqBodyErrors == null || reqBodyErrors.length == 0)
            return;

        List<String> actualReqBodyErrors = errorVTO.getReqBodyErrors();
        assertNotNull(actualReqBodyErrors);
        assertEquals(reqBodyErrors.length, actualReqBodyErrors.size());
        for (String expectedReqBodyError : reqBodyErrors) {
            Boolean found = false;
            for (String actualReqBodyError : actualReqBodyErrors) {
                if (actualReqBodyError.contains(expectedReqBodyError)) {
                    found = true;
                    break;
                }
            }
            if (!found)
                fail("Expected req body error: " + expectedReqBodyError + " not found in actual req body errors: " + actualReqBodyErrors);
        }

        for (String actualReqBodyError : actualReqBodyErrors) {
            Boolean found = false;
            for (String expectedReqBodyError : reqBodyErrors) {
                if (actualReqBodyError.contains(expectedReqBodyError)) {
                    found = true;
                    break;
                }
            }
            if (!found)
                fail("Actual req body error: " + actualReqBodyError + " not found in expected req body errors: " + List.of(reqBodyErrors));
        }


    }

    private static ErrorVTO assertErrorResponse(RestClientResponseException resEx, HttpStatus status) {
        assertEquals(status.value(), resEx.getStatusCode().value());
        assertInstanceOf(RestClientResponseException.class, resEx);

        try {
            ErrorVTO errorVTO = resEx.getResponseBodyAs(ErrorVTO.class);
            assertNotNull(errorVTO);
            return errorVTO;
        } catch (Exception e) {
            fail("Response body: " + resEx.getResponseBodyAs(String.class) + " is not a valid JSON");
            return null;
        }
    }

    public static void assertBadRequest(ClientHttpResponse res, Errors error, String messageEn) throws IOException {
        ErrorVTO errorVTO = mapper.readValue(res.getBody(), ErrorVTO.class);
        assertNotNull(errorVTO);
        assertEquals(error.getFullCode(), errorVTO.getCode());
        assertEquals(messageEn, errorVTO.getMessageEn());
    }
}
