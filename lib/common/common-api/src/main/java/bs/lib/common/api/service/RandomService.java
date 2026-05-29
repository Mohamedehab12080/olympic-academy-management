package bs.lib.common.api.service;

public interface RandomService {
    String generateRandomString(String alphaNum, Integer length);

    String generateCheckSum(String alphaNum, String baseSecuredRandom);

    String generatePassword(String fullAlphaNum, Integer length, String... requiredCategories) ;

    }
