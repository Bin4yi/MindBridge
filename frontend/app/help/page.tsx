import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heart, ArrowLeft, Search, MessageCircle, Settings, BarChart3, Shield, Phone, Mail } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
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
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Help & Support</h1>
            <p className="text-muted-foreground">
              Find answers to common questions and get the most out of MindBridge
            </p>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search for help topics..." 
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Help Topics */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Help Topics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4 justify-start" asChild>
                  <Link href="#getting-started">
                    <MessageCircle className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Getting Started</div>
                      <div className="text-sm text-muted-foreground">Learn how to use MindBridge</div>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="h-auto p-4 justify-start" asChild>
                  <Link href="#voice-features">
                    <Settings className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Voice Features</div>
                      <div className="text-sm text-muted-foreground">Voice recording and settings</div>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="h-auto p-4 justify-start" asChild>
                  <Link href="#privacy-security">
                    <Shield className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Privacy & Security</div>
                      <div className="text-sm text-muted-foreground">How we protect your data</div>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="h-auto p-4 justify-start" asChild>
                  <Link href="#analytics">
                    <BarChart3 className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Understanding Analytics</div>
                      <div className="text-sm text-muted-foreground">Track your wellness journey</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Getting Started */}
          <Card id="getting-started">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>Getting Started with MindBridge</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Starting Your First Conversation</h3>
                  <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Go to the Chat page from your dashboard</li>
                    <li>Choose between voice or text input</li>
                    <li>For voice: Click the microphone and speak naturally</li>
                    <li>For text: Type your message in the input field</li>
                    <li>Our AI will respond with supportive and helpful guidance</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Best Practices</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Be honest about your feelings and experiences</li>
                    <li>Take your time - there&apos;s no rush in conversations</li>
                    <li>Use the crisis resources if you&apos;re having thoughts of self-harm</li>
                    <li>Remember that MindBridge complements, not replaces, professional care</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voice Features */}
          <Card id="voice-features">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Voice Features</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Using Voice Input</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Click the microphone button to start recording</li>
                    <li>Speak clearly and at a normal pace</li>
                    <li>Click the stop button when finished</li>
                    <li>Your voice is processed in real-time and not stored</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Voice Settings</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Adjust AI voice speed and tone in Settings</li>
                    <li>Choose from different voice personalities</li>
                    <li>Enable/disable voice responses</li>
                    <li>Set language preferences for better understanding</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Troubleshooting Voice Issues</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Check your microphone permissions in browser settings</li>
                    <li>Ensure you&apos;re in a quiet environment</li>
                    <li>Try refreshing the page if voice input stops working</li>
                    <li>Switch to text input if you continue having issues</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card id="privacy-security">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Privacy & Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Your Data Protection</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>All conversations are encrypted end-to-end</li>
                    <li>Voice recordings are processed in real-time and immediately deleted</li>
                    <li>We never share your personal health information</li>
                    <li>You can delete your account and data at any time</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Account Security</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Use a strong, unique password for your account</li>
                    <li>Enable two-factor authentication when available</li>
                    <li>Log out of shared or public devices</li>
                    <li>Report any suspicious account activity immediately</li>
                  </ul>
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline" asChild>
                    <Link href="/privacy">
                      <Shield className="w-4 h-4 mr-2" />
                      Privacy Policy
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/terms">
                      Terms of Service
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card id="analytics">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Understanding Your Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Mood Tracking</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Track your mood patterns over time</li>
                    <li>Identify triggers and positive influences</li>
                    <li>See progress in your mental wellness journey</li>
                    <li>Share insights with your healthcare provider</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Wellness Goals</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Set personal wellness goals</li>
                    <li>Track your progress toward achieving them</li>
                    <li>Celebrate milestones and improvements</li>
                    <li>Adjust goals as your needs change</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Data Export</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Export your data in CSV or PDF format</li>
                    <li>Share reports with healthcare providers</li>
                    <li>Keep personal records of your progress</li>
                    <li>Maintain data portability and ownership</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle>Still Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                If you can&apos;t find what you&apos;re looking for, we&apos;re here to help. Reach out to our support team:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4 justify-start">
                  <Link href="mailto:support@mindbridge.ai" className="w-full flex items-center">
                    <Mail className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Email Support</div>
                      <div className="text-sm text-muted-foreground">support@mindbridge.ai</div>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="h-auto p-4 justify-start">
                  <Link href="tel:0771234567" className="w-full flex items-center">
                    <Phone className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Phone Support</div>
                      <div className="text-sm text-muted-foreground">077-123-4567</div>
                    </div>
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Our support team typically responds within 24 hours during business days.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
