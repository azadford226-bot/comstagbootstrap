package com.hivecontrolsolutions.comestag.core.domain.model;

import java.util.List;

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

    // ========== Business event email templates ==========

    private static String wrapInBrandedEmail(String title, String bodyHtml, String ctaText, String ctaLink) {
        String year = String.valueOf(java.time.Year.now().getValue());
        String ctaBlock = (ctaText == null || ctaLink == null) ? "" : """
                        <tr>
                          <td align="center" style="padding:16px 24px 8px 24px;">
                            <a href="%s"
                               style="display:inline-block; padding:14px 22px; border-radius:10px; background-color:#1e305e;
                                      color:#f9fafb; font-size:15px; font-weight:600; text-decoration:none;">
                              %s
                            </a>
                          </td>
                        </tr>
                """.formatted(escapeAttr(ctaLink), escapeHtml(ctaText));

        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <title>%s</title>
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
                              %s
                            </h1>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style="padding:0 24px 18px 24px; color:#4b5563; font-size:14px; line-height:1.6;">
                            %s
                          </td>
                        </tr>
                %s
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
                escapeHtml(title),
                escapeHtml(title),
                bodyHtml,
                ctaBlock,
                year
        );
    }

    public static String buildRfqNewEmailBody(String recipientName, String actorName, String rfqTitle, String rfqLink) {
        String body = """
                <p style="margin:0 0 8px 0;">Hi %s,</p>
                <p style="margin:0 0 8px 0;">
                  <strong>%s</strong> has invited you to submit a proposal for their RFQ:
                </p>
                <p style="margin:0 0 12px 0; font-weight:600; color:#111827;">%s</p>
                <p style="margin:0;">Review the details and submit your proposal before the deadline.</p>
                """.formatted(escapeHtml(recipientName), escapeHtml(actorName), escapeHtml(rfqTitle));
        return wrapInBrandedEmail("New RFQ Invitation", body, "View RFQ", rfqLink);
    }

    public static String buildRfqBidEmailBody(String recipientName, String bidderName, String rfqTitle, String rfqLink) {
        String body = """
                <p style="margin:0 0 8px 0;">Hi %s,</p>
                <p style="margin:0 0 8px 0;">
                  <strong>%s</strong> has submitted a new proposal for your RFQ:
                </p>
                <p style="margin:0 0 12px 0; font-weight:600; color:#111827;">%s</p>
                <p style="margin:0;">Review their proposal and compare it with other submissions.</p>
                """.formatted(escapeHtml(recipientName), escapeHtml(bidderName), escapeHtml(rfqTitle));
        return wrapInBrandedEmail("New Proposal Received", body, "Review Proposals", rfqLink);
    }

    public static String buildRfqAwardedEmailBody(String recipientName, String awardorName, String rfqTitle, String rfqLink) {
        String body = """
                <p style="margin:0 0 8px 0;">Hi %s,</p>
                <p style="margin:0 0 8px 0;">
                  Congratulations! <strong>%s</strong> has accepted your proposal for:
                </p>
                <p style="margin:0 0 12px 0; font-weight:600; color:#111827;">%s</p>
                <p style="margin:0;">You can now coordinate directly with the RFQ owner to begin the project.</p>
                """.formatted(escapeHtml(recipientName), escapeHtml(awardorName), escapeHtml(rfqTitle));
        return wrapInBrandedEmail("Proposal Accepted!", body, "View RFQ Details", rfqLink);
    }

    public static String buildMessageNewEmailBody(String recipientName, String senderName, String conversationLink) {
        String body = """
                <p style="margin:0 0 8px 0;">Hi %s,</p>
                <p style="margin:0 0 8px 0;">
                  You have a new message from <strong>%s</strong>.
                </p>
                <p style="margin:0;">Open your messages to continue the conversation.</p>
                """.formatted(escapeHtml(recipientName), escapeHtml(senderName));
        return wrapInBrandedEmail("New Message", body, "View Message", conversationLink);
    }

    public static String buildFollowEmailBody(String recipientName, String followerName, String profileLink) {
        String body = """
                <p style="margin:0 0 8px 0;">Hi %s,</p>
                <p style="margin:0 0 8px 0;">
                  <strong>%s</strong> started following you on Comestag.
                </p>
                <p style="margin:0;">Visit your profile to see your growing network.</p>
                """.formatted(escapeHtml(recipientName), escapeHtml(followerName));
        return wrapInBrandedEmail("New Follower", body, "View Profile", profileLink);
    }

    public static String buildOpportunityInterestEmailBody(String recipientName, String interestedName, String opportunityTitle, String opportunityLink) {
        String body = """
                <p style="margin:0 0 8px 0;">Hi %s,</p>
                <p style="margin:0 0 8px 0;">
                  <strong>%s</strong> has expressed interest in your opportunity:
                </p>
                <p style="margin:0 0 12px 0; font-weight:600; color:#111827;">%s</p>
                <p style="margin:0;">Review their profile and reach out to start a conversation.</p>
                """.formatted(escapeHtml(recipientName), escapeHtml(interestedName), escapeHtml(opportunityTitle));
        return wrapInBrandedEmail("New Interest in Your Opportunity", body, "View Opportunity", opportunityLink);
    }

    public static String buildDigestEmailBody(String recipientName, List<NotificationViewDm> notifications, String frequency) {
        String periodLabel = "daily".equals(frequency) ? "daily" : "weekly";

        StringBuilder rows = new StringBuilder();
        for (NotificationViewDm n : notifications) {
            String label = notificationLabel(n.getType());
            String timeAgo = relativeTime(n.getCreatedAt());
            rows.append("""
                    <tr>
                      <td style="padding:8px 12px; border-bottom:1px solid #f3f4f6; color:#1e305e; font-size:13px; font-weight:600;">
                        %s
                      </td>
                      <td style="padding:8px 12px; border-bottom:1px solid #f3f4f6; color:#6b7280; font-size:12px; text-align:right;">
                        %s
                      </td>
                    </tr>
                    """.formatted(escapeHtml(label), escapeHtml(timeAgo)));
        }

        String body = """
                <p style="margin:0 0 8px 0;">Hi %s,</p>
                <p style="margin:0 0 16px 0;">
                  Here's your %s summary — you have <strong>%d</strong> notification%s.
                </p>
                <table width="100%%" border="0" cellspacing="0" cellpadding="0"
                       style="border-radius:8px; overflow:hidden; border:1px solid #e5e7eb;">
                  <tr>
                    <th style="padding:10px 12px; background:#f9fafb; text-align:left; font-size:12px; color:#6b7280; font-weight:600;">
                      Activity
                    </th>
                    <th style="padding:10px 12px; background:#f9fafb; text-align:right; font-size:12px; color:#6b7280; font-weight:600;">
                      When
                    </th>
                  </tr>
                  %s
                </table>
                """.formatted(
                escapeHtml(recipientName),
                periodLabel,
                notifications.size(),
                notifications.size() == 1 ? "" : "s",
                rows.toString()
        );
        return wrapInBrandedEmail("Your " + periodLabel + " Comestag digest", body, "View All Notifications", null);
    }

    private static String notificationLabel(String type) {
        if (type == null) return "Notification";
        return switch (type) {
            case "RFQ_NEW" -> "New RFQ invitation";
            case "RFQ_BID" -> "New proposal received";
            case "RFQ_AWARDED" -> "Proposal accepted";
            case "RFQ_CLOSED" -> "RFQ closed";
            case "MESSAGE_NEW" -> "New message";
            case "FOLLOW" -> "New follower";
            case "OPPORTUNITY_NEW" -> "New opportunity";
            case "OPPORTUNITY_INTEREST" -> "Interest in your opportunity";
            case "POST_COMMENTED", "POST_COMMENT" -> "New comment on your post";
            case "POST_REACTED", "POST_LIKE" -> "New reaction on your post";
            case "TESTIMONIAL_ADDED" -> "New testimonial received";
            case "ORG_APPROVAL_CHANGED" -> "Organization status updated";
            default -> "Notification";
        };
    }

    private static String relativeTime(java.time.Instant instant) {
        if (instant == null) return "";
        long seconds = java.time.Duration.between(instant, java.time.Instant.now()).getSeconds();
        if (seconds < 60) return "just now";
        long minutes = seconds / 60;
        if (minutes < 60) return minutes + "m ago";
        long hours = minutes / 60;
        if (hours < 24) return hours + "h ago";
        long days = hours / 24;
        return days + "d ago";
    }
}
