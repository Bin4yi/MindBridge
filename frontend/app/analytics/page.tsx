import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, ArrowLeft, BarChart3, TrendingUp, Calendar, Target, Smile, Brain } from "lucide-react"
import Link from "next/link"

export default function AnalyticsPage() {
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
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Last 30 Days
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Wellness Insights</h1>
            <p className="text-muted-foreground">Track your mental health journey and celebrate your progress</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Check-ins</CardTitle>
                <Smile className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">
                  +3 from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mood Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7.2</div>
                <p className="text-xs text-muted-foreground">
                  +0.8 improvement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sessions</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Streak</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7 days</div>
                <p className="text-xs text-muted-foreground">
                  Personal best!
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Mood Tracking Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Mood Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Mood chart will appear here</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Track your daily mood to see patterns and progress
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-border/50 rounded-lg bg-primary/5">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm font-medium">Positive Pattern</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your mood has been consistently improving during evening conversations. 
                    Consider scheduling more chats during this time.
                  </p>
                </div>
                
                <div className="p-4 border border-border/50 rounded-lg bg-accent/5">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-sm font-medium">Recommendation</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You&apos;ve been discussing stress management frequently. Try the breathing exercises 
                    in your self-care toolkit.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wellness Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Daily Check-ins</span>
                    <span className="text-sm text-muted-foreground">23/30</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Weekly Sessions</span>
                    <span className="text-sm text-muted-foreground">3/3</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Mood Tracking</span>
                    <span className="text-sm text-muted-foreground">28/30</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '93%' }}></div>
                  </div>
                </div>

                <Button className="w-full mt-4">
                  <Target className="w-4 h-4 mr-2" />
                  Set New Goals
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Export Data */}
          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Download your wellness data to share with healthcare providers or for personal records.
              </p>
              <div className="flex space-x-2">
                <Button variant="outline">
                  Export PDF Report
                </Button>
                <Button variant="outline">
                  Export CSV Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
