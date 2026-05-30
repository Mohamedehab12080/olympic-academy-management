package bs.lib.json.adapter.core.service;


import org.json.simple.JSONObject;
import org.springframework.stereotype.Service;
import bs.lib.json.adapter.api.service.JSONParser;



//@Log4j2
@Service

//@AllArgsConstructor
public class JsonParserImpl implements JSONParser {

    @Override
    public Object getValueByJsonPath(String jsonStr, String jsonPath) throws Exception {
        String[] parts = jsonPath.split("\\.");

        //Parse the JSON string to JSONObject
        org.json.simple.parser.JSONParser parser = new org.json.simple.parser.JSONParser();
        Object current = (JSONObject) parser.parse(jsonStr);

        for (String part : parts) {
            if (current instanceof JSONObject) {
                current = ((JSONObject) current).get(part);
            } else {
                return null; // Path not found
            }
        }

        return current;
    }
}
