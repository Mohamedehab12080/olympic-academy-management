package bs.lib.json.adapter.api.service;

public interface JSONParser {

    Object getValueByJsonPath(String jsonStr, String jsonPath) throws Exception;

}
