package bs.lib.common.model.interfaces;

public interface Events {
    Integer id();

    Domains domain();

    String name();

    default String label() {
        return this.name();
    }


}
