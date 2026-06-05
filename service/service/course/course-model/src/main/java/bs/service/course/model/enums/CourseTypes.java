package bs.service.course.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CourseTypes {
    QUALIFICATION(1,"تأهيل"),TRAINING(2,"تدريب");

    private Integer id;
    private String title;
}
