package bs.lib.id.counter.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ctr_counter")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Counter {

    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "title_En")
    @Basic
    private String titleEn;

    @Column(name = "title_ar")
    @Basic
    private String titleAr;

    @Column(name = "length")
    @Basic
    private Integer length;

    @Column(name = "counter_starting_value")
    @Basic
    private Long counterStartingValue;

    @Column(name = "is_reset_daily")
    @Basic
    private Boolean isResetDaily;

    @OneToMany(mappedBy = "counter",fetch = FetchType.EAGER)
    private Set<CounterAttribute> attributes = new HashSet<>();
}
