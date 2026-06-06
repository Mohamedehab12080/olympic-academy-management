package bs.lib.test.sql.db.adapter.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import bs.lib.test.sql.db.adapter.model.dto.AutoIncTableDTO;
import bs.lib.test.sql.db.adapter.model.dto.NonAutoIncTableDTO;
import bs.lib.test.sql.db.adapter.model.entity.AutoIncTable;
import bs.lib.test.sql.db.adapter.model.entity.NonAutoIncTable;
import bs.lib.test.sql.db.adapter.repository.jpa.AutoIncTableJPARepository;
import bs.lib.test.sql.db.adapter.repository.jpa.NonAutoIncTableJPARepository;
import bs.lib.test.sql.db.adapter.service.DBConfigMapper;

@RestController
@RequestMapping("/test")
@AllArgsConstructor
public class TestController {
    private final AutoIncTableJPARepository jpaRepository;
    private final NonAutoIncTableJPARepository nonAutoIncTableJPARepository;

    @PostMapping("/inc/auto")
    public ResponseEntity<Integer> create(@RequestBody AutoIncTableDTO dto) {
        AutoIncTable saved= jpaRepository.save(DBConfigMapper.toAutoIncTable(dto));
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.getId());
    }

    @PostMapping("/non/inc/auto")
    public ResponseEntity<Integer> create(@RequestBody NonAutoIncTableDTO nonAutoIncTableDTO) {
        NonAutoIncTable saved= nonAutoIncTableJPARepository.save(DBConfigMapper.toNonAutoIncTableDTO(nonAutoIncTableDTO));
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.getId());
    }
}
