package bs.lib.json.adapter.core.service;

import com.google.gson.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import bs.lib.common.model.interfaces.RecordAttributes;
import bs.lib.json.adapter.api.service.JSONService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class JSONServiceImpl implements JSONService {

    private final Gson gson;

    public JSONServiceImpl() {
        this.gson = new GsonBuilder()
               //LocalDateTime
                .registerTypeAdapter(LocalDateTime.class, (JsonSerializer<LocalDateTime>) (src, typeOfSrc, context) ->
                        new JsonPrimitive(src.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                )
                .registerTypeAdapter(LocalDateTime.class, (JsonDeserializer<LocalDateTime>) (json, typeOfT, context) ->
                        LocalDateTime.parse(json.getAsString(), DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                )

                .registerTypeAdapter(LocalDate.class,
                        (JsonSerializer<LocalDate>) (src, typeOfSrc, context) ->
                                new JsonPrimitive(src.format(DateTimeFormatter.ISO_LOCAL_DATE))
                )
                .registerTypeAdapter(LocalDate.class,
                        (JsonDeserializer<LocalDate>) (json, typeOfT, context) ->
                                LocalDate.parse(json.getAsString(), DateTimeFormatter.ISO_LOCAL_DATE)
                )
                .registerTypeHierarchyAdapter(RecordAttributes.class, new RecordAttributeTypeAdapter())
                .create();
    }

    @Override
    public String toJSON(Object obj) {
        return gson.toJson(obj);
    }

    @Override
    public <T> T fromJSON(String json, Class<T> clazz) {
        return gson.fromJson(json, clazz);
    }
}
