import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, ArrowLeft, FileText, AlertTriangle, Shield, Users } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
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
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Important Notice */}
          <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              <strong>Important:</strong> MindBridge is a supportive AI companion and is not a substitute for professional 
              medical care, therapy, or emergency services. If you are experiencing a mental health crisis, please 
              contact emergency services or call 988 for the Suicide & Crisis Lifeline.
            </AlertDescription>
          </Alert>

          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Agreement to Terms</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Welcome to MindBridge, an AI-powered mental health companion. By using our service, you agree to these 
                Terms of Service (&quot;Terms&quot;). Please read them carefully.
              </p>
              <p className="text-muted-foreground">
                These Terms constitute a legally binding agreement between you and MindBridge regarding your use of 
                our voice-based AI mental health support service.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Our Service</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">What MindBridge Provides</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>AI-powered conversational support for mental wellness</li>
                    <li>Voice and text-based interaction capabilities</li>
                    <li>Mood tracking and wellness insights</li>
                    <li>Crisis detection and resource recommendations</li>
                    <li>Personalized coping strategies and self-care suggestions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">What MindBridge Does Not Provide</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Professional medical diagnosis or treatment</li>
                    <li>Licensed therapy or counseling services</li>
                    <li>Emergency mental health intervention</li>
                    <li>Prescription medication recommendations</li>
                    <li>Replacement for professional healthcare providers</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Your Responsibilities</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="p-3 border border-border/50 rounded-lg">
                  <h4 className="font-medium mb-2">Accurate Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Provide truthful and accurate information to help our AI provide appropriate support.
                  </p>
                </div>

                <div className="p-3 border border-border/50 rounded-lg">
                  <h4 className="font-medium mb-2">Appropriate Use</h4>
                  <p className="text-sm text-muted-foreground">
                    Use the service for its intended purpose of mental health support and wellness.
                  </p>
                </div>

                <div className="p-3 border border-border/50 rounded-lg">
                  <h4 className="font-medium mb-2">Account Security</h4>
                  <p className="text-sm text-muted-foreground">
                    Keep your account credentials secure and notify us of any unauthorized access.
                  </p>
                </div>

                <div className="p-3 border border-border/50 rounded-lg">
                  <h4 className="font-medium mb-2">Professional Care</h4>
                  <p className="text-sm text-muted-foreground">
                    Continue working with your healthcare providers and seek professional help when needed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Limitations and Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Limitations and Disclaimers</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-3 border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 rounded-lg">
                  <h4 className="font-medium mb-2 text-red-800 dark:text-red-200">No Medical Advice</h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    MindBridge does not provide medical advice, diagnosis, or treatment. Our AI responses are for 
                    informational and supportive purposes only.
                  </p>
                </div>

                <div className="p-3 border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 rounded-lg">
                  <h4 className="font-medium mb-2 text-amber-800 dark:text-amber-200">AI Limitations</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    While our AI is designed to be helpful and supportive, it may not always understand context 
                    perfectly or provide optimal responses. Use your judgment and seek human support when needed.
                  </p>
                </div>

                <div className="p-3 border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800 rounded-lg">
                  <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">Service Availability</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    While we strive for high availability, our service may occasionally be unavailable due to 
                    maintenance, technical issues, or other factors beyond our control.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crisis Situations */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                <span>Crisis Situations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  If you are experiencing thoughts of self-harm, suicide, or harming others:
                </p>
                <div className="grid gap-2">
                  <div className="flex items-center space-x-3 p-2 bg-destructive/10 rounded-lg">
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    <span className="text-sm">Call 988 (Suicide & Crisis Lifeline) immediately</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 bg-destructive/10 rounded-lg">
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    <span className="text-sm">Contact emergency services (911) if in immediate danger</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 bg-destructive/10 rounded-lg">
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    <span className="text-sm">Reach out to a trusted friend, family member, or healthcare provider</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  MindBridge may detect crisis indicators in your conversations and provide resources, but this 
                  should not be relied upon as the primary means of crisis intervention.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy and Data */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy and Data Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Your privacy is important to us. Our collection, use, and protection of your personal information 
                is governed by our Privacy Policy, which is incorporated into these Terms by reference.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" asChild>
                  <Link href="/privacy">
                    <Shield className="w-4 h-4 mr-2" />
                    Privacy Policy
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Modifications to Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to These Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We may update these Terms of Service from time to time. We will notify you of any material changes 
                by posting the new Terms on this page and updating the &quot;Last updated&quot; date at the top of this document.
              </p>
              <p className="text-muted-foreground">
                Your continued use of MindBridge after any changes indicates your acceptance of the new Terms.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-sm"><strong>Email:</strong> legal@mindbridge.ai</p>
                <p className="text-sm"><strong>Address:</strong> MindBridge Legal Department, [Address]</p>
                <p className="text-sm"><strong>Phone:</strong> 077-123-4567</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
