package bs.lib.common.model.interfaces;


public interface Errors {
    Domains domain();

    String code();

    String message();

    String name();

    default String label() {
        return this.name();
    }

    default String getFullMessage() {
        return "[" + getFullCode() + "] [" + label() + "]: " + message();
    }

    default String getFullCode() {
        return domain() + "-" + code();
    }
}
