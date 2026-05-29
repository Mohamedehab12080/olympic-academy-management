package bs.lib.common.api.service;

import bs.olympic.common.model.dto.MailTemplateDTO;

public interface EmailService {
    void sendEmail(MailTemplateDTO mailTemplateDTO);
}