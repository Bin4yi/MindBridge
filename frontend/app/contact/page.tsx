import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, ArrowLeft, Mail, Phone, MapPin, MessageCircle, Clock, Send } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
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
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Contact Us</h1>
            <p className="text-muted-foreground">
              We&apos;re here to help. Reach out to us through any of the channels below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Send us a Message</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Your first name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Your last name" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your@email.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="What is this regarding?" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <Button className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>

                <p className="text-xs text-muted-foreground">
                  We typically respond within 24 hours during business days.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Direct Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <a href="mailto:support@mindbridge.ai" className="block no-underline">
                      <div className="flex items-center space-x-3 p-3 border border-border/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/10 transition">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">Email Support</h4>
                          <p className="text-sm text-muted-foreground">support@mindbridge.ai</p>
                        </div>
                      </div>
                    </a>

                    <a href="tel:0771234567" className="block no-underline">
                      <div className="flex items-center space-x-3 p-3 border border-border/50 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/10 transition">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                          <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">Phone Support</h4>
                          <p className="text-sm text-muted-foreground">077-123-4567</p>
                        </div>
                      </div>
                    </a>

                    <div className="flex items-center space-x-3 p-3 border border-border/50 rounded-lg">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Office Address</h4>
                        <p className="text-sm text-muted-foreground">
                          5th floor, Wellness Center<br />
                          123, Reid Avenue<br />
                          Colombo 07, Sri Lanka
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Support Hours</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Monday - Friday</span>
                      <span className="text-sm text-muted-foreground">9:00 AM - 6:00 PM PST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Saturday</span>
                      <span className="text-sm text-muted-foreground">10:00 AM - 4:00 PM PST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Sunday</span>
                      <span className="text-sm text-muted-foreground">Closed</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    For mental health emergencies, please call 988 or visit our crisis resources page.
                  </p>
                </CardContent>
              </Card>

              {/* FAQ Link */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <h4 className="font-medium">Looking for Quick Answers?</h4>
                    <p className="text-sm text-muted-foreground">
                      Check out our help center for frequently asked questions and guides.
                    </p>
                    <Button variant="outline" asChild>
                      <Link href="/help">
                        Visit Help Center
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Different Contact Types */}
          <Card>
            <CardHeader>
              <CardTitle>Contact by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-border/50 rounded-lg text-center">
                  <h4 className="font-medium mb-2">Technical Support</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    App issues, login problems, account help
                  </p>
                  <a href="mailto:tech@mindbridge.ai" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    tech@mindbridge.ai
                  </a>
                </div>

                <div className="p-4 border border-border/50 rounded-lg text-center">
                  <h4 className="font-medium mb-2">Privacy & Security</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Data protection, privacy concerns
                  </p>
                  <a href="mailto:privacy@mindbridge.ai" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    privacy@mindbridge.ai
                  </a>
                </div>

                <div className="p-4 border border-border/50 rounded-lg text-center">
                  <h4 className="font-medium mb-2">Partnerships</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Healthcare partnerships, integrations
                  </p>
                  <a href="mailto:tech@mindbridge.ai" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    tech@mindbridge.ai
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
