package com.hivecontrolsolutions.comestag.core.domain.model;

public class NotificationTemplate {

    /**
     * Magic-link email (button + fallback URL).
     * @param name Recipient name (will be HTML-escaped)
     * @param magicLink One-time verification URL (will be safely escaped for attributes)
     */
    public static String buildMagicLinkEmailBody(String name, String magicLink) {
        String year = String.valueOf(java.time.Year.now().getValue());

        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <title>Email Verification</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body style="margin:0; padding:0; background-color:#f4f4f5; font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
            <table width="100%%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f4f4f5">
              <tr>
                <td align="center" style="padding:24px 12px;">
                  <table width="480" border="0" cellspacing="0" cellpadding="0"
                         style="width:480px; max-width:100%%; background-color:#ffffff; border-radius:12px;
                                box-shadow:0 6px 18px rgba(15,23,42,0.06); overflow:hidden;">
                    <tr>
                          <td align="center" style="padding:20px 24px 8px 24px; background:#1e305e;">
                        <span style="display:inline-block; font-size:18px; font-weight:600; color:#f9fafb;">
                          Comestag
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="padding:24px 24px 8px 24px;">
                        <h1 style="margin:0; font-size:20px; font-weight:600; color:#1e305e;">
                          Verify your email address
                        </h1>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="padding:0 24px 18px 24px; color:#4b5563; font-size:14px; line-height:1.6;">
                        <p style="margin:0 0 8px 0;">
                          Hi %s,
                        </p>
                        <p style="margin:0;">
                          Tap the button below to confirm your email address. This link will expire in <strong>10 minutes</strong>.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding:16px 24px 8px 24px;">
                        <!-- Button -->
                        <a href="%s"
                               style="display:inline-block; padding:14px 22px; border-radius:10px; background-color:#1e305e;
                                  color:#f9fafb; font-size:15px; font-weight:600; text-decoration:none;">
                          Verify Email
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="padding:12px 24px 18px 24px; color:#6b7280; font-size:12px; line-height:1.6;">
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding:14px 24px 18px 24px; border-top:1px solid #e5e7eb;
                                                color:#9ca3af; font-size:10px; line-height:1.6;">
                        <p style="margin:0;">
                          &copy; %s Comestag. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            </body>
            </html>
                """.formatted(escapeHtml(name), escapeAttr(magicLink), year);
    }

    /**
     * One-time 6-digit verification code email.
     * @param name Recipient name (HTML-escaped)
     * @param code Exactly 6 digits (validated, then HTML-escaped)
     */
    public static String buildSixDigitCodeEmailBody(String name, String code) {
        if (code == null || !code.matches("\\d{6}")) {
            throw new IllegalArgumentException("Verification code "+code+" must be exactly 6 digits.");
        }

        String year = String.valueOf(java.time.Year.now().getValue());

        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <title>Email Verification</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </head>
                <body style="margin:0; padding:0; background-color:#f4f4f5; font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                <table width="100%%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f4f4f5">
                  <tr>
                    <td align="center" style="padding:24px 12px;">
                      <table width="480" border="0" cellspacing="0" cellpadding="0"
                             style="width:480px; max-width:100%%; background-color:#ffffff; border-radius:12px;
                                    box-shadow:0 6px 18px rgba(15,23,42,0.06); overflow:hidden;">
                        <tr>
                          <td align="center" style="padding:20px 24px 8px 24px; background:#1e305e;">
                            <span style="display:inline-block; font-size:18px; font-weight:600; color:#f9fafb;">
                              Comestag
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style="padding:24px 24px 8px 24px;">
                            <h1 style="margin:0; font-size:20px; font-weight:600; color:#1e305e;">
                              Verify your email address
                            </h1>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style="padding:0 24px 18px 24px; color:#4b5563; font-size:14px; line-height:1.6;">
                            <p style="margin:0 0 8px 0;">
                              Hi %s,
                            </p>
                            <p style="margin:0;">
                              Use the verification code below to confirm your email address.
                              This code will expire in <strong>10 minutes</strong>.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding:16px 24px 8px 24px;">
                            <div style="display:inline-block; padding:14px 24px; border-radius:10px; background-color:#1e305e;
                                        color:#f9fafb; font-size:26px; font-weight:600; letter-spacing:8px;
                                        font-family:'SF Mono','Menlo',monospace;">
                              %s
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style="padding:12px 24px 18px 24px; color:#6b7280; font-size:12px; line-height:1.6;">
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding:14px 24px 18px 24px; border-top:1px solid #e5e7eb;
                                                    color:#9ca3af; font-size:10px; line-height:1.6;">
                            <p style="margin:0;">
                              &copy; %s Comestag. All rights reserved.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                </body>
                </html>
                """.formatted(escapeHtml(name), escapeHtml(code), year);
    }


    /**
     * Notify user that their account email has been changed.
     * If they did NOT perform this action, they can click a link to secure their account.
     *
     * @param name        Recipient name (HTML-escaped)
     * @param newEmail    New email address (HTML-escaped in body)
     * @param secureLink  URL to secure / recover the account (escaped for attributes)
     */
    public static String buildEmailChangedAlertBody(String name, String newEmail, String secureLink) {
        String year = String.valueOf(java.time.Year.now().getValue());

        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <title>Email Changed</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </head>
                <body style="margin:0; padding:0; background-color:#f4f4f5; font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                <table width="100%%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f4f4f5">
                  <tr>
                    <td align="center" style="padding:24px 12px;">
                      <table width="480" border="0" cellspacing="0" cellpadding="0"
                             style="width:480px; max-width:100%%; background-color:#ffffff; border-radius:12px;
                                    box-shadow:0 6px 18px rgba(15,23,42,0.06); overflow:hidden;">
                        <tr>
                          <td align="center" style="padding:20px 24px 8px 24px; background:#1e305e;">
                            <span style="display:inline-block; font-size:18px; font-weight:600; color:#f9fafb;">
                              Comestag
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style="padding:24px 24px 8px 24px;">
                            <h1 style="margin:0; font-size:20px; font-weight:600; color:#1e305e;">
                              Your email address was changed
                            </h1>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style="padding:0 24px 18px 24px; color:#4b5563; font-size:14px; line-height:1.6;">
                            <p style="margin:0 0 8px 0;">
                              Hi %s,
                            </p>
                            <p style="margin:0 0 8px 0;">
                              We’re letting you know that the email address on your Comestag account was just updated to:
                            </p>
                            <p style="margin:0 0 12px 0; font-weight:600; color:#111827;">
                              %s
                            </p>
                            <p style="margin:0;">
                              If you made this change, you can safely ignore this email.
                              If you <strong>didn’t</strong> change your email, please secure your account immediately.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding:16px 24px 8px 24px;">
                            <!-- Button -->
                            <a href="%s"
                               style="display:inline-block; padding:14px 22px; border-radius:10px; background-color:#b91c1c;
                                      color:#fef2f2; font-size:15px; font-weight:600; text-decoration:none;">
                              Secure my account
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding:14px 24px 18px 24px; border-top:1px solid #e5e7eb;
                                                    color:#9ca3af; font-size:10px; line-height:1.6;">
                            <p style="margin:0;">
                              &copy; %s Comestag. All rights reserved.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                </body>
                </html>
                """.formatted(
                escapeHtml(name),
                escapeHtml(newEmail),
                escapeAttr(secureLink),
                year
        );
    }

    /**
     * Notify an organization that a consumer has created a new testimonial on its profile.
     *
     * @param orgName          Organization display name (HTML-escaped)
     * @param consumerName     Consumer display name (HTML-escaped)
     * @param rating           Rating 1–5 (validated server-side)
     * @param comment          Testimonial comment (HTML-escaped, new lines → &lt;br&gt;)
     * @param myOrgProfileLink Link to view the testimonial / org profile (escaped for attributes)
     */
    public static String buildNewTestimonialNotificationBody(String orgName,
                                                             String consumerName,
                                                             int rating,
                                                             String comment,
                                                             String myOrgProfileLink) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5, got: " + rating);
        }

        String year = String.valueOf(java.time.Year.now().getValue());

        String safeOrgName = escapeHtml(orgName);
        String safeConsumerName = escapeHtml(consumerName);
        String safeComment = comment == null
                ? ""
                : escapeHtml(comment).replace("\n", "<br/>");
        String safeLink = escapeAttr(myOrgProfileLink);

        // Simple star representation: ★★★☆☆
        String fullStars = "★★★★★";
        String emptyStars = "☆☆☆☆☆";
        String stars = fullStars.substring(0, rating) + emptyStars.substring(rating);

        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <title>New testimonial received</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </head>
                <body style="margin:0; padding:0; background-color:#f4f4f5; font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                <table width="100%%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f4f4f5">
                  <tr>
                    <td align="center" style="padding:24px 12px;">
                      <table width="480" border="0" cellspacing="0" cellpadding="0"
                             style="width:480px; max-width:100%%; background-color:#ffffff; border-radius:12px;
                                    box-shadow:0 6px 18px rgba(15,23,42,0.06); overflow:hidden;">
                        <tr>
                          <td align="center" style="padding:20px 24px 8px 24px; background:#1e305e;">
                            <span style="display:inline-block; font-size:18px; font-weight:600; color:#f9fafb;">
                              Comestag
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style="padding:24px 24px 8px 24px;">
                            <h1 style="margin:0; font-size:20px; font-weight:600; color:#1e305e;">
                              You received a new testimonial
                            </h1>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style="padding:0 24px 18px 24px; color:#4b5563; font-size:14px; line-height:1.6;">
                            <p style="margin:0 0 8px 0;">
                              Hi %s,
                            </p>
                            <p style="margin:0 0 8px 0;">
                              <strong>%s</strong> just left a new testimonial on your Comestag profile.
                            </p>
                            <p style="margin:0 0 4px 0;">
                              <strong>Rating:</strong> %d / 5
                            </p>
                            <p style="margin:4px 0 12px 0; font-size:22px; font-weight:600; letter-spacing:4px;
                                      font-family:'SF Mono','Menlo',monospace; color:#f59e0b;">
                              %s
                            </p>
                            <p style="margin:0 0 4px 0; font-weight:600; color:#111827;">
                              Comment:
                            </p>
                            <p style="margin:0;">
                              %s
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding:16px 24px 8px 24px;">
                            <!-- Button -->
                            <a href="%s"
                               style="display:inline-block; padding:14px 22px; border-radius:10px; background-color:#1e305e;
                                      color:#f9fafb; font-size:15px; font-weight:600; text-decoration:none;">
                              View testimonial
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding:14px 24px 18px 24px; border-top:1px solid #e5e7eb;
                                                    color:#9ca3af; font-size:10px; line-height:1.6;">
                            <p style="margin:0;">
                              &copy; %s Comestag. All rights reserved.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                </body>
                </html>
                """.formatted(
                safeOrgName,
                safeConsumerName,
                rating,
                stars,
                safeComment,
                safeLink,
                year
        );
    }

    private static String escapeHtml(String input) {
        if (input == null) return "";
        return input
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;");
    }

    /**
     * Escape for inclusion inside HTML attributes (e.g., href="...").
     * We escape &, <, >, and double quotes.
     */
    private static String escapeAttr(String input) {
        if (input == null) return "";
        return input
                .replace("&", "&amp;")
                .replace("\"", "&quot;")
                .replace("<", "&lt;")
                .replace(">", "&gt;");
    }
}
