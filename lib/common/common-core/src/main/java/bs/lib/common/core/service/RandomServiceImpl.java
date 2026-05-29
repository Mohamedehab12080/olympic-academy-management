package bs.lib.common.core.service;

import org.springframework.stereotype.Service;
import bs.lib.common.api.service.RandomService;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.*;

@Service
public class RandomServiceImpl implements RandomService {
    private static final SecureRandom RANDOM = new SecureRandom();

    @Override
    public String generatePassword(String fullAlphaNum, Integer length, String... requiredCategories) {

        List<Character> chars = new ArrayList<>();


        for (String category : requiredCategories) {
            chars.add(category.charAt(RANDOM.nextInt(category.length())));
        }


        for (int i = requiredCategories.length; i < length; i++) {
            chars.add(fullAlphaNum.charAt(RANDOM.nextInt(fullAlphaNum.length())));
        }

        Collections.shuffle(chars, RANDOM);

        StringBuilder sb = new StringBuilder(length);
        for (char c : chars) sb.append(c);
        return sb.toString();
    }

    public String generateRandomString(String alphaNum, Integer length) {
        StringBuilder randomPart = new StringBuilder();
        for (int i = 0; i < length; i++) {
            randomPart.append(alphaNum.charAt(RANDOM.nextInt(alphaNum.length())));
        }
        return randomPart.toString();
    }

    public String generateCheckSum(String alphaNum, String baseSecuredRandom) {
        MessageDigest digest = null;
        try {
            digest = MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
        byte[] hash = digest.digest(baseSecuredRandom.getBytes());   // 32byte --> 256bit

        //Take First byte and convert it into unsigned byte (& 0xFF)
        int value = hash[0] & 0xFF;

        // Convert it to one char of the alphanum string
        return String.valueOf(alphaNum.charAt(value % alphaNum.length()));
    }
}
