import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    question: "Is VideoLoom really free right now?",
    answer:
      "Yes. During early access, every feature — transcription, dubbing, AI clips, AI chat, and playlists — is available on the Free plan within the platform limits listed above.",
  },
  {
    question: "What video sources are supported?",
    answer:
      "Paste a YouTube link, or upload an audio/video file directly (up to 25 MB per upload). Common formats like MP4, MOV, MP3, and WAV all work.",
  },
  {
    question: "Which languages can I dub into?",
    answer:
      "English, Urdu, Hindi, Chinese, German, and Spanish today, each with a natural neural voice. More languages are on the roadmap.",
  },
  {
    question: "Do I need a credit card to sign up?",
    answer: "No. Creating a Free account only requires an email address and password.",
  },
  {
    question: "What happens to my account when Pro and Business launch?",
    answer:
      "Your Free account keeps working exactly as it does today. Upgrading will be entirely optional.",
  },
];

export function PricingFaq() {
  return (
    <div className="mx-auto max-w-2xl">
      <Accordion>
        {FAQS.map((faq, index) => (
          <AccordionItem key={faq.question} value={`faq-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
