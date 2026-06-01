package bs.service.trainee.api.service;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.trainee.model.generated.TraineeCertificateDTO;
import bs.service.trainee.model.generated.TraineeCertificateResultSet;

import java.time.LocalDate;

public interface TraineeCertificateService {
    NewRecordVTO createTraineeCertificate(Integer traineeId, TraineeCertificateDTO traineeCertificateDTO);
    NewRecordVTO updateTraineeCertificate(Integer traineeId, Integer certificateId, TraineeCertificateDTO traineeCertificateDTO);
    void deleteTraineeCertificate(Integer traineeId, Integer certificateId);
    TraineeCertificateResultSet getAllTraineeCertificatesByFilter(Integer traineeId, Integer courseId, String quickSearch, LocalDate issueDateFrom, LocalDate issueDateTo, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy);
}
