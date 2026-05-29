package bs.lib.json.adapter.core.service;

import com.google.gson.*;
import bs.lib.common.model.interfaces.RecordAttributes;

import java.lang.reflect.Type;

public class RecordAttributeTypeAdapter implements JsonSerializer<RecordAttributes>, JsonDeserializer<RecordAttributes> {

    @Override
    public JsonElement serialize(RecordAttributes recordAttribute, Type type, JsonSerializationContext context) {
        JsonElement elem = new Gson().toJsonTree(recordAttribute);
//        elem.getAsJsonObject().addProperty("keyType", recordAttribute.getClass().getName());

        JsonObject obj = new JsonObject();
        obj.addProperty("value", elem.getAsString());
        obj.addProperty("type", recordAttribute.getClass().getName());

        return obj;
    }


    @Override
    public RecordAttributes deserialize(JsonElement json, Type type, JsonDeserializationContext context) throws JsonParseException {
        JsonObject jsonObject = json.getAsJsonObject();
        String className = jsonObject.get("type").getAsString();
        String value = jsonObject.get("value").getAsString();

        try {
            Class<?> clazz = Class.forName(className);
            return (RecordAttributes) Enum.valueOf((Class<Enum>) clazz, value);
//            return context.deserialize(json, clazz);
        } catch (ClassNotFoundException e) {
            throw new JsonParseException("Unknown RecordAttributes type: " + className, e);
        }
    }
}
