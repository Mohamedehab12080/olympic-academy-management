package bs.service.trainee.controller;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.trainee.api.service.TraineeCertificateService;
import bs.service.trainee.controller.generated.TraineeCertificateController;
import bs.service.trainee.model.generated.TraineeCertificateDTO;
import bs.service.trainee.model.generated.TraineeCertificateResultSet;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import java.time.LocalDate;

@Controller
@AllArgsConstructor
public class TraineeCertificateControllerImpl implements TraineeCertificateController {

    private final TraineeCertificateService traineeCertificateService;

    @Override
    public ResponseEntity<NewRecordVTO> _createTraineeCertificate(Integer traineeId, TraineeCertificateDTO traineeCertificateDTO) {
        NewRecordVTO result = traineeCertificateService.createTraineeCertificate(traineeId, traineeCertificateDTO);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<Void> _deleteTraineeCertificate(Integer traineeId, Integer certificateId) {
        traineeCertificateService.deleteTraineeCertificate(traineeId, certificateId);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<TraineeCertificateResultSet> _getAllTraineeCertificatesByFilter(
            Integer traineeId, Integer courseId, String quickSearch,
            LocalDate issueDateFrom, LocalDate issueDateTo,
            Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {

        TraineeCertificateResultSet result = traineeCertificateService.getAllTraineeCertificatesByFilter(
                traineeId, courseId, quickSearch, issueDateFrom, issueDateTo,
                pageNum, pageSize, orderDir, orderBy);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<NewRecordVTO> _updateTraineeCertificate(Integer traineeId, Integer certificateId,
                                                                  TraineeCertificateDTO traineeCertificateDTO) {
        NewRecordVTO result = traineeCertificateService.updateTraineeCertificate(traineeId, certificateId, traineeCertificateDTO);
        return ResponseEntity.ok(result);
    }
}