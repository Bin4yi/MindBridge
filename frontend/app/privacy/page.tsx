import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, ArrowLeft, Shield, Lock, Eye, Database, UserCheck } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Our Commitment to Your Privacy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                At MindBridge, we understand that your mental health information is deeply personal and sensitive. 
                We are committed to protecting your privacy and maintaining the confidentiality of your data while 
                providing you with the best possible AI-powered mental health support.
              </p>
              <p className="text-muted-foreground">
                This Privacy Policy explains how we collect, use, protect, and share your information when you use 
                our voice-based AI mental health companion service.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Information We Collect</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Name and email address</li>
                    <li>Age and demographic information (optional)</li>
                    <li>Account credentials and preferences</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Health Information</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Conversations and interactions with our AI</li>
                    <li>Mood tracking and wellness data</li>
                    <li>Voice recordings (processed and deleted immediately)</li>
                    <li>Self-reported mental health information</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Technical Information</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Device information and operating system</li>
                    <li>Usage patterns and app interactions</li>
                    <li>IP address and general location data</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5" />
                <span>How We Use Your Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="p-3 border border-border/50 rounded-lg">
                  <h4 className="font-medium mb-2">Provide Mental Health Support</h4>
                  <p className="text-sm text-muted-foreground">
                    To understand your needs and provide personalized, empathetic responses and recommendations.
                  </p>
                </div>

                <div className="p-3 border border-border/50 rounded-lg">
                  <h4 className="font-medium mb-2">Improve Our Service</h4>
                  <p className="text-sm text-muted-foreground">
                    To analyze usage patterns and improve our AI&apos;s ability to provide helpful support.
                  </p>
                </div>

                <div className="p-3 border border-border/50 rounded-lg">
                  <h4 className="font-medium mb-2">Crisis Detection</h4>
                  <p className="text-sm text-muted-foreground">
                    To identify signs of crisis and connect you with appropriate emergency resources when needed.
                  </p>
                </div>

                <div className="p-3 border border-border/50 rounded-lg">
                  <h4 className="font-medium mb-2">Communication</h4>
                  <p className="text-sm text-muted-foreground">
                    To send you important updates about our service and mental health resources.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>How We Protect Your Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="p-3 border border-border/50 rounded-lg bg-green-50 dark:bg-green-950/20">
                  <h4 className="font-medium mb-2 text-green-800 dark:text-green-200">End-to-End Encryption</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    All conversations and personal data are encrypted both in transit and at rest.
                  </p>
                </div>

                <div className="p-3 border border-border/50 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">Minimal Data Storage</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Voice recordings are processed in real-time and immediately deleted. We only store essential conversation metadata.
                  </p>
                </div>

                <div className="p-3 border border-border/50 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                  <h4 className="font-medium mb-2 text-purple-800 dark:text-purple-200">HIPAA Compliance</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Our systems follow healthcare industry standards for protecting sensitive health information.
                  </p>
                </div>

                <div className="p-3 border border-border/50 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                  <h4 className="font-medium mb-2 text-orange-800 dark:text-orange-200">Access Controls</h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Strict employee access controls ensure only authorized personnel can access systems containing user data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Data Sharing and Disclosure</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-3 border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 rounded-lg">
                  <h4 className="font-medium mb-2 text-red-800 dark:text-red-200">We Never Share Your Personal Health Information</h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    We do not sell, rent, or share your personal health information with third parties for marketing purposes.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Limited Exceptions</h4>
                  <p className="text-sm text-muted-foreground mb-2">We may disclose your information only in these specific circumstances:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>When you provide explicit consent</li>
                    <li>To prevent imminent harm to yourself or others</li>
                    <li>When required by law or legal process</li>
                    <li>To trusted service providers who help us operate our service (under strict confidentiality agreements)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Access and review your personal data</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Request corrections to inaccurate information</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Delete your account and associated data</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Export your data in a portable format</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Opt-out of non-essential data collection</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                If you have questions about this Privacy Policy or how we handle your data, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-sm"><strong>Email:</strong> privacy@mindbridge.ai</p>
                <p className="text-sm"><strong>Address:</strong> MindBridge Privacy Office, [Address]</p>
                <p className="text-sm"><strong>Phone:</strong> 077-123-4567</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
