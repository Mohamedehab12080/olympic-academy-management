package bs.service.course.model.enums;

import bs.lib.common.model.interfaces.EnumWithIdAndTitle;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CourseTypes implements EnumWithIdAndTitle {
    QUALIFICATION(1,"تأهيل"),TRAINING(2,"تدريب");

    private Integer id;
    private String title;
}
