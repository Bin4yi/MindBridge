import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heart, ArrowLeft, Search, BookOpen, Video, Headphones, Users, Download, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function ResourcesPage() {
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

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Mental Health Resources</h1>
            <p className="text-muted-foreground">
              Curated resources to support your mental wellness journey
            </p>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search resources..." 
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Resource Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <BookOpen className="w-6 h-6" />
              <span>Articles</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <Video className="w-6 h-6" />
              <span>Videos</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <Headphones className="w-6 h-6" />
              <span>Podcasts</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <Users className="w-6 h-6" />
              <span>Support Groups</span>
            </Button>
          </div>

          {/* Featured Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Featured Articles</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="space-y-3">
                    <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Understanding Anxiety: A Beginner&apos;s Guide</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Learn about anxiety symptoms, causes, and effective coping strategies.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">5 min read</span>
                        <Button size="sm" variant="ghost">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Read
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="space-y-3">
                    <div className="w-full h-32 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center">
                      <Heart className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Building Emotional Resilience</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Practical techniques to strengthen your emotional well-being.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">7 min read</span>
                        <Button size="sm" variant="ghost">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Read
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="space-y-3">
                    <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg flex items-center justify-center">
                      <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">The Power of Social Connection</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        How relationships impact mental health and ways to build connections.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">6 min read</span>
                        <Button size="sm" variant="ghost">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Read
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guided Exercises */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Headphones className="w-5 h-5" />
                <span>Guided Exercises</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-border/50 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Headphones className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Deep Breathing Exercise</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        A 5-minute guided breathing exercise to reduce stress and anxiety.
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button size="sm">
                          <Headphones className="w-3 h-3 mr-1" />
                          Listen
                        </Button>
                        <span className="text-xs text-muted-foreground">5 min</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-border/50 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Progressive Muscle Relaxation</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Release physical tension with this guided relaxation technique.
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button size="sm">
                          <Headphones className="w-3 h-3 mr-1" />
                          Listen
                        </Button>
                        <span className="text-xs text-muted-foreground">12 min</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-border/50 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Mindfulness Meditation</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Practice present-moment awareness with guided mindfulness.
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button size="sm">
                          <Headphones className="w-3 h-3 mr-1" />
                          Listen
                        </Button>
                        <span className="text-xs text-muted-foreground">10 min</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-border/50 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Gratitude Practice</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Cultivate positivity with a guided gratitude meditation.
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button size="sm">
                          <Headphones className="w-3 h-3 mr-1" />
                          Listen
                        </Button>
                        <span className="text-xs text-muted-foreground">8 min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* External Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ExternalLink className="w-5 h-5" />
                <span>External Resources</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-border/50 rounded-lg">
                  <h3 className="font-semibold mb-2">National Institute of Mental Health</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Comprehensive mental health information and research from NIMH.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.nimh.nih.gov" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Visit Site
                    </a>
                  </Button>
                </div>

                <div className="p-4 border border-border/50 rounded-lg">
                  <h3 className="font-semibold mb-2">Mental Health America</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Mental health screening tools and advocacy resources.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.mhanational.org" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Visit Site
                    </a>
                  </Button>
                </div>

                <div className="p-4 border border-border/50 rounded-lg">
                  <h3 className="font-semibold mb-2">NAMI (National Alliance on Mental Illness)</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Support groups, education, and advocacy for mental health.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.nami.org" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Visit Site
                    </a>
                  </Button>
                </div>

                <div className="p-4 border border-border/50 rounded-lg">
                  <h3 className="font-semibold mb-2">Psychology Today</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Find therapists, read articles, and mental health resources.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.psychologytoday.com" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Visit Site
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Downloadable Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Downloadable Resources</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-border/50 rounded-lg text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Mood Tracking Journal</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Printable daily mood tracking sheets
                  </p>
                  <Button size="sm" variant="outline">
                    <Download className="w-3 h-3 mr-1" />
                    Download PDF
                  </Button>
                </div>

                <div className="p-4 border border-border/50 rounded-lg text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Download className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Coping Strategies Toolkit</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Quick reference guide for stress management
                  </p>
                  <Button size="sm" variant="outline">
                    <Download className="w-3 h-3 mr-1" />
                    Download PDF
                  </Button>
                </div>

                <div className="p-4 border border-border/50 rounded-lg text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Download className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Self-Care Checklist</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Daily and weekly self-care activities
                  </p>
                  <Button size="sm" variant="outline">
                    <Download className="w-3 h-3 mr-1" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
