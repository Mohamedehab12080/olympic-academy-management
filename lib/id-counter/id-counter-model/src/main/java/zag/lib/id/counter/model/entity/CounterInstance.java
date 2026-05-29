package bs.lib.id.counter.model.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "ctr_counter_instance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CounterInstance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "counter_id")
    private Counter counter;

    @Column(name="counter_last_value")
    @Basic
    private Long counterLastValue;

    @Column(name="last_modified_on")
    @Basic
    private LocalDateTime lastModifiedOn;

}
