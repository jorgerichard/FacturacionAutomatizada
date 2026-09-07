package com.businessflow.receipt.service;

import com.businessflow.receipt.integration.CustomerIntegrationClient.Customer;
import com.businessflow.receipt.model.Receipt;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class ReceiptEmailService {
    private static final Logger log = LoggerFactory.getLogger(ReceiptEmailService.class);

    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final String host;
    private final String from;

    public ReceiptEmailService(ObjectProvider<JavaMailSender> mailSenderProvider,
                               @Value("${spring.mail.host:}") String host,
                               @Value("${receipt.mail.from}") String from) {
        this.mailSenderProvider = mailSenderProvider;
        this.host = host;
        this.from = from;
    }

    public void send(Receipt receipt, Customer customer) {
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (host.isBlank() || mailSender == null || customer == null || customer.email() == null || customer.email().isBlank()) {
            log.info("Email de boleta {} omitido: SMTP o email del cliente no configurado", receipt.getId());
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom(from);
            helper.setTo(customer.email());
            helper.setSubject("Boleta " + receipt.getId() + " - BusinessFlow");
            helper.setText(buildBody(receipt, customer), true);
            mailSender.send(message);
            log.info("Boleta {} enviada a {}", receipt.getId(), customer.email());
        } catch (MessagingException | RuntimeException ex) {
            log.warn("No se pudo enviar la boleta {} a {}: {}", receipt.getId(), customer.email(), ex.getMessage());
        }
    }

    private String buildBody(Receipt receipt, Customer customer) {
        String customerName = customer.name() == null ? "cliente" : customer.name();
        return "<html><body>"
                + "<h2>Boleta BusinessFlow</h2>"
                + "<p>Hola " + customerName + ",</p>"
                + "<p>Te enviamos el comprobante de tu pago.</p>"
                + "<p><strong>ID:</strong> " + receipt.getId() + "<br>"
                + "<strong>Factura:</strong> " + receipt.getInvoiceId() + "<br>"
                + "<strong>Monto:</strong> " + receipt.getAmount() + " " + receipt.getCurrency() + "<br>"
                + "<strong>Estado:</strong> " + receipt.getStatus() + "</p>"
                + "<p>Gracias por preferir BusinessFlow.</p>"
                + "</body></html>";
    }
}