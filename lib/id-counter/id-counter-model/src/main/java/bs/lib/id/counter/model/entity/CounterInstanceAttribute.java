package bs.lib.id.counter.model.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ctr_counter_instance_attribute")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CounterInstanceAttribute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "counter_instance_id")
    private CounterInstance counterInstance;

    @Column(name="attribute_key")
    @Basic
    private String attributeKey;

    @Column(name="attribute_value")
    @Basic
    private String attributeValue;



}
