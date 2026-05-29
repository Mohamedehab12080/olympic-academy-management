package bs.lib.test.sql.db.adapter.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "non_auto_inc_table")
public class NonAutoIncTable {

    @Id
    private Integer id;

    @Basic
    @Column(name="title_en")
    private String titleEn; // unique

    @Basic
    @Column(name="title_ar")
    private String titleAr; // unique

    @Basic
    @Column(name="code")
    private String code; // unique not updatable


}
