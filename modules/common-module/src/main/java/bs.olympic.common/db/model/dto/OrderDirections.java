package bs.olympic.common.db.model.dto;

public enum OrderDirections {

    ASC("ASC"),

    DESC("DESC");

    private String value;
    OrderDirections(String value) {
        this.value = value;
    }
}