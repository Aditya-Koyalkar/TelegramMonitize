import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FaqSection() {
  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">FAQ</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Everything you need to know about Telegram Monitizer.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl py-12">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How does the payment process work?</AccordionTrigger>
              <AccordionContent>
                When a user wants to join your group, they'll be directed to a secure payment page. After successful payment, our bot automatically
                sends them an invite link to join your group. The funds are transferred to your account after our service fee.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What happens when a member's subscription expires?</AccordionTrigger>
              <AccordionContent>
                Our bot will automatically send payment reminders before expiration. If payment isn't renewed, the bot will remove the member from
                your group and notify them about the reason for removal.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What permissions does your bot need?</AccordionTrigger>
              <AccordionContent>
                Our bot needs administrator permissions to manage members (add and remove), send messages for payment notifications, and generate
                invite links. These permissions are essential for the service to function properly.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Can I offer different subscription tiers?</AccordionTrigger>
              <AccordionContent>
                Yes! With our Professional and Enterprise plans, you can create multiple subscription tiers with different pricing and access levels
                for the same group or across multiple groups.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>How do I get paid?</AccordionTrigger>
              <AccordionContent>
                We process payments and transfer the funds to your connected payment account (PayPal, Stripe, or bank account) automatically. You can
                set your preferred payout frequency in the dashboard settings.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>Is there a limit to how much I can charge?</AccordionTrigger>
              <AccordionContent>
                No, you have complete freedom to set your own pricing based on the value you provide. Our platform supports subscription prices from
                $1 to $1000 per month or one-time payments.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
