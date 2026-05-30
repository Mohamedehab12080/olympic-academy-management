package bs.service.user.repository;

import bs.olympic.common.repository.BaseRepositoryImpl;
import bs.service.user.api.repository.TokenRepository;
import bs.service.user.model.entity.Token;
import bs.service.user.model.enums.TokenTypes;
import bs.service.user.repository.jpa.TokenJPARepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public class TokenRepositoryImpl extends BaseRepositoryImpl<Token,Long> implements TokenRepository {

    private final TokenJPARepository tokenJPARepository;

    public TokenRepositoryImpl(TokenJPARepository tokenJPARepository) {
        super(tokenJPARepository);
        this.tokenJPARepository = tokenJPARepository;
    }

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
    public void deleteByUserIdAndTokenType(Long userId, TokenTypes tokenType) {
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
