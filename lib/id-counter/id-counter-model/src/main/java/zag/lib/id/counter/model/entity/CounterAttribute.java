package bs.lib.id.counter.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "ctr_counter_attribute")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CounterAttribute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "counter_id")
    private Counter counter;

    @Column(name="attribute_key")
    @Basic
    private String attributeKey;

    @Column(name="is_optional")
    @Basic
    private Boolean isOptional;

}
