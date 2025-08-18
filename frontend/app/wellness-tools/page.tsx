import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, ArrowLeft, Brain, Target, Calendar, Zap, Smile, Moon, Activity, Timer } from "lucide-react"
import Link from "next/link"

export default function WellnessToolsPage() {
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Wellness Tools</h1>
            <p className="text-muted-foreground">
              Interactive tools and exercises to support your mental health journey
            </p>
          </div>

          {/* Quick Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-1">Mood Check-in</h3>
                <p className="text-sm text-muted-foreground mb-3">Quick mood assessment</p>
                <Button size="sm" className="w-full">Start</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold mb-1">Breathing Exercise</h3>
                <p className="text-sm text-muted-foreground mb-3">Guided breathing patterns</p>
                <Button size="sm" className="w-full">Breathe</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Timer className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-1">Meditation Timer</h3>
                <p className="text-sm text-muted-foreground mb-3">Timed meditation sessions</p>
                <Button size="sm" className="w-full">Meditate</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Smile className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold mb-1">Gratitude Journal</h3>
                <p className="text-sm text-muted-foreground mb-3">Daily gratitude practice</p>
                <Button size="sm" className="w-full">Journal</Button>
              </CardContent>
            </Card>
          </div>

          {/* Featured Tools */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mood Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>Mood Tracking</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                        <Smile className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-sm">How are you feeling today?</span>
                    </div>
                    <Button size="sm">Rate Mood</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm">Energy level check</span>
                    </div>
                    <Button size="sm" variant="outline">Rate Energy</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                        <Moon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-sm">Sleep quality rating</span>
                    </div>
                    <Button size="sm" variant="outline">Rate Sleep</Button>
                  </div>
                </div>
                
                <Button className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Mood History
                </Button>
              </CardContent>
            </Card>

            {/* Goal Setting */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Wellness Goals</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border border-border/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Daily Meditation</span>
                      <span className="text-xs text-muted-foreground">5/7 days</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '71%' }}></div>
                    </div>
                  </div>
                  
                  <div className="p-3 border border-border/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Gratitude Practice</span>
                      <span className="text-xs text-muted-foreground">3/5 days</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  
                  <div className="p-3 border border-border/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Exercise</span>
                      <span className="text-xs text-muted-foreground">2/3 days</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full" variant="outline">
                  <Target className="w-4 h-4 mr-2" />
                  Set New Goal
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Breathing Exercises */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Breathing Exercises</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-border/50 rounded-lg text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2">4-7-8 Breathing</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Inhale for 4, hold for 7, exhale for 8 seconds
                  </p>
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">5 min</span>
                    <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-1 rounded">Beginner</span>
                  </div>
                  <Button size="sm" className="w-full">Start Exercise</Button>
                </div>

                <div className="p-4 border border-border/50 rounded-lg text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Box Breathing</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Equal counts for inhale, hold, exhale, hold
                  </p>
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">10 min</span>
                    <span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded">Intermediate</span>
                  </div>
                  <Button size="sm" className="w-full">Start Exercise</Button>
                </div>

                <div className="p-4 border border-border/50 rounded-lg text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Belly Breathing</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Deep diaphragmatic breathing technique
                  </p>
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">8 min</span>
                    <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-1 rounded">Beginner</span>
                  </div>
                  <Button size="sm" className="w-full">Start Exercise</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Quick Wellness Boosters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <Button variant="outline" size="sm" className="h-auto p-3 flex-col space-y-1">
                  <Smile className="w-4 h-4" />
                  <span className="text-xs">Smile Break</span>
                </Button>
                
                <Button variant="outline" size="sm" className="h-auto p-3 flex-col space-y-1">
                  <Activity className="w-4 h-4" />
                  <span className="text-xs">Deep Breath</span>
                </Button>
                
                <Button variant="outline" size="sm" className="h-auto p-3 flex-col space-y-1">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs">Self-Love</span>
                </Button>
                
                <Button variant="outline" size="sm" className="h-auto p-3 flex-col space-y-1">
                  <Brain className="w-4 h-4" />
                  <span className="text-xs">Mindfulness</span>
                </Button>
                
                <Button variant="outline" size="sm" className="h-auto p-3 flex-col space-y-1">
                  <Target className="w-4 h-4" />
                  <span className="text-xs">Intention</span>
                </Button>
                
                <Button variant="outline" size="sm" className="h-auto p-3 flex-col space-y-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">Plan Ahead</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Custom Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Create Custom Wellness Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Build a personalized wellness routine based on your goals, preferences, and schedule.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button>
                  <Target className="w-4 h-4 mr-2" />
                  Create Plan
                </Button>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Reminders
                </Button>
                <Button variant="outline">
                  <Activity className="w-4 h-4 mr-2" />
                  Track Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
