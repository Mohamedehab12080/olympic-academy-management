package bs.service.trainee.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TraineeAttendanceStatus {
    PRESENT(1, "حاضر"),
    ABSENT(2, "غائب"),
    LATE(3, "متأخر"),
    EXCUSED(4, "معذور");

    private final Integer id;
    private final String title;
}