import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/marketing/legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How VideoLoom collects, uses, and protects your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="July 27, 2026">
      <LegalSection title="1. Introduction">
        <p>
          This Privacy Policy explains what information VideoLoom (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;) collects when you use our website and dashboard (the
          &ldquo;Service&rdquo;), and how we use, store, and protect it.
        </p>
      </LegalSection>

      <LegalSection title="2. Information we collect">
        <p>
          <strong>Account information.</strong> When you sign up, we collect your email address
          and a securely hashed password, handled through our authentication provider, Supabase.
        </p>
        <p>
          <strong>Content you submit.</strong> This includes YouTube URLs, uploaded audio/video
          files (up to 25 MB), the transcripts, dubbed audio/video, and clips generated from them,
          and messages you send to the AI video chat assistant.
        </p>
        <p>
          <strong>Usage and job data.</strong> We store metadata about each transcription,
          dubbing, and clip job — status, progress, timestamps, and error messages — so you can
          track and manage your work.
        </p>
      </LegalSection>

      <LegalSection title="3. How we use your information">
        <ul>
          <li>To provide transcription, dubbing, AI clip generation, chat, and playlist features</li>
          <li>To authenticate you and keep your account secure</li>
          <li>To enforce rate limits and prevent abuse of the Service</li>
          <li>To diagnose errors and improve reliability</li>
        </ul>
        <p>We do not sell your personal information or your content to third parties.</p>
      </LegalSection>

      <LegalSection title="4. Third-party services we use">
        <p>
          Providing the Service requires sending parts of your content to the following
          infrastructure and AI providers, solely to process your requests:
        </p>
        <ul>
          <li>
            <strong>Supabase</strong> — authentication, database, and file storage
          </li>
          <li>
            <strong>Groq</strong> — Whisper-based audio transcription and the large language
            models behind translation and the AI chat assistant
          </li>
          <li>
            <strong>Microsoft Edge neural voices</strong> — text-to-speech audio for dubbed videos
          </li>
          <li>
            <strong>YouTube</strong> — fetching publicly available video/audio when you submit a
            YouTube URL
          </li>
        </ul>
        <p>Each provider processes this data under its own privacy terms.</p>
      </LegalSection>

      <LegalSection title="5. Data retention and deletion">
        <p>
          You can delete individual transcriptions, dubs, clips, and playlists at any time from
          your dashboard — this permanently removes the associated files from storage. To delete
          your account entirely, contact us using the details below.
        </p>
      </LegalSection>

      <LegalSection title="6. Cookies and local storage">
        <p>
          We don&rsquo;t use tracking or advertising cookies. Your session tokens are stored in
          your browser&rsquo;s local storage to keep you signed in, and are removed when you log
          out or your session expires.
        </p>
      </LegalSection>

      <LegalSection title="7. Security">
        <p>
          Access to your account and content is protected by token-based authentication and
          per-endpoint rate limiting. No method of transmission or storage is 100% secure, and we
          can&rsquo;t guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="8. Children's privacy">
        <p>
          The Service is not directed at children under 13, and we do not knowingly collect
          information from them.
        </p>
      </LegalSection>

      <LegalSection title="9. International data transfers">
        <p>
          Our infrastructure providers may process and store data in countries other than your
          own. By using the Service, you consent to this transfer.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to this policy">
        <p>
          We may update this policy as the Service evolves. Material changes will be reflected by
          updating the &ldquo;Last updated&rdquo; date above.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact">
        <p>
          Questions about this policy can be sent to{" "}
          <a href="mailto:privacy@videoloom.example">privacy@videoloom.example</a>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
