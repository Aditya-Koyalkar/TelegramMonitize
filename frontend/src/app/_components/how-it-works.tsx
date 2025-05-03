import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">How It Works</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple 3-Step Process</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Get your Telegram group monetized in minutes with our easy setup process.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
          <Card className="relative overflow-hidden border-2 border-primary/20">
            <div className="absolute -top-6 -left-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              1
            </div>
            <CardContent className="flex flex-col items-center gap-4 p-6 pt-10 text-center">
              <div className="rounded-full bg-muted p-2">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Create a group"
                  width={100}
                  height={100}
                  className="h-16 w-16 rounded-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Create & Connect</h3>
                <p className="text-muted-foreground">Create a Telegram group and add our bot as an administrator with the necessary permissions.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden border-2 border-primary/20">
            <div className="absolute -top-6 -left-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              2
            </div>
            <CardContent className="flex flex-col items-center gap-4 p-6 pt-10 text-center">
              <div className="rounded-full bg-muted p-2">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Configure settings"
                  width={100}
                  height={100}
                  className="h-16 w-16 rounded-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Configure Settings</h3>
                <p className="text-muted-foreground">Set your subscription price, payment methods, and access rules in our dashboard.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden border-2 border-primary/20">
            <div className="absolute -top-6 -left-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              3
            </div>
            <CardContent className="flex flex-col items-center gap-4 p-6 pt-10 text-center">
              <div className="rounded-full bg-muted p-2">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Start earning"
                  width={100}
                  height={100}
                  className="h-16 w-16 rounded-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Start Earning</h3>
                <p className="text-muted-foreground">
                  Share your group link and our bot will handle payments, invites, and member management automatically.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mx-auto max-w-3xl rounded-lg border bg-muted/50 p-6 text-center shadow-sm">
          <h3 className="text-xl font-bold">How Members Join Your Paid Group</h3>
          <div className="mt-4 flex flex-col gap-4 md:flex-row">
            <div className="flex-1 rounded-md bg-background p-4 shadow-sm">
              <p className="font-medium">1. Member finds your group link</p>
            </div>
            <div className="flex-1 rounded-md bg-background p-4 shadow-sm">
              <p className="font-medium">2. They pay the subscription fee</p>
            </div>
            <div className="flex-1 rounded-md bg-background p-4 shadow-sm">
              <p className="font-medium">3. Our bot sends them an invite link</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
