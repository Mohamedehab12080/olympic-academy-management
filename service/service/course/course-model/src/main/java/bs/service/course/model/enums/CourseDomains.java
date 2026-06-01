package bs.service.course.model.enums;

import bs.lib.common.model.interfaces.Domains;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum CourseDomains implements Domains {

    COURSE(3001);
    
    private final Integer id;

    @Override
    public Integer id() {
        return id;
    }


}
