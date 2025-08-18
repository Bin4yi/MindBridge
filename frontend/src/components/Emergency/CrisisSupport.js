// frontend/src/components/Emergency/CrisisSupport.jsx
import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Heart, 
  Shield, 
  Users, 
  ExternalLink,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const CrisisSupport = ({ isVisible, onClose, urgencyLevel = 'high' }) => {
  const [selectedResource, setSelectedResource] = useState(null);
  const [hasCalledHelp, setHasCalledHelp] = useState(false);

  // Crisis resources organized by urgency and type
  const crisisResources = {
    immediate: [
      {
        id: 'suicide-lifeline',
        name: '988 Suicide & Crisis Lifeline',
        contact: '988',
        type: 'phone',
        availability: '24/7',
        description: 'Free, confidential support for people in distress and prevention/crisis resources.',
        website: 'https://988lifeline.org',
        features: ['Suicide prevention', 'Crisis support', 'Chat available', 'Multilingual']
      },
      {
        id: 'crisis-text-line',
        name: 'Crisis Text Line',
        contact: 'Text HOME to 741741',
        type: 'text',
        availability: '24/7',
        description: 'Free, 24/7 support via text message to anyone in crisis.',
        website: 'https://crisistextline.org',
        features: ['Text-based support', 'Anonymous', 'Trained counselors', 'Quick response']
      },
      {
        id: 'emergency-services',
        name: 'Emergency Services',
        contact: '911',
        type: 'phone',
        availability: '24/7',
        description: 'Immediate emergency response for life-threatening situations.',
        features: ['Immediate response', 'Medical emergency', 'Police assistance', 'Fire department']
      }
    ],
    support: [
      {
        id: 'nami-helpline',
        name: 'NAMI Helpline',
        contact: '1-800-950-NAMI (6264)',
        type: 'phone',
        availability: 'M-F 10am-10pm ET',
        description: 'Information, support groups, and referrals for mental health resources.',
        website: 'https://nami.org',
        features: ['Mental health info', 'Support groups', 'Family support', 'Local resources']
      },
      {
        id: 'samhsa-helpline',
        name: 'SAMHSA National Helpline',
        contact: '1-800-662-4357',
        type: 'phone',
        availability: '24/7',
        description: 'Treatment referral and information service for substance abuse.',
        website: 'https://samhsa.gov',
        features: ['Treatment referrals', 'Substance abuse help', 'Mental health services', 'Local resources']
      },
      {
        id: 'trevor-lifeline',
        name: 'The Trevor Lifeline',
        contact: '1-866-488-7386',
        type: 'phone',
        availability: '24/7',
        description: 'Crisis support specifically for LGBTQ+ young people.',
        website: 'https://thetrevorproject.org',
        features: ['LGBTQ+ support', 'Youth focused', 'Chat available', 'Text option']
      }
    ],
    specialized: [
      {
        id: 'domestic-violence',
        name: 'National Domestic Violence Hotline',
        contact: '1-800-799-7233',
        type: 'phone',
        availability: '24/7',
        description: 'Support for domestic violence survivors and their loved ones.',
        website: 'https://thehotline.org',
        features: ['Safety planning', 'Anonymous', 'Chat available', 'Local resources']
      },
      {
        id: 'veterans-crisis',
        name: 'Veterans Crisis Line',
        contact: '1-800-273-8255 (Press 1)',
        type: 'phone',
        availability: '24/7',
        description: 'Crisis support specifically for veterans and their families.',
        website: 'https://veteranscrisisline.net',
        features: ['Veteran focused', 'Family support', 'Chat available', 'Text option']
      }
    ]
  };

  const safetyPlan = [
    {
      step: 1,
      title: 'Recognize Warning Signs',
      description: 'Notice thoughts, feelings, or situations that might lead to crisis',
      icon: AlertTriangle
    },
    {
      step: 2,
      title: 'Use Coping Strategies',
      description: 'Practice healthy ways to manage difficult emotions',
      icon: Heart
    },
    {
      step: 3,
      title: 'Reach Out for Support',
      description: 'Contact trusted friends, family, or mental health professionals',
      icon: Users
    },
    {
      step: 4,
      title: 'Create Safe Environment',
      description: 'Remove or secure anything that could be used for self-harm',
      icon: Shield
    },
    {
      step: 5,
      title: 'Get Professional Help',
      description: 'Contact crisis services or go to the nearest emergency room',
      icon: Phone
    }
  ];

  useEffect(() => {
    if (isVisible && urgencyLevel === 'critical') {
      // Auto-focus on immediate help for critical situations
      setSelectedResource(crisisResources.immediate[0]);
    }
  }, [isVisible, urgencyLevel]);

  if (!isVisible) return null;

  const handleContactResource = (resource) => {
    if (resource.type === 'phone') {
      window.open(`tel:${resource.contact}`, '_self');
    } else if (resource.type === 'text') {
      // For text-based resources, show instructions
      setSelectedResource(resource);
    }
    setHasCalledHelp(true);
  };

  const ResourceCard = ({ resource, isPriority = false }) => (
    <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
      isPriority 
        ? 'border-red-300 bg-red-50' 
        : selectedResource?.id === resource.id
          ? 'border-blue-300 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {resource.type === 'phone' ? (
            <Phone className={`w-5 h-5 ${isPriority ? 'text-red-600' : 'text-blue-600'}`} />
          ) : (
            <MessageSquare className={`w-5 h-5 ${isPriority ? 'text-red-600' : 'text-blue-600'}`} />
          )}
          <h3 className={`font-semibold ${isPriority ? 'text-red-800' : 'text-gray-800'}`}>
            {resource.name}
          </h3>
        </div>
        {isPriority && (
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
            URGENT
          </span>
        )}
      </div>
      
      <div className="space-y-2 mb-4">
        <div className={`text-lg font-mono ${isPriority ? 'text-red-700' : 'text-blue-700'}`}>
          {resource.contact}
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-1" />
          {resource.availability}
        </div>
        
        <p className="text-sm text-gray-700">{resource.description}</p>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-4">
        {resource.features.map((feature, index) => (
          <span 
            key={index}
            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
          >
            {feature}
          </span>
        ))}
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => handleContactResource(resource)}
          className={`flex-1 py-2 px-4 rounded font-medium transition-colors ${
            isPriority
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {resource.type === 'phone' ? 'Call Now' : 'Get Instructions'}
        </button>
        
        {resource.website && (
          <button
            onClick={() => window.open(resource.website, '_blank')}
            className="px-3 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  const SafetyPlanStep = ({ step, isCompleted = false }) => {
    const Icon = step.icon;
    return (
      <div className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
        isCompleted ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
      }`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          isCompleted 
            ? 'bg-green-500 text-white' 
            : 'bg-blue-500 text-white'
        }`}>
          {isCompleted ? <CheckCircle className="w-4 h-4" /> : step.step}
        </div>
        <div className="flex-1">
          <h4 className={`font-medium ${isCompleted ? 'text-green-800' : 'text-gray-800'}`}>
            {step.title}
          </h4>
          <p className={`text-sm ${isCompleted ? 'text-green-700' : 'text-gray-600'}`}>
            {step.description}
          </p>
        </div>
        <Icon className={`w-5 h-5 ${isCompleted ? 'text-green-600' : 'text-blue-600'}`} />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`p-6 border-b ${
          urgencyLevel === 'critical' 
            ? 'bg-red-50 border-red-200' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className={`w-8 h-8 ${
                urgencyLevel === 'critical' ? 'text-red-600' : 'text-blue-600'
              }`} />
              <div>
                <h2 className={`text-2xl font-bold ${
                  urgencyLevel === 'critical' ? 'text-red-800' : 'text-blue-800'
                }`}>
                  {urgencyLevel === 'critical' ? 'Immediate Support Available' : 'Crisis Support Resources'}
                </h2>
                <p className={`${
                  urgencyLevel === 'critical' ? 'text-red-700' : 'text-blue-700'
                }`}>
                  You're not alone. Help is available 24/7.
                </p>
              </div>
            </div>
            
            {urgencyLevel !== 'critical' && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Immediate Help Section */}
          <section>
            <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Immediate Help - Available 24/7
            </h3>
            <div className="grid gap-4">
              {crisisResources.immediate.map((resource) => (
                <ResourceCard 
                  key={resource.id} 
                  resource={resource} 
                  isPriority={true}
                />
              ))}
            </div>
          </section>

          {/* Additional Support */}
          <section>
            <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Additional Support Resources
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {crisisResources.support.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </section>

          {/* Specialized Help */}
          <section>
            <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Specialized Support
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {crisisResources.specialized.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </section>

          {/* Safety Planning */}
          <section>
            <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Safety Planning Steps
            </h3>
            <div className="space-y-3">
              {safetyPlan.map((step, index) => (
                <SafetyPlanStep 
                  key={step.step} 
                  step={step}
                  isCompleted={hasCalledHelp && step.step <= 3}
                />
              ))}
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <a
              href="tel:988"
              className="flex-1 bg-red-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Call 988 Now
            </a>
            <a
              href="sms:741741&body=HOME"
              className="flex-1 bg-blue-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Text Crisis Line
            </a>
            {urgencyLevel !== 'critical' && (
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Continue Chat
              </button>
            )}
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Important:</p>
                <p>
                  If you're in immediate danger, please call 911 or go to your nearest emergency room. 
                  These resources are for support and crisis intervention, but emergency services should 
                  be contacted for life-threatening situations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrisisSupport;