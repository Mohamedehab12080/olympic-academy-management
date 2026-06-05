package bs.service.financial.api.service;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.financial.model.generated.RentTypeDTO;
import bs.service.financial.model.generated.RentTypeResultSet;
import bs.service.financial.model.generated.RentTypeVTO;

public interface RentTypeService {
    NewRecordVTO createRentType(RentTypeDTO rentTypeDTO);
    NewRecordVTO updateRentType(Integer rentTypeId, RentTypeDTO rentTypeDTO);
    void deleteRentType(Integer rentTypeId);
    RentTypeVTO getRentTypeById(Integer rentTypeId);
    RentTypeResultSet getAllRentTypes(String quickSearch, Integer pageNum, Integer pageSize,
                                      OrderDirections orderDir, String orderBy);
}