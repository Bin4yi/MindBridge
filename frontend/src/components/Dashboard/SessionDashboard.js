// frontend/src/components/Dashboard/SessionDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart 
} from 'recharts';
import { 
  Activity, 
  Brain, 
  Heart, 
  TrendingUp, 
  Clock, 
  MessageCircle, 
  Shield, 
  Target,
  AlertTriangle,
  CheckCircle,
  Users,
  Zap
} from 'lucide-react';

const SessionDashboard = ({ sessionAnalytics, sessionId, isLoading = false }) => {
  const [selectedMetric, setSelectedMetric] = useState('emotions');
  const [timeRange, setTimeRange] = useState('session'); // session, week, month

  // Default analytics structure
  const defaultAnalytics = {
    session_id: sessionId,
    duration_minutes: 0,
    total_interactions: 0,
    engagement_level: 'Low',
    engagement_score: 0,
    average_confidence: 0,
    emotional_journey: [],
    emotional_progression: { trend: 'stable' },
    therapeutic_themes: [],
    crisis_events: [],
    agent_usage: {},
    progress_indicators: [],
    recommendations: []
  };

  const analytics = sessionAnalytics || defaultAnalytics;

  // Color schemes for different data types
  const emotionColors = {
    happy: '#10B981',
    content: '#34D399',
    neutral: '#6B7280',
    sad: '#3B82F6',
    anxious: '#F59E0B',
    angry: '#EF4444',
    depressed: '#8B5CF6',
    hopeful: '#06B6D4'
  };

  const agentColors = {
    therapist: '#8B5CF6',
    crisis_detector: '#EF4444',
    mood_tracker: '#F59E0B',
    session_manager: '#10B981',
    empathy_specialist: '#EC4899',
    recommendation_engine: '#06B6D4'
  };

  // Prepare data for emotion journey chart
  const emotionJourneyData = analytics.emotional_journey?.map((entry, index) => ({
    time: `${index + 1}`,
    emotion: entry.emotion,
    confidence: entry.confidence,
    emotionValue: getEmotionValue(entry.emotion),
    timestamp: entry.timestamp
  })) || [];

  function getEmotionValue(emotion) {
    const values = {
      depressed: 1, sad: 2, anxious: 3, neutral: 4, 
      content: 5, happy: 6, hopeful: 7
    };
    return values[emotion] || 4;
  }

  // Prepare data for agent usage pie chart
  const agentUsageData = Object.entries(analytics.agent_usage || {}).map(([agent, count]) => ({
    name: agent.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: count,
    color: agentColors[agent] || '#6B7280'
  }));

  // Metrics cards data
  const metricsCards = [
    {
      title: 'Session Duration',
      value: `${analytics.duration_minutes?.toFixed(1) || 0} min`,
      icon: Clock,
      color: 'blue',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Interactions',
      value: analytics.total_interactions || 0,
      icon: MessageCircle,
      color: 'green',
      change: `${analytics.total_interactions > 10 ? 'High' : 'Growing'}`,
      changeType: analytics.total_interactions > 10 ? 'positive' : 'neutral'
    },
    {
      title: 'Engagement Level',
      value: analytics.engagement_level || 'Low',
      icon: Activity,
      color: analytics.engagement_level === 'High' ? 'green' : 
             analytics.engagement_level === 'Medium' ? 'yellow' : 'red',
      change: `${analytics.engagement_score || 0}%`,
      changeType: (analytics.engagement_score || 0) > 60 ? 'positive' : 'neutral'
    },
    {
      title: 'Crisis Events',
      value: analytics.crisis_events?.length || 0,
      icon: Shield,
      color: (analytics.crisis_events?.length || 0) > 0 ? 'red' : 'green',
      change: (analytics.crisis_events?.length || 0) === 0 ? 'Safe' : 'Monitored',
      changeType: (analytics.crisis_events?.length || 0) === 0 ? 'positive' : 'warning'
    }
  ];

  const MetricCard = ({ title, value, icon: Icon, color, change, changeType }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${
          color === 'blue' ? 'bg-blue-100 text-blue-600' :
          color === 'green' ? 'bg-green-100 text-green-600' :
          color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
          color === 'red' ? 'bg-red-100 text-red-600' :
          'bg-gray-100 text-gray-600'
        }`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium ${
          changeType === 'positive' ? 'text-green-600' :
          changeType === 'warning' ? 'text-yellow-600' :
          changeType === 'negative' ? 'text-red-600' :
          'text-gray-600'
        }`}>
          {change}
        </span>
      </div>
    </div>
  );

  const ProgressIndicator = ({ indicator, index }) => (
    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
      <span className="text-sm text-green-800">{indicator}</span>
    </div>
  );

  const ThemeTag = ({ theme }) => (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
      {theme.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
    </span>
  );

  const RecommendationItem = ({ recommendation, index }) => (
    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <Target className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
      <span className="text-sm text-blue-800">{recommendation}</span>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Brain className="w-8 h-8 mr-3 text-indigo-600" />
                Session Analytics
              </h1>
              <p className="text-gray-600 mt-1">
                Comprehensive insights into your therapeutic session
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="emotions">Emotional Journey</option>
                <option value="agents">Agent Interactions</option>
                <option value="engagement">Engagement Metrics</option>
              </select>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricsCards.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Emotional Journey Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Emotional Journey
              </h3>
              <div className="flex items-center space-x-2">
                <span className={`text-sm px-2 py-1 rounded-full ${
                  analytics.emotional_progression?.trend === 'improving' ? 'bg-green-100 text-green-800' :
                  analytics.emotional_progression?.trend === 'declining' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {analytics.emotional_progression?.trend || 'stable'}
                </span>
              </div>
            </div>
            
            {emotionJourneyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={emotionJourneyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[1, 7]}
                    tickFormatter={(value) => {
                      const emotions = ['', 'Depressed', 'Sad', 'Anxious', 'Neutral', 'Content', 'Happy', 'Hopeful'];
                      return emotions[value] || '';
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      `Confidence: ${emotionJourneyData.find(d => d.emotionValue === value)?.confidence || 0}%`,
                      'Emotion Level'
                    ]}
                    labelFormatter={(label) => `Interaction ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="emotionValue" 
                    stroke="#8B5CF6" 
                    fill="#8B5CF6" 
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-gray-500">
                No emotional data available yet
              </div>
            )}
          </div>

          {/* Agent Usage Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              AI Agent Interactions
            </h3>
            
            {agentUsageData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={agentUsageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {agentUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-gray-500">
                No agent interaction data available
              </div>
            )}
            
            {/* Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {agentUsageData.map((agent, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: agent.color }}
                  ></div>
                  <span className="text-xs text-gray-600">{agent.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Indicators */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Progress Indicators
            </h3>
            
            {analytics.progress_indicators?.length > 0 ? (
              <div className="space-y-3">
                {analytics.progress_indicators.map((indicator, index) => (
                  <ProgressIndicator key={index} indicator={indicator} index={index} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Continue the conversation to see progress indicators</p>
            )}
          </div>

          {/* Therapeutic Themes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-500" />
              Therapeutic Themes
            </h3>
            
            {analytics.therapeutic_themes?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {analytics.therapeutic_themes.map((theme, index) => (
                  <ThemeTag key={index} theme={theme} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Themes will be identified as the conversation develops</p>
            )}
          </div>

          {/* Crisis Monitoring */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-red-500" />
              Safety Monitoring
            </h3>
            
            {analytics.crisis_events?.length > 0 ? (
              <div className="space-y-3">
                {analytics.crisis_events.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-800 font-medium">Crisis Event Detected</p>
                      <p className="text-xs text-red-600">Level: {event.crisis_level}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800">No crisis events detected</span>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations Section */}
        {analytics.recommendations?.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              AI Recommendations
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analytics.recommendations.map((recommendation, index) => (
                <RecommendationItem key={index} recommendation={recommendation} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Session Summary */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 p-6">
          <h3 className="text-lg font-semibold text-indigo-900 mb-3">Session Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-indigo-800">Duration:</span>
              <span className="ml-2 text-indigo-700">{analytics.duration_minutes?.toFixed(1) || 0} minutes</span>
            </div>
            <div>
              <span className="font-medium text-indigo-800">Engagement:</span>
              <span className="ml-2 text-indigo-700">{analytics.engagement_level} ({analytics.engagement_score}%)</span>
            </div>
            <div>
              <span className="font-medium text-indigo-800">Confidence:</span>
              <span className="ml-2 text-indigo-700">{analytics.average_confidence?.toFixed(1) || 0}% average</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDashboard;