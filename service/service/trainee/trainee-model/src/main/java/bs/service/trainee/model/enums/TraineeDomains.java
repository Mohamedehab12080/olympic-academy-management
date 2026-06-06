package bs.service.trainee.model.enums;

import bs.lib.common.model.interfaces.Domains;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum TraineeDomains implements Domains {
    TRAINEE(5002),
    TRAINEE_CERTIFICATE(5003),
    TRAINEE_CONTACT(5004),
    HEALTH_CONDITION(5005),
    TRAINEE_ATTENDANCE(5006);

    private final Integer id;

    @Override
    public Integer id() {
        return id;
    }
}