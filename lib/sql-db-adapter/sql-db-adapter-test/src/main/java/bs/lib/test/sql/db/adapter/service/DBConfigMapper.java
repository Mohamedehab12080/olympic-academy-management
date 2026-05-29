package bs.lib.test.sql.db.adapter.service;

import bs.lib.test.sql.db.adapter.model.dto.AutoIncTableDTO;
import bs.lib.test.sql.db.adapter.model.dto.NonAutoIncTableDTO;
import bs.lib.test.sql.db.adapter.model.entity.AutoIncTable;
import bs.lib.test.sql.db.adapter.model.entity.NonAutoIncTable;

public class DBConfigMapper {

    public static AutoIncTable toAutoIncTable(AutoIncTableDTO dto) {
        AutoIncTable autoIncTable = new AutoIncTable();
        autoIncTable.setId(dto.getId());
        autoIncTable.setTitleEn(dto.getTitleEn());
        autoIncTable.setTitleAr(dto.getTitleAr());
        autoIncTable.setCode(dto.getCode());
        return autoIncTable;
    }

    public static NonAutoIncTable toNonAutoIncTableDTO(NonAutoIncTableDTO dto) {
        NonAutoIncTable nonAutoIncTable = new NonAutoIncTable();
        nonAutoIncTable.setId(dto.getId());
        nonAutoIncTable.setTitleEn(dto.getTitleEn());
        nonAutoIncTable.setTitleAr(dto.getTitleAr());
        nonAutoIncTable.setCode(dto.getCode());
        return nonAutoIncTable;
    }
}
