import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, ArrowLeft, Phone, MessageCircle, AlertTriangle, Clock, MapPin, Globe } from "lucide-react"
import Link from "next/link"

export default function CrisisPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">MindBridge</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          {/* Emergency Alert */}
          <Alert className="border-destructive/50 bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive font-medium">
              If you&apos;re having thoughts of self-harm or suicide, please reach out for help immediately. 
              You are not alone, and support is available 24/7.
            </AlertDescription>
          </Alert>

          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Crisis Resources</h1>
            <p className="text-muted-foreground">
              Immediate help and support resources for mental health crises
            </p>
          </div>

          {/* Emergency Contacts */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-destructive">
                <Phone className="w-5 h-5" />
                <span>Emergency Contacts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <h3 className="font-semibold mb-2">National Suicide Prevention Lifeline</h3>
                  <div className="space-y-2">
                    <Button className="w-full bg-destructive hover:bg-destructive/90" asChild>
                      <a href="tel:988">
                        <Phone className="w-4 h-4 mr-2" />
                        Call 988
                      </a>
                    </Button>
                    <p className="text-sm text-muted-foreground">Free, confidential, 24/7 crisis support</p>
                  </div>
                </div>

                <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <h3 className="font-semibold mb-2">Crisis Text Line</h3>
                  <div className="space-y-2">
                    <Button className="w-full bg-destructive hover:bg-destructive/90" asChild>
                      <a href="sms:741741?body=HOME">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Text HOME to 741741
                      </a>
                    </Button>
                    <p className="text-sm text-muted-foreground">Text-based crisis support</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 24/7 Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>24/7 Support Lines</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex justify-between items-center p-3 border border-border/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">SAMHSA National Helpline</h4>
                    <p className="text-sm text-muted-foreground">Treatment referral and information service</p>
                  </div>
                  <Button variant="outline" asChild>
                    <a href="tel:1-800-662-4357">
                      <Phone className="w-4 h-4 mr-2" />
                      1-800-662-HELP
                    </a>
                  </Button>
                </div>

                <div className="flex justify-between items-center p-3 border border-border/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">National Alliance on Mental Illness</h4>
                    <p className="text-sm text-muted-foreground">Information, support, and resources</p>
                  </div>
                  <Button variant="outline" asChild>
                    <a href="tel:1-800-950-6264">
                      <Phone className="w-4 h-4 mr-2" />
                      1-800-950-NAMI
                    </a>
                  </Button>
                </div>

                <div className="flex justify-between items-center p-3 border border-border/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Veterans Crisis Line</h4>
                    <p className="text-sm text-muted-foreground">For veterans and service members</p>
                  </div>
                  <Button variant="outline" asChild>
                    <a href="tel:1-800-273-8255">
                      <Phone className="w-4 h-4 mr-2" />
                      1-800-273-8255
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Online Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Online Resources</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex justify-between items-center p-3 border border-border/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Crisis Chat</h4>
                    <p className="text-sm text-muted-foreground">24/7 online crisis support chat</p>
                  </div>
                  <Button variant="outline" asChild>
                    <a href="https://suicidepreventionlifeline.org/chat/" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Start Chat
                    </a>
                  </Button>
                </div>

                <div className="flex justify-between items-center p-3 border border-border/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Mental Health America</h4>
                    <p className="text-sm text-muted-foreground">Mental health screening and resources</p>
                  </div>
                  <Button variant="outline" asChild>
                    <a href="https://www.mhanational.org" target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4 mr-2" />
                      Visit Site
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Local Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Find Local Help</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Find mental health professionals, support groups, and treatment facilities in your area.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="w-full" asChild>
                  <a href="https://findtreatment.samhsa.gov/" target="_blank" rel="noopener noreferrer">
                    <MapPin className="w-4 h-4 mr-2" />
                    Find Treatment Locator
                  </a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href="https://www.psychologytoday.com/us/therapists" target="_blank" rel="noopener noreferrer">
                    <MapPin className="w-4 h-4 mr-2" />
                    Find a Therapist
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200">Important Reminder</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    MindBridge is a supportive tool but is not a substitute for professional medical care or emergency services. 
                    If you&apos;re experiencing a medical emergency, please call 911 immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
