package bs.service.file.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "fl_daily_counter")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FlDailyCounter {

    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "count")
    @Basic
    private Integer count = 0;

    @Column(name = "last_modified_on")
    @Basic
    private LocalDate lastModifiedOn;


}
