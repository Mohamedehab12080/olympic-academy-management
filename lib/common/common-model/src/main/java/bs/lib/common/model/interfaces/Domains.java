package bs.lib.common.model.interfaces;

public interface Domains {
    Integer id();

    String destination();

    String name();

    default String label() {
        return this.name();
    }


}
