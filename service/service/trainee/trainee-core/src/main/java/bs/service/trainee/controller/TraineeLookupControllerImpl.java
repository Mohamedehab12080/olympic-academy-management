package bs.service.trainee.controller;

import bs.lib.common.model.generated.LookupResultSet;
import bs.lib.common.model.generated.LookupVTO;
import bs.service.trainee.api.service.TraineeService;
import bs.service.trainee.controller.generated.TraineeLookupController;
import bs.service.trainee.model.enums.TraineeAttendanceStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequiredArgsConstructor
public class TraineeLookupControllerImpl implements TraineeLookupController {

    private final TraineeService traineeService;

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<LookupResultSet> _getAllTraineesLookup() {
        return ResponseEntity.ok(traineeService.getAllTraineesLookup());
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<LookupResultSet> _getTraineeAttendanceStatusLookup() {
        log.info("GET /lookup/trainee/attendance/status - Getting trainee attendance status lookup");

        List<LookupVTO> statuses = Arrays.stream(TraineeAttendanceStatus.values())
                .map(status -> LookupVTO.builder()
                        .id(status.getId())
                        .title(status.getTitle())
                        .build())
                .collect(Collectors.toList());

        LookupResultSet result = LookupResultSet.builder()
                ._list(statuses)
                .total(statuses.size())
                .build();

        return ResponseEntity.ok(result);
    }
}