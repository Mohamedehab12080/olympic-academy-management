package bs.service.user.model.entity;

import bs.service.user.model.enums.TokenTypes;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "oa_token")
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Integer id;

    @Basic
    @Column(name="token")
    private String token;

    @Basic
    @Column(name="token_type")
    @Enumerated(EnumType.STRING)
    private TokenTypes tokenType;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Basic
    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    @Basic
    @Column(name = "is_used")
    private boolean used;

}
