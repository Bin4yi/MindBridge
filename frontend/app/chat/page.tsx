import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Mic, MicOff, MessageCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0">
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
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">AI Assistant Active</span>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col max-w-4xl">
        {/* Welcome Message */}
        <Card className="mb-6 border-border/50 bg-gradient-to-r from-primary/10 to-accent/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-primary" />
              <span>Welcome to your safe space</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              I&apos;m here to listen and support you through your mental wellness journey. 
              You can either type your thoughts or use voice to talk with me. Everything you share 
              is private and secure.
            </p>
          </CardContent>
        </Card>

        {/* Chat Messages Area */}
        <div className="flex-1 space-y-4 mb-6 overflow-y-auto">
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-muted/50 rounded-2xl px-4 py-3">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Heart className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium">MindBridge Assistant</span>
              </div>
              <p className="text-sm">
                Hello! How are you feeling today? I&apos;m here to listen and provide support 
                in whatever way I can. Feel free to share what&apos;s on your mind.
              </p>
            </div>
          </div>
          
          {/* Placeholder for user messages */}
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Start the conversation by typing below or using the voice button
            </p>
          </div>
        </div>

        {/* Voice Recording Area */}
        <Card className="mb-4 border-primary/20 bg-primary/5">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Mic className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Voice Conversation</h3>
                <p className="text-sm text-muted-foreground">
                  Tap and hold to record your voice message
                </p>
              </div>
              <Button size="lg" className="rounded-full">
                <Mic className="w-5 h-5 mr-2" />
                Start Recording
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Text Input Area */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex space-x-2">
              <textarea
                placeholder="Type your message here... Share what's on your mind."
                className="flex-1 min-h-[60px] resize-none border-0 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div className="flex flex-col space-y-2">
                <Button size="sm">
                  Send
                </Button>
                <Button variant="outline" size="sm">
                  <MicOff className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Your conversations are private and encrypted
              </p>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">
                  Clear
                </Button>
                <Button variant="ghost" size="sm">
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
