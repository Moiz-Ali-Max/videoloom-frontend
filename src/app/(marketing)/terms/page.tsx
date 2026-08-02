import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/marketing/legal-layout";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that govern your use of VideoLoom.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions" lastUpdated="July 27, 2026">
      <LegalSection title="1. Acceptance of terms">
        <p>
          By creating an account or using VideoLoom (&ldquo;we&rdquo;, &ldquo;us&rdquo;, the
          &ldquo;Service&rdquo;), you agree to these Terms & Conditions. If you don&rsquo;t agree,
          please don&rsquo;t use the Service.
        </p>
      </LegalSection>

      <LegalSection title="2. Description of the service">
        <p>VideoLoom lets you:</p>
        <ul>
          <li>Transcribe YouTube videos or uploaded audio/video files</li>
          <li>Dub a transcribed video into another supported language with AI voices</li>
          <li>Generate short-form vertical clips from a video with animated captions</li>
          <li>Chat with an AI assistant about a video&rsquo;s transcript</li>
          <li>Organize transcriptions, dubs, and clips into playlists</li>
        </ul>
        <p>
          The Service is under active development. Features, limits, and this document may change
          as we build out new capabilities.
        </p>
      </LegalSection>

      <LegalSection title="3. Accounts">
        <p>
          You must provide an accurate email address and are responsible for keeping your password
          confidential and for all activity under your account. You must be at least 13 years old
          to use the Service.
        </p>
      </LegalSection>

      <LegalSection title="4. Acceptable use">
        <p>You agree not to:</p>
        <ul>
          <li>Submit content you don&rsquo;t have the legal right to transcribe, dub, or clip</li>
          <li>Use the Service for unlawful, harassing, or infringing purposes</li>
          <li>Attempt to bypass rate limits, authentication, or other access controls</li>
          <li>Reverse engineer, scrape, or resell the Service without our written permission</li>
        </ul>
        <p>
          When you submit a YouTube URL, you&rsquo;re responsible for complying with
          YouTube&rsquo;s own Terms of Service. VideoLoom is not affiliated with or endorsed by
          YouTube or Google.
        </p>
      </LegalSection>

      <LegalSection title="5. Your content">
        <p>
          You retain ownership of everything you upload and everything VideoLoom generates from
          it. By submitting content, you grant us a limited license to process, store, and
          transmit it solely to provide the Service to you.
        </p>
      </LegalSection>

      <LegalSection title="6. AI-generated output">
        <p>
          Transcripts, translations, dubbed audio, clip selections, and chat replies are generated
          by automated AI models and may contain errors, mistranslations, or inaccuracies. Review
          AI-generated output before publishing or relying on it.
        </p>
      </LegalSection>

      <LegalSection title="7. Availability and changes">
        <p>
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without
          uptime guarantees, especially during this early-access period. We may add, change, or
          remove features at any time.
        </p>
      </LegalSection>

      <LegalSection title="8. Pricing">
        <p>
          VideoLoom is currently free to use. If we introduce paid plans, pricing and billing terms
          will be clearly disclosed before you&rsquo;re charged anything.
        </p>
      </LegalSection>

      <LegalSection title="9. Termination">
        <p>
          We may suspend or terminate accounts that violate these terms. You may stop using the
          Service and request account deletion at any time.
        </p>
      </LegalSection>

      <LegalSection title="10. Limitation of liability">
        <p>
          To the fullest extent permitted by law, VideoLoom is not liable for indirect, incidental,
          or consequential damages arising from your use of the Service, including reliance on
          AI-generated output.
        </p>
      </LegalSection>

      <LegalSection title="11. Governing law">
        <p>
          These terms are governed by the laws of the jurisdiction in which VideoLoom operates,
          without regard to conflict-of-law principles.
        </p>
      </LegalSection>

      <LegalSection title="12. Changes to these terms">
        <p>
          We may update these terms as the Service evolves. Continued use after a change means you
          accept the updated terms.
        </p>
      </LegalSection>

      <LegalSection title="13. Contact">
        <p>
          Questions about these terms can be sent to{" "}
          <a href="mailto:legal@videoloom.example">legal@videoloom.example</a>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
