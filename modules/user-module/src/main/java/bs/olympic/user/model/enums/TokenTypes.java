package bs.olympic.user.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TokenTypes {

    ACTIVATION(1440),        // 24 hours = 1440 minutes
    PASSWORD_RESET(5);      // 20 minutes

    private final Integer expirationTimeMinutes;

    // Get expiration time in hours (returns double for partial hours)
    public double getExpirationTimeHours() {
        return expirationTimeMinutes / 60.0;
    }

    // Get formatted expiration time string
    public String getFormattedExpirationTime() {
        if (expirationTimeMinutes >= 1440) {
            int days = expirationTimeMinutes / 1440;
            return days + " day" + (days > 1 ? "s" : "");
        } else if (expirationTimeMinutes >= 60) {
            int hours = expirationTimeMinutes / 60;
            return hours + " hour" + (hours > 1 ? "s" : "");
        } else {
            return expirationTimeMinutes + " minute" + (expirationTimeMinutes > 1 ? "s" : "");
        }
    }

    // Get expiration time parts (hours and minutes)
    public ExpirationTime getExpirationTimeParts() {
        int hours = expirationTimeMinutes / 60;
        int minutes = expirationTimeMinutes % 60;
        return new ExpirationTime(hours, minutes);
    }

    // Helper class for expiration time parts
    public static class ExpirationTime {
        private final int hours;
        private final int minutes;

        public ExpirationTime(int hours, int minutes) {
            this.hours = hours;
            this.minutes = minutes;
        }

        public int getHours() { return hours; }
        public int getMinutes() { return minutes; }

        public String toString() {
            if (hours > 0 && minutes > 0) {
                return hours + " hour" + (hours > 1 ? "s" : "") + " and " + minutes + " minute" + (minutes > 1 ? "s" : "");
            } else if (hours > 0) {
                return hours + " hour" + (hours > 1 ? "s" : "");
            } else {
                return minutes + " minute" + (minutes > 1 ? "s" : "");
            }
        }
    }
}