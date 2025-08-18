import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, MessageCircle, BarChart3, Settings, LogOut, BookOpen } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">MindBridge</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
               <Link href="/settings">Settings</Link>
            </Button>
            <Button variant="ghost" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to your wellness space</h1>
          <p className="text-muted-foreground">
            Your journey to better mental health starts here. How are you feeling today?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          <Link href="/chat">
            <Card className="border-border/50 bg-card/50 backdrop-blur hover:shadow-md transition-all cursor-pointer">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Start a Conversation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Talk to your AI companion about how you&apos;re feeling today
                </p>
                <Button className="w-full">
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/analytics">
            <Card className="border-border/50 bg-card/50 backdrop-blur hover:shadow-md transition-all cursor-pointer">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">View Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Track your mental wellness journey and progress over time
                </p>
                <Button variant="outline" className="w-full">
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/wellness-tools">
            <Card className="border-border/50 bg-card/50 backdrop-blur hover:shadow-md transition-all cursor-pointer">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Wellness Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Interactive exercises and tools to support your mental health
                </p>
                <Button variant="outline" className="w-full">
                  Explore Tools
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/resources">
            <Card className="border-border/50 bg-card/50 backdrop-blur hover:shadow-md transition-all cursor-pointer">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Mental health articles, guides, and educational content
                </p>
                <Button variant="outline" className="w-full">
                  Browse Resources
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                You haven&apos;t started any conversations yet. Click &quot;Start a Conversation&quot; to begin your wellness journey.
              </p>
              <Button className="mt-4">
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Your First Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
