package bs.service.common.security.api.service;

public interface SecurityUtilsService {

     Long getCurrentUserId();
     String getCurrentUserEmail();
     String getCurrentUserRole();
     boolean isAuthenticated();
}
