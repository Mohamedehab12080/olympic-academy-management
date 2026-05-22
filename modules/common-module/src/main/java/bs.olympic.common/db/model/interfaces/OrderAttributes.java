package bs.olympic.common.db.model.interfaces;

public interface OrderAttributes {
    String getAttributeName();

    Boolean getIsLocalized();

    String name();

    default Boolean getRequireJoin(){return false;}
    default String getAttributeKey(){return null;}
}
