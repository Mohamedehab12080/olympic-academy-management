package bs.lib.common.api.service;

import bs.lib.common.model.interfaces.dto.MailTemplateDTO;

public interface EmailService {
    void sendEmail(MailTemplateDTO mailTemplateDTO);
}
