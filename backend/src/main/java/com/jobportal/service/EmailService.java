package com.jobportal.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // ── Generic send ──
    public void sendEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            System.out.println("✅ Email sent to: " + to + " | Subject: " + subject);
        } catch (MessagingException e) {
            System.err.println("❌ Failed to send email to " + to + ": " + e.getMessage());
        }
    }

    // ── Selection / Offer Email ──
    public void sendSelectionEmail(String toEmail, String applicantName,
                                   String jobTitle, String companyName) {
        String subject = "🎉 Congratulations! You've been selected – " + jobTitle + " at " + companyName;
        String body = """
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
              <div style="background: linear-gradient(135deg, #6366f1, #06b6d4); border-radius: 16px; padding: 40px; text-align: center; margin-bottom: 24px;">
                <div style="font-size: 48px; margin-bottom: 12px;">🎉</div>
                <h1 style="color: #ffffff; font-size: 1.8rem; margin: 0; font-weight: 800;">Congratulations!</h1>
                <p style="color: rgba(255,255,255,0.9); margin-top: 8px; font-size: 1rem;">You've been shortlisted!</p>
              </div>

              <div style="background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
                <p style="color: #0f172a; font-size: 1rem; margin-bottom: 16px;">Dear <strong>%s</strong>,</p>

                <p style="color: #475569; line-height: 1.7; margin-bottom: 16px;">
                  We are thrilled to inform you that after careful review of your application,
                  you have been <strong style="color: #10b981;">selected</strong> for the position of
                  <strong style="color: #6366f1;">%s</strong> at <strong>%s</strong>.
                </p>

                <div style="background: #f0fdf4; border-left: 4px solid #10b981; border-radius: 8px; padding: 16px; margin: 20px 0;">
                  <p style="color: #15803d; font-weight: 600; margin: 0 0 4px;">✅ Application Status: SHORTLISTED</p>
                  <p style="color: #166534; margin: 0; font-size: 0.9rem;">Our HR team will contact you shortly with next steps.</p>
                </div>

                <p style="color: #475569; line-height: 1.7; margin-bottom: 16px;">
                  Please keep an eye on your email for further communication regarding:
                </p>
                <ul style="color: #475569; line-height: 2; padding-left: 20px;">
                  <li>Interview schedule and format</li>
                  <li>Documents required for onboarding</li>
                  <li>Offer letter details</li>
                </ul>

                <p style="color: #475569; line-height: 1.7; margin-top: 20px;">
                  We look forward to welcoming you to the <strong>%s</strong> team!
                </p>

                <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                  <p style="color: #94a3b8; font-size: 0.85rem; margin: 0;">
                    Best regards,<br>
                    <strong style="color: #475569;">%s Recruitment Team</strong><br>
                    <span style="color: #6366f1;">JobPortal</span>
                  </p>
                </div>
              </div>

              <p style="text-align: center; color: #94a3b8; font-size: 0.75rem; margin-top: 16px;">
                This email was sent via JobPortal. Please do not reply to this email.
              </p>
            </div>
            """.formatted(applicantName, jobTitle, companyName, companyName, companyName);

        sendEmail(toEmail, subject, body);
    }

    // ── Rejection Email ──
    public void sendRejectionEmail(String toEmail, String applicantName,
                                   String jobTitle, String companyName) {
        String subject = "Your application for " + jobTitle + " at " + companyName;
        String body = """
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
              <div style="background: linear-gradient(135deg, #64748b, #475569); border-radius: 16px; padding: 40px; text-align: center; margin-bottom: 24px;">
                <div style="font-size: 48px; margin-bottom: 12px;">📋</div>
                <h1 style="color: #ffffff; font-size: 1.6rem; margin: 0; font-weight: 800;">Application Update</h1>
                <p style="color: rgba(255,255,255,0.85); margin-top: 8px;">%s at %s</p>
              </div>

              <div style="background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
                <p style="color: #0f172a; font-size: 1rem; margin-bottom: 16px;">Dear <strong>%s</strong>,</p>

                <p style="color: #475569; line-height: 1.7; margin-bottom: 16px;">
                  Thank you for taking the time to apply for the <strong style="color: #6366f1;">%s</strong>
                  position at <strong>%s</strong> and for your interest in joining our team.
                </p>

                <p style="color: #475569; line-height: 1.7; margin-bottom: 16px;">
                  After careful consideration of all applications, we regret to inform you that
                  we will not be moving forward with your application at this time.
                </p>

                <div style="background: #fff1f2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 16px; margin: 20px 0;">
                  <p style="color: #be123c; font-weight: 600; margin: 0 0 4px;">Application Status: Not Selected</p>
                  <p style="color: #9f1239; margin: 0; font-size: 0.9rem;">This decision was made after reviewing all candidates.</p>
                </div>

                <p style="color: #475569; line-height: 1.7; margin-bottom: 16px;">
                  This was a highly competitive process and we encourage you to:
                </p>
                <ul style="color: #475569; line-height: 2; padding-left: 20px;">
                  <li>Continue applying to other positions on our portal</li>
                  <li>Keep your profile and resume updated</li>
                  <li>Explore other opportunities that match your skills</li>
                </ul>

                <p style="color: #475569; line-height: 1.7; margin-top: 20px;">
                  We wish you the very best in your job search and future career endeavors.
                </p>

                <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                  <p style="color: #94a3b8; font-size: 0.85rem; margin: 0;">
                    Best regards,<br>
                    <strong style="color: #475569;">%s Recruitment Team</strong><br>
                    <span style="color: #6366f1;">JobPortal</span>
                  </p>
                </div>
              </div>

              <p style="text-align: center; color: #94a3b8; font-size: 0.75rem; margin-top: 16px;">
                This email was sent via JobPortal. Please do not reply to this email.
              </p>
            </div>
            """.formatted(jobTitle, companyName, applicantName, jobTitle, companyName, companyName);

        sendEmail(toEmail, subject, body);
    }

    // ── Review Acknowledgement Email ──
    public void sendReviewEmail(String toEmail, String applicantName,
                                String jobTitle, String companyName) {
        String subject = "Your application is under review – " + jobTitle;
        String body = """
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
              <div style="background: linear-gradient(135deg, #3b82f6, #6366f1); border-radius: 16px; padding: 40px; text-align: center; margin-bottom: 24px;">
                <div style="font-size: 48px; margin-bottom: 12px;">🔍</div>
                <h1 style="color: #ffffff; font-size: 1.6rem; margin: 0; font-weight: 800;">Application Under Review</h1>
              </div>

              <div style="background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0;">
                <p style="color: #0f172a; font-size: 1rem; margin-bottom: 16px;">Dear <strong>%s</strong>,</p>

                <p style="color: #475569; line-height: 1.7; margin-bottom: 16px;">
                  Great news! Your application for <strong style="color: #6366f1;">%s</strong>
                  at <strong>%s</strong> is currently being reviewed by our hiring team.
                </p>

                <div style="background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 16px; margin: 20px 0;">
                  <p style="color: #1d4ed8; font-weight: 600; margin: 0 0 4px;">🔍 Status: Under Review</p>
                  <p style="color: #1e40af; margin: 0; font-size: 0.9rem;">We will update you once a decision has been made.</p>
                </div>

                <p style="color: #475569; line-height: 1.7;">
                  We appreciate your patience and will be in touch soon.
                </p>

                <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                  <p style="color: #94a3b8; font-size: 0.85rem; margin: 0;">
                    Best regards,<br>
                    <strong style="color: #475569;">%s Recruitment Team</strong>
                  </p>
                </div>
              </div>
            </div>
            """.formatted(applicantName, jobTitle, companyName, companyName);

        sendEmail(toEmail, subject, body);
    }
}
