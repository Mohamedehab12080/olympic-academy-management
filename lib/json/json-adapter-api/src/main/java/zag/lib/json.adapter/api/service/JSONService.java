package bs.lib.json.adapter.api.service;

public interface JSONService {
    String toJSON(Object obj);

    <T> T fromJSON(String json, Class<T> clazz);
}
