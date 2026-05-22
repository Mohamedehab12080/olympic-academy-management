package bs.olympic.common.rest.model.enums;


import bs.olympic.common.model.interfaces.Domains;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum RESTDomains implements Domains {
    REST(101);

    private final Integer id;

    @Override
    public Integer id() {
        return id;
    }

}
