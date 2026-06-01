package bs.service.user.api.repository;

import bs.service.user.model.entity.Token;
import bs.service.user.model.enums.TokenTypes;

import java.time.LocalDateTime;
import java.util.Optional;

public interface TokenRepository{

    Token insert(Token entity);
    void update(Token entity);

    Optional<Token> findByToken(String token);

    void deleteByUserIdAndTokenType(Integer userId,TokenTypes tokenType);

    Optional<Token> findByTokenAndTokenType(String token, TokenTypes tokenType);

    int deleteByExpiryDateBefore(LocalDateTime dateTime);
}
