package bs.service.place.api.service;

import bs.lib.common.model.generated.LookupResultSet;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.place.model.generated.*;

public interface ConstantService {
    NewRecordVTO createConstant(ConstantDTO constantDTO);
    NewRecordVTO updateConstant(Integer constantId, ConstantDTO constantDTO);
    void deleteConstantById(Integer constantId);
    ConstantVTO getConstantById(Integer constantId);
    ConstantResultSet getAllConstantsByFilter(String value,String location,String position,String quickSearch, Integer pageNum, Integer pageSize,
                                        OrderDirections orderDir, String orderBy);
    LookupResultSet getAllConstantsLookup();
}
