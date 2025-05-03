import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Lock, MessageCircle, Settings, Users } from "lucide-react";

export function FeatureSection() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Monetize Your Group</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform provides all the tools you need to turn your Telegram community into a profitable business.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Users className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl">Automated Member Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Automatically manage member access based on payment status without manual intervention.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <CreditCard className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl">Seamless Payment Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Accept payments via multiple methods with our secure payment gateway integration.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <MessageCircle className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl">Telegram Bot Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">Our bot handles invites, removals, and payment reminders automatically.</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Settings className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl">Customizable Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Set your own pricing, subscription periods, and access rules for complete control.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Lock className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl">Secure Access Control</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Automatically remove members with expired subscriptions to maintain group integrity.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <CreditCard className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl">Revenue Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">Track your earnings, subscriber growth, and retention with detailed analytics.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
