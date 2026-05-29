package bs.lib.common.model.interfaces;


public interface Errors {
    Domains domain();

    String code();

    String messageEn();

    String messageAr();

    String name();

    default String label() {
        return this.name();
    }


    default String getFullMessage() {
        return "[" + getFullCode() + "] [" + label() + "]: " + messageEn();
    }

    default String getFullCode() {
        return domain() + "-" + code();
    }
}
