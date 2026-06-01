package bs.service.user.repository;

import bs.service.user.api.repository.TokenRepository;
import bs.service.user.model.entity.Token;
import bs.service.user.model.enums.TokenTypes;
import bs.service.user.repository.jpa.TokenJPARepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class TokenRepositoryImpl implements TokenRepository {

    private final TokenJPARepository tokenJPARepository;

    @Override
    public Token insert(Token entity) {
        return tokenJPARepository.save(entity);
    }

    @Override
    public void update(Token entity) {
        tokenJPARepository.save(entity);
    }

    @Override
    public Optional<Token> findByToken(String token) {
        return tokenJPARepository.findByToken(token);
    }

    @Override
    public void deleteByUserIdAndTokenType(Integer userId, TokenTypes tokenType) {
        tokenJPARepository.deleteByUserIdAndTokenType(userId,tokenType);

    }

    @Override
    public Optional<Token> findByTokenAndTokenType(String token, TokenTypes tokenType) {
        return tokenJPARepository.findByTokenAndTokenType(token,tokenType);
    }

    @Override
    public int deleteByExpiryDateBefore(LocalDateTime dateTime) {
        return tokenJPARepository.deleteByExpiryDateBefore(dateTime);
    }
}
