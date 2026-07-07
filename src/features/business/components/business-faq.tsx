import { mockBusiness } from '../data/mock-business';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function BusinessFaq({ business = mockBusiness }: { business?: typeof mockBusiness }) {
  const faqs = business.faqs || [];
  if (faqs.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl p-2 sm:p-4 border border-slate-100 dark:border-slate-800/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border-b-slate-100 dark:border-b-slate-800/60 last:border-0 px-4">
              <AccordionTrigger className="text-left font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed pb-5 text-[15px]">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
