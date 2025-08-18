import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, ArrowLeft, Users, Target, Shield, Lightbulb, Award, Globe } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
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
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">About MindBridge</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Bridging the gap between you and mental wellness through compassionate AI support
            </p>
          </div>

          {/* Our Mission */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Our Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                At MindBridge, we believe that everyone deserves access to compassionate, immediate mental health support. 
                Our mission is to make mental wellness resources available 24/7 through advanced AI technology that 
                understands, empathizes, and provides meaningful support.
              </p>
              <p className="text-muted-foreground">
                We&apos;re not here to replace human therapists or medical professionals—we&apos;re here to bridge the gap, 
                providing support when you need it most while encouraging and facilitating connections to professional care.
              </p>
            </CardContent>
          </Card>

          {/* Our Values */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Our Values</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Compassion</h3>
                      <p className="text-sm text-muted-foreground">Every interaction is guided by empathy and understanding</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Privacy</h3>
                      <p className="text-sm text-muted-foreground">Your data and conversations are protected with the highest security</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Accessibility</h3>
                      <p className="text-sm text-muted-foreground">Mental health support should be available to everyone, everywhere</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Innovation</h3>
                      <p className="text-sm text-muted-foreground">Continuously improving through cutting-edge AI research</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5" />
                <span>How MindBridge Works</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start space-x-4 p-4 border border-border/50 rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Natural Conversation</h3>
                    <p className="text-sm text-muted-foreground">
                      Speak or type naturally about your thoughts, feelings, and concerns. Our AI listens without judgment.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 border border-border/50 rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">AI Understanding</h3>
                    <p className="text-sm text-muted-foreground">
                      Advanced AI processes your words, emotions, and context to understand your unique situation and needs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 border border-border/50 rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Personalized Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive tailored responses, coping strategies, and resources based on your specific needs and goals.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 border border-border/50 rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Continuous Care</h3>
                    <p className="text-sm text-muted-foreground">
                      Track your progress over time and receive ongoing support that adapts to your evolving needs.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Our Team */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Our Team</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                MindBridge is built by a diverse team of mental health professionals, AI researchers, and software engineers 
                who are passionate about making mental wellness support more accessible and effective.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold">Mental Health Experts</h3>
                  <p className="text-sm text-muted-foreground">Licensed therapists and psychologists guide our approach</p>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto">
                    <Lightbulb className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold">AI Researchers</h3>
                  <p className="text-sm text-muted-foreground">PhD-level experts in natural language processing and empathetic AI</p>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto">
                    <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold">Security Engineers</h3>
                  <p className="text-sm text-muted-foreground">Ensuring your data remains private and secure</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recognition */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Recognition & Partnerships</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border border-border/50 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                  <h4 className="font-medium mb-1">Healthcare Innovation Award 2024</h4>
                  <p className="text-sm text-muted-foreground">Recognized for advancing AI in mental health support</p>
                </div>
                
                <div className="p-3 border border-border/50 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
                  <h4 className="font-medium mb-1">NAMI Partnership</h4>
                  <p className="text-sm text-muted-foreground">Collaborating with the National Alliance on Mental Illness</p>
                </div>
                
                <div className="p-3 border border-border/50 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
                  <h4 className="font-medium mb-1">Privacy Shield Certified</h4>
                  <p className="text-sm text-muted-foreground">Highest standards for data protection and privacy</p>
                </div>
                
                <div className="p-3 border border-border/50 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                  <h4 className="font-medium mb-1">Research Publications</h4>
                  <p className="text-sm text-muted-foreground">Contributing to academic research in AI empathy</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Have questions about MindBridge or want to learn more about our mission? We&apos;d love to hear from you.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" asChild>
                  <Link href="/help">
                    Get Support
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contact">
                    Contact Us
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">
                    Start Your Journey
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
