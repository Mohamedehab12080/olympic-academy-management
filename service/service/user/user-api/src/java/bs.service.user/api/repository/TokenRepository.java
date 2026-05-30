package bs.service.user.api.repository;

import bs.olympic.common.api.repository.BaseRepository;
import bs.olympic.user.model.entity.Token;
import bs.olympic.user.model.enums.TokenTypes;

import java.time.LocalDateTime;
import java.util.Optional;

public interface TokenRepository extends BaseRepository<Token, Long> {

    Token insert(Token entity);
    void update(Token entity);

    Optional<Token> findByToken(String token);

    void deleteByUserIdAndTokenType(Long userId,TokenTypes tokenType);

    Optional<Token> findByTokenAndTokenType(String token, TokenTypes tokenType);

    int deleteByExpiryDateBefore(LocalDateTime dateTime);
}
