package bs.lib.common.core.service;

import bs.lib.common.api.service.EmailService;

import bs.lib.common.model.dto.MailTemplateDTO;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Override
    public void sendEmail(MailTemplateDTO mailTemplateDTO) {
        log.info("Sending email to: {}", mailTemplateDTO.getTo());

        try {
            String htmlContent = templateEngine.process(mailTemplateDTO.getTemplateName(), mailTemplateDTO.getContext());

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(mailTemplateDTO.getFrom());
            helper.setTo(mailTemplateDTO.getTo());
            helper.setSubject(mailTemplateDTO.getSubject());
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Email sent successfully to: {}", mailTemplateDTO.getTo());

        } catch (MessagingException e) {
            log.error("Failed to send email to: {}", mailTemplateDTO.getTo(), e);
            throw new RuntimeException("Failed to send email");
        }
    }
}
