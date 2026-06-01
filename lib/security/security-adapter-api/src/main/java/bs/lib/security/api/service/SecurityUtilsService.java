package bs.lib.security.api.service;

public interface SecurityUtilsService {

     Integer getCurrentUserId();
     String getCurrentUserEmail();
     String getCurrentUserRole();
     boolean isAuthenticated();
}
