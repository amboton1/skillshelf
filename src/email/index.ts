import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type SendResourceUploadedEmailParams = {
  to: string;
  userName: string | null;
  resourceTitle: string;
  resourceSlug: string;
};

export async function sendResourceUploadedEmail({
  to,
  userName,
  resourceTitle,
  resourceSlug,
}: SendResourceUploadedEmailParams) {
  const resourceUrl = `${process.env.NEXT_PUBLIC_APP_URL}/resources/${resourceSlug}`;
  const displayName = userName ?? "there";

  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "noreply@skillshelf.com",
    to,
    subject: `Your resource "${resourceTitle}" has been uploaded`,
    html: `
      <p>Hi ${displayName},</p>
      <p>Your resource <strong>${resourceTitle}</strong> has been successfully uploaded to SkillShelf.</p>
      <p><a href="${resourceUrl}">View your resource</a></p>
      <p>— The SkillShelf Team</p>
    `,
  });
}

export default resend;
