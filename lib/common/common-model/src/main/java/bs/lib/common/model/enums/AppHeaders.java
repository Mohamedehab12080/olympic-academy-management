package bs.lib.common.model.enums;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum AppHeaders {
    AUTHORIZATION("Authorization", "Authorization"),
    CURRENT_USER_ID("Current-User-Id", "CurrentUserId"),

    EVENT_NAME("Event-Name", "EventName"),
    TRACE_ID("Trace-Id", "traceId"),

    PUBLISHED_ON("Published-On", "PublishedOn"),
    ACCEPT_LANGUAGE("Accept-Language", "AcceptLanguage"),
    ;
    public static final String EVENT_NAME_MQ_HEADER = "#{T(bs.lib.common.model.enums.AppHeaders).EVENT_NAME.mqHeader()}";
    public static final String AUTHORIZATION_MQ_HEADER = "#{T(bs.lib.common.model.enums.AppHeaders).AUTHORIZATION.mqHeader()}";

    public static final String TRACE_ID_REST_HEADER = "Trace-Id";

    public final String restHeader;
    private final String mqHeader;

    public String restHeader() {
        return restHeader;
    }

    public String mqHeader() {
        return mqHeader;
    }
}
