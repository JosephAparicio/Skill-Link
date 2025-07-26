package com.example.demo.user.service;

import com.example.demo.user.dto.SendEmailRequest;
import com.example.demo.user.dto.SendEmailResponse;
import com.example.demo.user.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class ContactEmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public SendEmailResponse enviarCorreoContacto(SendEmailRequest request, User remitente) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "SkillLink - Plataforma Emprendedora");
            helper.setTo(request.destinatario());
            helper.setSubject(request.asunto());

            String contenidoHtml = construirPlantillaContacto(
                    request.mensaje(),
                    remitente.getName() + " " + remitente.getSecondName(),
                    remitente.getEmail()
            );

            helper.setText(contenidoHtml, true);
            mailSender.send(message);

            System.out.println("Correo enviado exitosamente de " + remitente.getEmail() + " a " + request.destinatario());
            return SendEmailResponse.exito("Correo enviado exitosamente");

        } catch (Exception e) {
            System.err.println("Error al enviar correo: " + e.getMessage());
            e.printStackTrace();
            return SendEmailResponse.error("Error al enviar el correo. Inténtalo más tarde.");
        }
    }

    private String construirPlantillaContacto(String mensaje, String nombreRemitente, String emailRemitente) {
        return "<!DOCTYPE html>" +
                "<html lang=\"es\">" +
                "<head>" +
                "<meta charset=\"UTF-8\">" +
                "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "<title>Mensaje de " + nombreRemitente + " - SkillLink</title>" +
                "<style>" +
                "body {" +
                "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;" +
                "line-height: 1.6;" +
                "color: #333;" +
                "background-color: #f3f4f6;" +
                "margin: 0;" +
                "padding: 20px;" +
                "}" +
                ".container {" +
                "max-width: 600px;" +
                "margin: 0 auto;" +
                "background: white;" +
                "border-radius: 12px;" +
                "box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" +
                "overflow: hidden;" +
                "}" +
                ".header {" +
                "background: linear-gradient(135deg, #7c3aed, #3b82f6);" +
                "padding: 30px;" +
                "text-align: center;" +
                "color: white;" +
                "}" +
                ".logo {" +
                "font-size: 24px;" +
                "font-weight: bold;" +
                "margin-bottom: 10px;" +
                "}" +
                ".content {" +
                "padding: 30px;" +
                "}" +
                ".sender-info {" +
                "background: #f8fafc;" +
                "padding: 20px;" +
                "border-radius: 8px;" +
                "margin-bottom: 20px;" +
                "border-left: 4px solid #7c3aed;" +
                "}" +
                ".message-content {" +
                "background: #ffffff;" +
                "padding: 20px;" +
                "border-radius: 8px;" +
                "border: 1px solid #e2e8f0;" +
                "}" +
                ".footer {" +
                "background: #f8fafc;" +
                "padding: 20px;" +
                "text-align: center;" +
                "color: #64748b;" +
                "font-size: 14px;" +
                "}" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class=\"container\">" +
                "<div class=\"header\">" +
                "<div class=\"logo\">💡 SkillLink</div>" +
                "<div>Mensaje desde la plataforma</div>" +
                "</div>" +
                "<div class=\"content\">" +
                "<div class=\"sender-info\">" +
                "<h3 style=\"margin: 0 0 10px 0; color: #1e293b;\">Mensaje de:</h3>" +
                "<p style=\"margin: 0; font-weight: 600; color: #7c3aed;\">" + nombreRemitente + "</p>" +
                "<p style=\"margin: 5px 0 0 0; color: #64748b; font-size: 14px;\">" + emailRemitente + "</p>" +
                "</div>" +
                "<div class=\"message-content\">" +
                "<h3 style=\"margin: 0 0 15px 0; color: #1e293b;\">Mensaje:</h3>" +
                "<p style=\"margin: 0; white-space: pre-wrap;\">" + mensaje + "</p>" +
                "</div>" +
                "</div>" +
                "<div class=\"footer\">" +
                "<p>Este mensaje fue enviado a través de SkillLink</p>" +
                "<p>Si no deseas recibir estos mensajes, puedes contactar al remitente directamente.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}