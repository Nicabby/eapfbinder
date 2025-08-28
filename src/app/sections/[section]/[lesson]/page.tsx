'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import PagePaper from '@/components/PagePaper';
import { useBinderStore, useNote } from '@/lib/store';
import ProtectedPDFLink from '@/components/ProtectedPDFLink';
import StepBackSection from '@/components/StepBackSection';
import { stepBackQuestions } from '@/lib/stepBackQuestions';

interface Resource {
  label: string;
  href: string;
  type: string;
  category?: string;
}

interface Lesson {
  id: string;
  title: string;
  order: number;
  summary: string;
  whyItMatters?: string;
  strategies: string[];
  resources: Resource[];
}

interface Section {
  id: string;
  title: string;
  color: string;
  description: string;
  lessons: Lesson[];
}

// Interactive Question Rewriting Activity Component
function QuestionRewritingActivity() {
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [expandedAnswers, setExpandedAnswers] = useState<{ [key: number]: boolean }>({});
  const [showCompletion, setShowCompletion] = useState(false);

  const questions = [
    {
      id: 1,
      closedQuestion: "Did you like today's activity?",
      modelAnswer: "What part of today's activity stood out to you, and why?"
    },
    {
      id: 2,
      closedQuestion: "Are you ready for the next challenge?",
      modelAnswer: "How do you feel about starting the next challenge?"
    },
    {
      id: 3,
      closedQuestion: "Was it hard to work with your team?",
      modelAnswer: "What was it like to work with your team today?"
    },
    {
      id: 4,
      closedQuestion: "Do you understand the instructions?",
      modelAnswer: "What questions do you have about the instructions before we start?"
    },
    {
      id: 5,
      closedQuestion: "Did you have fun?",
      modelAnswer: "What part of today's session did you enjoy the most?"
    }
  ];

  const handleResponseChange = (questionId: number, value: string) => {
    setResponses({ ...responses, [questionId]: value });
    // Hide completion message when user starts editing
    if (showCompletion) {
      setShowCompletion(false);
    }
  };

  const toggleAnswer = (questionId: number) => {
    setExpandedAnswers({ 
      ...expandedAnswers, 
      [questionId]: !expandedAnswers[questionId] 
    });
  };

  const clearResponses = () => {
    setResponses({});
    setShowCompletion(false);
  };

  const checkCompletion = () => {
    const allComplete = questions.every(q => 
      responses[q.id] && responses[q.id].trim().length > 0
    );
    
    if (allComplete) {
      setShowCompletion(true);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Interactive Practice Activity</h3>
      
      <p className="text-slate-600 mb-6 leading-relaxed">
        Practice rewriting closed-ended questions into open-ended ones that invite deeper reflection and dialogue.
      </p>

      {showCompletion && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2">Nice work!</h4>
          <p className="text-green-800">
            You drafted five open-ended questions. Keep inviting depth with what, how, and why.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {questions.map((question) => (
          <div key={question.id} className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium">
                {question.id}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-600 italic mb-3">
                  {question.closedQuestion}
                </p>
                
                <div className="space-y-3">
                  <div>
                    <label 
                      htmlFor={`response-${question.id}`}
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Your Rewrite:
                    </label>
                    <textarea
                      id={`response-${question.id}`}
                      value={responses[question.id] || ''}
                      onChange={(e) => handleResponseChange(question.id, e.target.value)}
                      className="w-full min-h-[80px] p-3 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Type your open-ended question here..."
                      aria-describedby={expandedAnswers[question.id] ? `model-answer-${question.id}` : undefined}
                    />
                  </div>

                  <div>
                    <button
                      onClick={() => toggleAnswer(question.id)}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md transition-colors"
                      aria-expanded={expandedAnswers[question.id]}
                      aria-controls={`model-answer-${question.id}`}
                    >
                      <span>{expandedAnswers[question.id] ? 'Hide' : 'Show'} Model Answer</span>
                      <svg 
                        className={`w-4 h-4 transition-transform ${expandedAnswers[question.id] ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {expandedAnswers[question.id] && (
                      <div 
                        id={`model-answer-${question.id}`}
                        className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                        role="region"
                        aria-label={`Model answer for question ${question.id}`}
                      >
                        <p className="text-sm font-medium text-blue-900 mb-1">Model Answer:</p>
                        <p className="text-blue-800 leading-relaxed">&quot;{question.modelAnswer}&quot;</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3 justify-end">
        <button
          onClick={clearResponses}
          className="px-4 py-2 text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md transition-colors"
        >
          Clear My Responses
        </button>
        <button
          onClick={checkCompletion}
          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Check Completion
        </button>
      </div>
    </div>
  );
}

// Interactive Listening Matching Activity Component
function ListeningMatchingActivity() {
  const [matches, setMatches] = useState<{ [key: number]: string }>({});
  const [feedback, setFeedback] = useState<{ [key: number]: boolean | null }>({});
  const [showSummary, setShowSummary] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  const scenarios = [
    {
      id: 1,
      text: 'A participant shares, "Sometimes I feel like no one really listens to me at school."',
      response: 'Facilitator Response: "That sounds really hard. Can you tell me more about what that feels like?"',
      correctAnswer: 'F'
    },
    {
      id: 2,
      text: 'After a long pause, a youth looks uncertain. The facilitator waits calmly, making eye contact, instead of filling the silence. Eventually, the youth continues speaking.',
      response: '',
      correctAnswer: 'A'
    },
    {
      id: 3,
      text: 'A participant describes a conflict with a friend. The facilitator leans forward slightly, keeps arms uncrossed, and nods as the youth speaks.',
      response: '',
      correctAnswer: 'B'
    },
    {
      id: 4,
      text: 'A participant explains: "I was so nervous leading the activity."',
      response: 'Facilitator Response: "So you felt nervous stepping into that role?"',
      correctAnswer: 'C'
    },
    {
      id: 5,
      text: 'A youth shares a story quickly, and the facilitator replies: "Let me check I\'ve got this right—you felt left out when your group didn\'t include you in the decision, is that correct?"',
      response: '',
      correctAnswer: 'D'
    },
    {
      id: 6,
      text: 'During a circle, a youth pauses. The facilitator says softly: "Uh-huh… and what happened next?"',
      response: '',
      correctAnswer: 'E'
    }
  ];

  const strategies = [
    { id: 'A', text: 'Hold Space with Silence' },
    { id: 'B', text: 'Listen with Your Body' },
    { id: 'C', text: 'Use Gentle Echoes & Invitations' },
    { id: 'D', text: 'Summarize & Paraphrase' },
    { id: 'E', text: 'Give Brief Prompts' },
    { id: 'F', text: 'Acknowledge Emotions' }
  ];

  const handleStrategyClick = (strategyId: string, scenarioId: number) => {
    const newMatches = { ...matches, [scenarioId]: strategyId };
    setMatches(newMatches);
    
    const correct = scenarios.find(s => s.id === scenarioId)?.correctAnswer === strategyId;
    setFeedback({ ...feedback, [scenarioId]: correct });
    
    // Check if all scenarios are completed correctly
    const allCorrect = scenarios.every(scenario => 
      newMatches[scenario.id] === scenario.correctAnswer
    );
    
    if (allCorrect && Object.keys(newMatches).length === scenarios.length) {
      setTimeout(() => setShowSummary(true), 1000);
    }
  };

  const resetActivity = () => {
    setMatches({});
    setFeedback({});
    setShowSummary(false);
    setSelectedStrategy(null);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Interactive Practice Activity</h3>
        <button
          onClick={resetActivity}
          className="px-3 py-1 text-sm bg-slate-200 hover:bg-slate-300 rounded-md transition-colors"
        >
          Reset
        </button>
      </div>

      <p className="text-slate-600 mb-6 leading-relaxed">
        Select a listening strategy from the left column, then click on the corresponding scenario number in the right column to match them. Each scenario demonstrates one of the six listening strategies in action.
      </p>

      {showSummary && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2">🎉 Excellent Work!</h4>
          <p className="text-green-800 mb-3">You&apos;ve successfully matched all scenarios to their listening strategies:</p>
          <div className="space-y-1 text-sm">
            {scenarios.map(scenario => (
              <div key={scenario.id} className="flex items-center gap-2">
                <span className="font-medium">Scenario {scenario.id}:</span>
                <span>{strategies.find(s => s.id === scenario.correctAnswer)?.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selection Interface */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Strategies on Left */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-800 mb-4">Listening Strategies</h4>
          
          <div className="space-y-2">
            {strategies.map((strategy) => (
              <button
                key={strategy.id}
                onClick={() => setSelectedStrategy(selectedStrategy === strategy.id ? null : strategy.id)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                  selectedStrategy === strategy.id
                    ? 'border-blue-400 bg-blue-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold">
                    {strategy.id}
                  </div>
                  <span className="font-medium text-slate-900">{strategy.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Scenario Selection on Right */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-800 mb-4">Scenarios</h4>
          
          <div className="space-y-2">
            {scenarios.map(scenario => (
              <button
                key={scenario.id}
                onClick={() => selectedStrategy && handleStrategyClick(selectedStrategy, scenario.id)}
                disabled={!selectedStrategy || Boolean(matches[scenario.id] && feedback[scenario.id])}
                className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                  matches[scenario.id] && feedback[scenario.id]
                    ? 'border-green-300 bg-green-50 cursor-not-allowed'
                    : matches[scenario.id] && !feedback[scenario.id]
                    ? 'border-red-300 bg-red-50 hover:border-red-400'
                    : selectedStrategy
                    ? 'border-blue-200 bg-blue-50 hover:border-blue-400 hover:bg-blue-100'
                    : 'border-slate-200 bg-slate-100 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold">
                    {scenario.id}
                  </div>
                  <span className="font-medium text-slate-900">Scenario {scenario.id}</span>
                </div>
                
                {matches[scenario.id] && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      feedback[scenario.id] 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {strategies.find(s => s.id === matches[scenario.id])?.text}
                    </span>
                    {feedback[scenario.id] ? (
                      <span className="text-green-600 text-xs">✓ Correct!</span>
                    ) : (
                      <span className="text-red-600 text-xs">Try again</span>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scenario Descriptions - Full Width */}
      <div className="space-y-4">
        <h4 className="font-semibold text-slate-800 mb-4">Scenario Descriptions</h4>
        
        <div className="space-y-4">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                matches[scenario.id]
                  ? feedback[scenario.id]
                    ? 'border-green-300 bg-green-50'
                    : 'border-red-300 bg-red-50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold">
                  {scenario.id}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 leading-relaxed mb-2">{scenario.text}</p>
                  {scenario.response && (
                    <p className="text-slate-600 italic leading-relaxed">{scenario.response}</p>
                  )}
                </div>
                
                {matches[scenario.id] && (
                  <div className="flex items-center gap-2 ml-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      feedback[scenario.id] 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {strategies.find(s => s.id === matches[scenario.id])?.text}
                    </span>
                    {feedback[scenario.id] ? (
                      <span className="text-green-600 font-medium">✓</span>
                    ) : (
                      <span className="text-red-600 font-medium">✗</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Activity Summary */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 leading-relaxed">
            This activity helps you connect real facilitation scenarios with the listening strategies you&apos;ve just learned. By practicing how to match facilitator responses to the right approach, you&apos;ll see how small choices—like waiting in silence, reflecting back feelings, or using open body language—make a big difference in building trust and safety.
          </p>
        </div>
      </div>
    </div>
  );
}

// Interactive Group Dynamics Practice Activity Component
function GroupDynamicsPracticeActivity() {
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [expandedAnswers, setExpandedAnswers] = useState<{ [key: number]: boolean }>({});
  const [showCompletion, setShowCompletion] = useState(false);

  const scenarios = [
    {
      id: 1,
      title: "The Dominator",
      situation: "One participant answers every question first, leaving little room for others.",
      facilitatorMove: "\"Thanks for sharing, let's hear from someone who hasn't spoken yet.\"",
      tip: "Balance participation by inviting quieter voices and gently limiting dominant ones."
    },
    {
      id: 2,
      title: "The Observer", 
      situation: "A participant stays silent throughout a group reflection.",
      facilitatorMove: "\"I'd love to hear your perspective—what stood out to you in today's activity?\"",
      tip: "Use open-ended, low-pressure questions or small groups to build comfort."
    },
    {
      id: 3,
      title: "The Side Talkers",
      situation: "Two participants whisper while someone else is speaking.",
      facilitatorMove: "\"Let's pause—sounds like there are some ideas being shared over here. Would you like to bring them into the group?\"",
      tip: "Acknowledge side conversations respectfully, then redirect focus into the main dialogue."
    },
    {
      id: 4,
      title: "The Distractor",
      situation: "A participant cracks jokes during a serious activity, causing laughter and lost focus.",
      facilitatorMove: "\"I love your energy. Let's save the humor for later—right now we need everyone's attention.\"",
      tip: "Validate their contribution, but redirect energy back to the task."
    },
    {
      id: 5,
      title: "The Tense Energy",
      situation: "The group is unusually quiet, with visible tension between two participants.",
      facilitatorMove: "\"I'm sensing the energy feels a little heavy right now. Let's take a quick reset—maybe a short break or a check-in round.\"",
      tip: "Name the tension gently, offer space for emotions, and re-establish group safety."
    }
  ];

  const handleResponseChange = (scenarioId: number, value: string) => {
    setResponses(prev => ({
      ...prev,
      [scenarioId]: value
    }));
  };

  const toggleAnswer = (scenarioId: number) => {
    setExpandedAnswers(prev => ({
      ...prev,
      [scenarioId]: !prev[scenarioId]
    }));
  };

  const clearAllResponses = () => {
    setResponses({});
    setShowCompletion(false);
  };

  const checkCompletion = () => {
    const completedCount = Object.values(responses).filter(response => response.trim().length > 0).length;
    if (completedCount === scenarios.length) {
      setShowCompletion(true);
    }
  };

  const completedCount = Object.values(responses).filter(response => response.trim().length > 0).length;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-blue-900">Interactive Practice Activity</h3>
        <p className="text-blue-800 leading-relaxed">
          Practice your responses to common group dynamics challenges. Type your approach for each scenario, then reveal the model facilitator moves to compare your thinking.
        </p>
      </div>

      <div className="space-y-6">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <div className="mb-4">
              <div className="flex items-start gap-3 mb-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {scenario.id}
                </span>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 mb-2">Scenario {scenario.id} – {scenario.title}</h4>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    <span className="font-medium">Situation:</span> {scenario.situation}
                  </p>
                </div>
              </div>
              
              <div className="ml-11">
                <label htmlFor={`response-${scenario.id}`} className="block text-sm font-medium text-slate-700 mb-2">
                  Your Response:
                </label>
                <textarea
                  id={`response-${scenario.id}`}
                  value={responses[scenario.id] || ''}
                  onChange={(e) => handleResponseChange(scenario.id, e.target.value)}
                  placeholder="How would you respond to this situation?"
                  className="w-full min-h-[80px] p-3 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-describedby={`response-${scenario.id}-help`}
                />
                <p id={`response-${scenario.id}-help`} className="text-xs text-slate-500 mt-1">
                  Share your facilitator approach for this situation
                </p>
              </div>
            </div>

            <div className="ml-11">
              <button
                onClick={() => toggleAnswer(scenario.id)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                aria-expanded={expandedAnswers[scenario.id]}
                aria-controls={`model-answer-${scenario.id}`}
              >
                <span>{expandedAnswers[scenario.id] ? '▼' : '▶'}</span>
                Show Model Facilitator Move
              </button>
              
              {expandedAnswers[scenario.id] && (
                <div
                  id={`model-answer-${scenario.id}`}
                  className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-lg"
                  role="region"
                  aria-label="Model facilitator response"
                >
                  <div className="space-y-2">
                    <p className="text-slate-900">
                      <span className="font-medium">Model Facilitator Move:</span>{' '}
                      <strong>{scenario.facilitatorMove}</strong>
                    </p>
                    <p className="text-slate-700">
                      <span className="font-medium">Facilitator Tip:</span>{' '}
                      <em>{scenario.tip}</em>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showCompletion && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-green-900 mb-2">Well done!</h4>
          <p className="text-green-800 leading-relaxed">
            You&apos;ve practiced responding to five common group dynamics. Remember, noticing patterns early helps you guide the group with confidence.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
        <button
          onClick={clearAllResponses}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200 focus:ring-2 focus:ring-slate-500 focus:ring-offset-1 transition-colors"
        >
          Clear My Responses
        </button>
        
        <button
          onClick={checkCompletion}
          className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-200 rounded-md hover:bg-blue-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
        >
          Check Completion ({completedCount}/5)
        </button>
      </div>
    </div>
  );
}

// Interactive Bias Interruption Activity Component
function BiasInterruptionActivity() {
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [expandedAnswers, setExpandedAnswers] = useState<{ [key: number]: boolean }>({});
  const [showCompletion, setShowCompletion] = useState(false);

  const scenarios = [
    {
      id: 1,
      title: "Dominant Voices",
      situation: "One participant speaks over others and dominates the discussion.",
      modelResponse: "**Pause before responding. Then say:** \"Thanks for sharing. Let's make sure we hear from someone who hasn't had a chance yet.\""
    },
    {
      id: 2,
      title: "Overlooked Participant", 
      situation: "A quieter youth raises their hand but isn't acknowledged while others jump in.",
      modelResponse: "**Choose equity over ease. Say:** \"Let's pause—[Name] has been waiting to share. We'd love to hear your perspective.\""
    },
    {
      id: 3,
      title: "Facilitator Gut Reaction",
      situation: "You assume a participant is being \"lazy\" because they're slouching and disengaged.",
      modelResponse: "**Ask reflective questions internally. Think:** \"What might be underneath this behavior?\" Then reframe with curiosity instead of judgment."
    },
    {
      id: 4,
      title: "Facilitator Misstep",
      situation: "You accidentally cut off a participant and move on too quickly.",
      modelResponse: "**Repair when needed. Say:** \"I realize I interrupted you—thank you for your patience. Please finish your thought.\""
    }
  ];

  const handleResponseChange = (scenarioId: number, value: string) => {
    setResponses(prev => ({
      ...prev,
      [scenarioId]: value
    }));
  };

  const toggleAnswer = (scenarioId: number) => {
    setExpandedAnswers(prev => ({
      ...prev,
      [scenarioId]: !prev[scenarioId]
    }));
  };

  const clearAllResponses = () => {
    setResponses({});
    setShowCompletion(false);
  };

  const checkCompletion = () => {
    const completedCount = Object.values(responses).filter(response => response.trim().length > 0).length;
    if (completedCount === scenarios.length) {
      setShowCompletion(true);
    }
  };

  const completedCount = Object.values(responses).filter(response => response.trim().length > 0).length;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-blue-900">Interactive Practice Activity</h3>
        <p className="text-blue-800 leading-relaxed">
          Practice strategies for interrupting bias with intention. Read each scenario, type your response, then compare with the model facilitator approach.
        </p>
      </div>

      <div className="space-y-6">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <div className="mb-4">
              <h4 className="font-semibold text-slate-900 mb-2">Scenario {scenario.id} – {scenario.title}</h4>
              <p className="text-slate-700 leading-relaxed mb-4">
                <span className="font-medium">Situation:</span> {scenario.situation}
              </p>
              
              <div className="mb-4">
                <label htmlFor={`response-${scenario.id}`} className="block text-sm font-medium text-slate-700 mb-2">
                  Your Response:
                </label>
                <textarea
                  id={`response-${scenario.id}`}
                  value={responses[scenario.id] || ''}
                  onChange={(e) => handleResponseChange(scenario.id, e.target.value)}
                  placeholder="How would you interrupt bias in this situation?"
                  className="w-full min-h-[80px] p-3 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-describedby={`response-${scenario.id}-help`}
                />
                <p id={`response-${scenario.id}-help`} className="text-xs text-slate-500 mt-1">
                  Consider how you might interrupt bias and promote equity
                </p>
              </div>

              <button
                onClick={() => toggleAnswer(scenario.id)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                aria-expanded={expandedAnswers[scenario.id]}
                aria-controls={`model-answer-${scenario.id}`}
              >
                <span>{expandedAnswers[scenario.id] ? '▼' : '▶'}</span>
                Model Response
              </button>
              
              {expandedAnswers[scenario.id] && (
                <div
                  id={`model-answer-${scenario.id}`}
                  className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-lg"
                  role="region"
                  aria-label="Model facilitator response"
                >
                  <div 
                    className="text-slate-900 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: scenario.modelResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showCompletion && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-green-900 mb-2">Great work!</h4>
          <p className="text-green-800 leading-relaxed">
            You practiced strategies for interrupting bias with intention. Keep noticing and choosing equity in the moment.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
        <button
          onClick={clearAllResponses}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200 focus:ring-2 focus:ring-slate-500 focus:ring-offset-1 transition-colors"
        >
          Clear My Responses
        </button>
        
        <button
          onClick={checkCompletion}
          className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-200 rounded-md hover:bg-blue-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
        >
          Check Completion ({completedCount}/4)
        </button>
      </div>
    </div>
  );
}

// Interactive Inclusion Scanning Activity Component
function InclusionScanningActivity() {
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [expandedAnswers, setExpandedAnswers] = useState<{ [key: number]: boolean }>({});
  const [showCompletion, setShowCompletion] = useState(false);

  const scenarios = [
    {
      id: 1,
      title: "Verbal Voices Only",
      situation: "During a group brainstorm, the same 3 participants keep talking while others stay silent.",
      modelResponse: "**Plan for multiple modes. Say:** \"Let's pause and take 2 minutes to jot down ideas on paper or draw them. Then we'll share in small groups before coming back together.\""
    },
    {
      id: 2,
      title: "Agreements Forgotten",
      situation: "A few participants dominate discussion despite having set the group agreement to \"step up, step back.\"",
      modelResponse: "**Embed belonging into norms. Say:** \"I want to revisit our agreement of 'step up, step back.' Let's make space for others before continuing.\""
    },
    {
      id: 3,
      title: "Signs of Exclusion",
      situation: "One participant hasn't spoken all session and looks uncomfortable.",
      modelResponse: "**Normalize feedback and adjustment. Ask:** \"I want to check in—does this activity feel inclusive for everyone? What would help you feel more comfortable sharing?\""
    }
  ];

  const handleResponseChange = (scenarioId: number, value: string) => {
    setResponses(prev => ({
      ...prev,
      [scenarioId]: value
    }));
    // Hide completion message when user starts editing
    if (showCompletion) {
      setShowCompletion(false);
    }
  };

  const toggleAnswer = (scenarioId: number) => {
    setExpandedAnswers(prev => ({
      ...prev,
      [scenarioId]: !prev[scenarioId]
    }));
  };

  const clearAllResponses = () => {
    setResponses({});
    setShowCompletion(false);
  };

  const checkCompletion = () => {
    const completedCount = Object.values(responses).filter(response => response.trim().length > 0).length;
    if (completedCount === scenarios.length) {
      setShowCompletion(true);
    }
  };

  const completedCount = Object.values(responses).filter(response => response.trim().length > 0).length;

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-indigo-900">Practice Review – From Scanning to Shaping</h3>
        <p className="text-indigo-800 leading-relaxed">
          Apply strengthen strategies to reshape sessions for inclusion. Read each scenario, type how you would respond, then compare with the model facilitator move.
        </p>
      </div>

      <div className="space-y-6">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <div className="mb-4">
              <h4 className="font-semibold text-slate-900 mb-2">Scenario {scenario.id} – {scenario.title}</h4>
              <p className="text-slate-700 leading-relaxed mb-4">
                <span className="font-medium">Situation:</span> {scenario.situation}
              </p>
              
              <div className="mb-4">
                <label htmlFor={`inclusion-response-${scenario.id}`} className="block text-sm font-medium text-slate-700 mb-2">
                  Your Response:
                </label>
                <textarea
                  id={`inclusion-response-${scenario.id}`}
                  value={responses[scenario.id] || ''}
                  onChange={(e) => handleResponseChange(scenario.id, e.target.value)}
                  placeholder="How would you reshape this session for inclusion?"
                  className="w-full min-h-[80px] p-3 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  aria-describedby={`inclusion-response-${scenario.id}-help`}
                />
                <p id={`inclusion-response-${scenario.id}-help`} className="text-xs text-slate-500 mt-1">
                  Consider how you would plan for multiple modes, embed belonging, or normalize feedback
                </p>
              </div>

              <button
                onClick={() => toggleAnswer(scenario.id)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-colors"
                aria-expanded={expandedAnswers[scenario.id]}
                aria-controls={`inclusion-model-answer-${scenario.id}`}
              >
                <span>{expandedAnswers[scenario.id] ? '▼' : '▶'}</span>
                Model Response
              </button>
              
              {expandedAnswers[scenario.id] && (
                <div
                  id={`inclusion-model-answer-${scenario.id}`}
                  className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-lg"
                  role="region"
                  aria-label="Model facilitator response"
                >
                  <div 
                    className="text-slate-900 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: scenario.modelResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showCompletion && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-green-900 mb-2">Well done!</h4>
          <p className="text-green-800 leading-relaxed">
            You practiced reshaping facilitation for inclusion. Designing with intention creates space for every voice.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
        <button
          onClick={clearAllResponses}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200 focus:ring-2 focus:ring-slate-500 focus:ring-offset-1 transition-colors"
        >
          Clear My Responses
        </button>
        <button
          onClick={checkCompletion}
          className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 border border-indigo-200 rounded-md hover:bg-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-colors"
        >
          Check Completion ({completedCount}/3)
        </button>
      </div>
    </div>
  );
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { getLessonProgress, markLessonComplete } = useBinderStore();
  const { note, updateNote } = useNote(params.section as string, params.lesson as string);
  
  const [section, setSection] = useState<Section | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState('');
  
  // State for interactive scenario checkpoints
  const [checkpointResponses, setCheckpointResponses] = useState({
    checkpoint1: '',
    checkpoint2: '',
    checkpoint3: '',
    checkpoint4: ''
  });
  const [expandedAnswers, setExpandedAnswers] = useState({
    answer1: false,
    answer2: false,
    answer3: false,
    answer4: false
  });

  useEffect(() => {
    const loadLessonData = async () => {
      try {
        const response = await fetch('/data/course.json');
        const data = await response.json();
        const foundSection = data.sections.find((s: Section) => s.id === params.section);
        
        if (foundSection) {
          foundSection.lessons.sort((a: Lesson, b: Lesson) => a.order - b.order);
          setSection(foundSection);
          
          const foundLesson = foundSection.lessons.find((l: Lesson) => l.id === params.lesson);
          if (foundLesson) {
            setLesson(foundLesson);
          }
        }
      } catch (error) {
        console.error('Failed to load lesson data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLessonData();
  }, [params.section, params.lesson]);

  useEffect(() => {
    if (note) {
      setNoteContent(note.content);
    }
  }, [note]);

  const isCompleted = section && lesson ? getLessonProgress(section.id, lesson.id) : false;

  const handleCompletionToggle = () => {
    if (section && lesson) {
      markLessonComplete(section.id, lesson.id, !isCompleted);
    }
  };

  // Find next lesson
  const getNextLesson = () => {
    if (!section || !lesson) return null;
    
    const currentIndex = section.lessons.findIndex(l => l.id === lesson.id);
    if (currentIndex === -1 || currentIndex === section.lessons.length - 1) return null;
    
    return section.lessons[currentIndex + 1];
  };

  const nextLesson = getNextLesson();

  const handleNoteChange = (content: string) => {
    setNoteContent(content);
    updateNote(content);
  };

  const handleCheckpointResponse = (checkpoint: string, response: string) => {
    setCheckpointResponses(prev => ({
      ...prev,
      [checkpoint]: response
    }));
  };

  const toggleAnswer = (answerKey: string) => {
    setExpandedAnswers(prev => ({
      ...prev,
      [answerKey]: !prev[answerKey as keyof typeof prev]
    }));
  };

  const getResourceIcon = (category?: string) => {
    switch (category) {
      case 'Module Introductions':
        return '📘';
      case 'Quick Reminders':
        return '📝';
      case 'Scenarios in Action':
        return '🎭';
      case 'Facilitator Tips':
        return '💡';
      case 'Planning Tools':
        return '🗂️';
      case 'Reference Handouts/One-Pagers':
        return '📄';
      default:
        return '📄'; // Default to reference handout icon
    }
  };

  if (loading) {
    return (
      <PagePaper>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </PagePaper>
    );
  }

  if (!section || !lesson) {
    return (
      <PagePaper>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Lesson Not Found
          </h1>
          <p className="text-slate-600 mb-6">
            The lesson you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push('/')}>
            Return Home
          </Button>
        </div>
      </PagePaper>
    );
  }

  return (
    <PagePaper>
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <button
            onClick={() => router.push(`/sections/${section.id}`)}
            className="hover:text-slate-700"
          >
            {section.title}
          </button>
          <span>/</span>
          <span className="font-medium text-slate-900">{lesson.title}</span>
        </div>

        {/* Lesson Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            {lesson.title}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-6">
            {lesson.summary}
          </p>
          
          {/* Lesson Introduction */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h2 className="font-semibold text-gray-900 mb-3">
              Lesson Introduction
            </h2>
            <div className="text-gray-700 leading-relaxed">
              {section.id === 'leadership' ? (
                <div className="space-y-4">
                  <p>
                    Leadership in the Elevate Adolescence Program is not about holding authority—it&apos;s about setting the tone, modeling integrity, and guiding with responsiveness. As a facilitator, your leadership shapes how safe, engaged, and empowered participants feel in your group.
                  </p>
                  
                  <p>This module will help you strengthen three key leadership skills:</p>
                  
                  <ul className="ml-4 space-y-2">
                    <li><strong>Providing Feedback</strong> that encourages growth instead of correction alone.</li>
                    <li><strong>Fostering Independence</strong> by giving participants space to make choices, practice autonomy, and discover their own strengths.</li>
                    <li><strong>Decision-Making in the Moment</strong> so you can calmly adjust when plans shift, energy changes, or challenges arise.</li>
                  </ul>
                  
                  <p>
                    Strong leadership is both structured and soft. It means creating consistency and boundaries while also allowing flexibility and care. Through this module, you will practice leading in real time—whether it&apos;s guiding discussions, supporting youth through challenges, or stepping back to let them take the lead.
                  </p>
                  
                  <p>
                    The goal is not perfection, but presence: showing up with clarity, courage, and compassion so participants feel seen, supported, and inspired to rise.
                  </p>
                </div>
              ) : (
                <p>
                  Welcome to this lesson on {lesson.title.toLowerCase()}. In this session, you&apos;ll develop practical skills and strategies that you can immediately apply in your facilitation practice. Take your time to engage with the materials, reflect on the concepts, and make notes about how these ideas connect to your current facilitation challenges and opportunities.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Why It Matters */}
        {lesson.whyItMatters && (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Why It Matters</h2>
              <p className="text-slate-700 leading-relaxed">
                {lesson.whyItMatters}
              </p>
            </div>
            <hr className="mb-8 border-slate-200" />
          </>
        )}

        {/* Key Strategies and Tools with Notes */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Key Strategies and Tools</h2>
          
          <div className="space-y-3 mb-6">
            {lesson.strategies.map((strategy, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border-l-4 border-blue-500"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 flex-shrink-0" />
                <p className="text-slate-900 leading-relaxed">
                  {strategy}
                </p>
              </div>
            ))}
          </div>

        </div>
        <hr className="mb-8 border-slate-200" />

        {/* Step Back Reflection Question */}
        {stepBackQuestions[lesson.id] && (
          <>
            <StepBackSection
              question={stepBackQuestions[lesson.id]}
              sectionId={section.id}
              lessonId={lesson.id}
            />
            <hr className="mb-8 border-slate-200" />
          </>
        )}

        {/* Lesson-Specific Content - Section 5 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            {lesson.id === 'build-feedback' ? 'The Power of Feedback' : lesson.id === 'practice-feedback' ? 'Feedback Scenarios' : lesson.id === 'strengthen-feedback' ? 'Feedback Planning Tool – Quick Guide' : lesson.id === 'build-independence' ? 'Fostering Independence: The Importance of Trust' : lesson.id === 'practice-independence' ? 'Independence Scenarios' : lesson.id === 'strengthen-independence' ? 'Scaffolding Independence' : lesson.id === 'build-decision-making' ? 'When to Pivot – Quick Guide' : lesson.id === 'practice-decision-making' ? 'Decision-Making Scenarios' : lesson.id === 'strengthen-decision-making' ? 'Scenario: The Group Energy Shift' : lesson.id === 'build-lead-by-example' ? 'Leading by Example: The Foundation of Trust' : lesson.id === 'practice-lead-by-example' ? 'Practice Scenarios: Aligning Words and Actions' : lesson.id === 'strengthen-lead-by-example' ? 'Authenticity & Clarity' : lesson.id === 'build-nonverbal-awareness' ? 'The Three Types of Communication' : lesson.id === 'practice-nonverbal-awareness' ? 'Communication Practice Scenarios' : lesson.id === 'strengthen-nonverbal-awareness' ? 'Strengthening Communication Practice' : lesson.id === 'build-family-partnership' ? 'Group Communication with Families' : lesson.id === 'practice-family-partnership' ? 'Family Partnership Practice Scenarios' : lesson.id === 'strengthen-family-partnership' ? 'Strengthening Caregiver Communication' : lesson.id === 'build-listening-strategies' ? 'Effective Listening' : lesson.id === 'practice-listening-strategies' ? 'Practice Review – Effective Listening in Action' : lesson.id === 'strengthen-listening-strategies' ? 'Putting Listening into Practice' : lesson.id === 'build-open-ended-questions' ? 'Closed vs. Open-Ended Questions' : lesson.id === 'practice-open-ended-questions' ? 'Practice Review – Turning Closed Questions into Open Ones' : lesson.id === 'build-group-dynamics' ? 'Understanding Group Dynamics (Build)' : lesson.id === 'practice-group-dynamics' ? 'Practice Scenarios – Managing Group Dynamics' : lesson.id === 'strengthen-group-dynamics' ? 'Managing Group Dynamics (Strengthen)' : lesson.id === 'build-trust' ? 'Building Trust with Young Learners' : lesson.id === 'practice-trust' ? 'Facilitator Trust Checklist' : lesson.id === 'strengthen-trust' ? 'Lesson Summary – Designing for Trust' : lesson.id === 'build-self-reflection' ? 'Self-Reflection' : lesson.id === 'practice-self-reflection' ? 'Mirror Moments Map' : lesson.id === 'strengthen-self-reflection' ? 'Live Lab: Pause · Notice · Choose' : lesson.id === 'build-bias-awareness' ? 'Bias Awareness' : lesson.id === 'practice-bias-awareness' ? 'Interrupting Bias' : lesson.id === 'strengthen-bias-awareness' ? 'Turning Awareness Into Action' : lesson.id === 'build-inclusion-scanning' ? 'Inclusion Scanning' : lesson.id === 'practice-inclusion-scanning' ? 'Real-Time Scanning & Adaptive Response' : lesson.id === 'strengthen-inclusion-scanning' ? 'Practice Review – From Scanning to Shaping' : lesson.id === 'integration-reflection' ? 'Key Takeaways Across Phases' : lesson.id === 'syllabus-overview' ? 'EAP Facilitator Training Syllabus – Overview' : 'Section 5 - Placeholder'}
          </h2>
          {lesson.id === 'build-feedback' ? (
            <p className="text-slate-700 leading-relaxed">
              Feedback isn&apos;t about right or wrong—it&apos;s about guiding growth. In facilitation, your words can build trust, spark confidence, and encourage deeper engagement. When offered with care and clarity, feedback becomes a tool that helps participants see their strengths, understand their opportunities, and step forward with greater self-awareness.
            </p>
          ) : lesson.id === 'practice-feedback' ? (
            <div className="space-y-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-green-900">Constructive Feedback Scenario</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-green-800 mb-2">Scenario:</p>
                    <p className="text-green-700 leading-relaxed">During a group activity, a participant rushes through the instructions and misses a key step.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-green-800 mb-2">Facilitator Response:</p>
                    <p className="text-green-700 leading-relaxed italic">&quot;I noticed you jumped ahead before checking the directions. Slowing down will help you catch all the details. You&apos;ve got great energy—let&apos;s channel it into accuracy too.&quot;</p>
                  </div>
                  <div>
                    <p className="font-semibold text-green-800 mb-2">Why it Works:</p>
                    <p className="text-green-700 leading-relaxed">The facilitator is timely, naming the specific behavior (rushing) and pairing it with encouragement. The participant feels guided, not criticized, and learns how to adjust without losing confidence.</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg">
                    <p className="font-semibold text-green-800 mb-2">Facilitator Tip:</p>
                    <p className="text-green-700 leading-relaxed">Pair correction with encouragement—point out the behavior, then highlight a strength the participant can build on.</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-900">Action-Oriented Feedback Scenario</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-blue-800 mb-2">Scenario:</p>
                    <p className="text-blue-700 leading-relaxed">At the start of a journaling activity, the facilitator reminds the group of today&apos;s goal: &quot;Share one strength you want to practice.&quot; Halfway through, a participant looks unsure.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-800 mb-2">Facilitator Response:</p>
                    <p className="text-blue-700 leading-relaxed italic">&quot;Remember our goal is to name one strength. What&apos;s one quality you&apos;d like to practice more often? It doesn&apos;t have to be perfect—you can always revise later.&quot;</p>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-800 mb-2">Why it Works:</p>
                    <p className="text-blue-700 leading-relaxed">The facilitator connects back to the session goal and shows flexibility. This reinforces that feedback isn&apos;t just an end-point judgment—it&apos;s a continuous guide for progress.</p>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <p className="font-semibold text-blue-800 mb-2">Facilitator Tip:</p>
                    <p className="text-blue-700 leading-relaxed">Always link feedback to clear goals—remind youth of the target and show how they can take small steps toward it.</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-purple-900">Self-Assessed Feedback Scenario</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-purple-800 mb-2">Scenario:</p>
                    <p className="text-purple-700 leading-relaxed">After a teamwork challenge, the facilitator gathers the group.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-purple-800 mb-2">Facilitator Prompt:</p>
                    <p className="text-purple-700 leading-relaxed italic">&quot;On a scale from 1–5, how well did your team communicate? Write your number, then share one thing you&apos;d do differently next time.&quot;</p>
                  </div>
                  <div>
                    <p className="font-semibold text-purple-800 mb-2">Why it Works:</p>
                    <p className="text-purple-700 leading-relaxed">The youth generate their own reflection first, which fosters ownership and metacognition. The facilitator shifts from evaluator to guide, encouraging growth from within rather than imposing it from the outside.</p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-lg">
                    <p className="font-semibold text-purple-800 mb-2">Facilitator Tip:</p>
                    <p className="text-purple-700 leading-relaxed">Ask before you tell—invite participants to reflect on their own performance before adding your perspective.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : lesson.id === 'strengthen-feedback' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                The Feedback Planning Tool helps you prepare before stepping into a session, so your feedback feels purposeful, timely, and supportive rather than reactive.
              </p>
              
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">How to Use It:</h3>
                <ol className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">1</span>
                    <div>
                      <strong>Set Intentions</strong> – Decide what skills, behaviors, or goals you&apos;ll focus on reinforcing during the session.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">2</span>
                    <div>
                      <strong>Identify Opportunities</strong> – Anticipate moments when feedback can be built in (during activities, transitions, or reflection time).
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">3</span>
                    <div>
                      <strong>Match the Type</strong> – Choose whether constructive, action-oriented, or self-assessed feedback best fits the moment.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">4</span>
                    <div>
                      <strong>Plan Language</strong> – Draft simple, clear phrases that emphasize behaviors, effort, and next steps.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">5</span>
                    <div>
                      <strong>Stay Flexible</strong> – Use the plan as a guide, but adjust in real time to the group&apos;s energy and needs.
                    </div>
                  </li>
                </ol>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-blue-900">Why It Works:</h3>
                <p className="text-blue-800 leading-relaxed">
                  A plan keeps you consistent and intentional. It ensures feedback supports trust, motivates growth, and creates a culture where participants see feedback as part of learning—not judgment.
                </p>
              </div>
            </div>
          ) : lesson.id === 'build-independence' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                Independence grows when youth feel trusted. Trust communicates belief in their ability to try, make choices, and learn from mistakes. When facilitators step back at the right times, they send a powerful message: &quot;You are capable. Your effort matters. You don&apos;t need to be perfect to belong here.&quot;
              </p>
              
              <p className="text-slate-700 leading-relaxed">
                This balance of guidance and autonomy builds self-efficacy, strengthens decision-making, and helps participants develop the confidence to take ownership of their growth.
              </p>
              
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-teal-900">Strategies for Encouraging Autonomy</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-teal-800">Offer Choices</strong> <span className="text-teal-700">– Give participants options in activities or decision-making to practice ownership.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-teal-800">Validate Effort</strong> <span className="text-teal-700">– Recognize persistence and creativity, not just outcomes.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-teal-800">Encourage Problem-Solving</strong> <span className="text-teal-700">– Step back and let youth try solutions before stepping in.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-teal-800">Use Open-Ended Prompts</strong> <span className="text-teal-700">– Ask guiding questions instead of giving direct answers.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-teal-800">Allow Safe Mistakes</strong> <span className="text-teal-700">– Treat mistakes as learning opportunities, not failures.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-teal-800">Set Clear, Flexible Goals</strong> <span className="text-teal-700">– Provide structure while leaving room for self-direction.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-teal-800">Promote Reflection</strong> <span className="text-teal-700">– Ask participants to think about what worked, what didn&apos;t, and what they&apos;d do differently.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : lesson.id === 'practice-independence' ? (
            <div className="space-y-8">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-emerald-900">Scenario 1: Offering Choices</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-emerald-800 mb-2">Situation:</p>
                    <p className="text-emerald-700 leading-relaxed">The group is about to start a creative activity. A participant looks hesitant, unsure where to begin.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-800 mb-2">Facilitator Response:</p>
                    <p className="text-emerald-700 leading-relaxed italic">&quot;You can start with markers or collage materials—what feels more fun for you right now?&quot;</p>
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-800 mb-2">Why it Works:</p>
                    <p className="text-emerald-700 leading-relaxed">Offering choices signals trust in the participant&apos;s ability to decide, which builds confidence.</p>
                  </div>
                  <div className="bg-emerald-100 p-4 rounded-lg">
                    <p className="font-semibold text-emerald-800 mb-2">Facilitator Tip:</p>
                    <p className="text-emerald-700 leading-relaxed">Frame choices so both options are positive—avoid &quot;right&quot; vs. &quot;wrong&quot; choices.</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-orange-900">Scenario 2: Encouraging Problem-Solving</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-orange-800 mb-2">Situation:</p>
                    <p className="text-orange-700 leading-relaxed">A team struggles to assemble a group puzzle and looks to the facilitator for answers.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-orange-800 mb-2">Facilitator Response:</p>
                    <p className="text-orange-700 leading-relaxed italic">&quot;I see it&apos;s tricky. What&apos;s one new strategy your group could try before I jump in?&quot;</p>
                  </div>
                  <div>
                    <p className="font-semibold text-orange-800 mb-2">Why it Works:</p>
                    <p className="text-orange-700 leading-relaxed">This encourages youth to try their own solutions first, reinforcing independence and resilience.</p>
                  </div>
                  <div className="bg-orange-100 p-4 rounded-lg">
                    <p className="font-semibold text-orange-800 mb-2">Facilitator Tip:</p>
                    <p className="text-orange-700 leading-relaxed">Resist the urge to fix problems quickly—give space for youth to wrestle with challenges.</p>
                  </div>
                </div>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-rose-900">Scenario 3: Allowing Safe Mistakes</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-rose-800 mb-2">Situation:</p>
                    <p className="text-rose-700 leading-relaxed">A participant volunteers to lead a warm-up game but forgets a rule.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-rose-800 mb-2">Facilitator Response:</p>
                    <p className="text-rose-700 leading-relaxed italic">&quot;Thanks for leading! What worked well? And what&apos;s one tweak you&apos;d make if you ran it again?&quot;</p>
                  </div>
                  <div>
                    <p className="font-semibold text-rose-800 mb-2">Why it Works:</p>
                    <p className="text-rose-700 leading-relaxed">Mistakes are reframed as learning opportunities, which reduces fear and builds trust.</p>
                  </div>
                  <div className="bg-rose-100 p-4 rounded-lg">
                    <p className="font-semibold text-rose-800 mb-2">Facilitator Tip:</p>
                    <p className="text-rose-700 leading-relaxed">Normalize mistakes by calling them &quot;practice rounds&quot; or &quot;test runs.&quot;</p>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-indigo-900">Scenario 4: Promoting Reflection</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-indigo-800 mb-2">Situation:</p>
                    <p className="text-indigo-700 leading-relaxed">After a group discussion, a facilitator asks participants to pause.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-indigo-800 mb-2">Facilitator Prompt:</p>
                    <p className="text-indigo-700 leading-relaxed italic">&quot;Take a minute to think—what part of this conversation did you contribute most to? What&apos;s one thing you&apos;d like to try next time?&quot;</p>
                  </div>
                  <div>
                    <p className="font-semibold text-indigo-800 mb-2">Why it Works:</p>
                    <p className="text-indigo-700 leading-relaxed">Reflection encourages self-awareness and reinforces that participants&apos; growth belongs to them.</p>
                  </div>
                  <div className="bg-indigo-100 p-4 rounded-lg">
                    <p className="font-semibold text-indigo-800 mb-2">Facilitator Tip:</p>
                    <p className="text-indigo-700 leading-relaxed">Use open-ended prompts that start with &quot;what&quot; or &quot;how&quot; to guide reflection without judgment.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : lesson.id === 'strengthen-independence' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                Scaffolding is about gradually releasing responsibility: giving enough structure so youth feel supported, while also creating space for them to act independently. In this stage, facilitators design sessions that embed autonomy at every point—from setup to debrief—so participants trust their own abilities and each other.
              </p>
              
              <p className="text-slate-700 leading-relaxed">
                This process unfolds in six key steps, each tied to a strategy that helps participants move from dependence toward independence:
              </p>

              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-6">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-cyan-900 mb-2">Pre-Brief with Structured Choices</h4>
                      <p className="text-sm text-cyan-700 font-medium mb-2">Strategy: Structured Choices</p>
                      <p className="text-cyan-800 mb-2"><strong>Facilitator Move:</strong> Offer options on how youth can record or brainstorm.</p>
                      <p className="text-cyan-800"><strong>Why it Works:</strong> Builds early ownership and signals trust in participants&apos; decision-making.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-cyan-900 mb-2">Mid-Activity Role Rotation</h4>
                      <p className="text-sm text-cyan-700 font-medium mb-2">Strategy: Role Rotation</p>
                      <p className="text-cyan-800 mb-2"><strong>Facilitator Move:</strong> Reassign group roles (scribe, timekeeper, leader) when participation is uneven.</p>
                      <p className="text-cyan-800"><strong>Why it Works:</strong> Ensures shared responsibility, helping all youth find a voice.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-cyan-900 mb-2">Guided Check-In with Reflection Prompt</h4>
                      <p className="text-sm text-cyan-700 font-medium mb-2">Strategy: Reflection Prompts</p>
                      <p className="text-cyan-800 mb-2"><strong>Facilitator Move:</strong> Ask questions like, &quot;What strengths could help your team right now?&quot;</p>
                      <p className="text-cyan-800"><strong>Why it Works:</strong> Connects abstract traits to action, encouraging problem-solving without facilitator takeover.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-cyan-900 mb-2">Visual Ownership in Progress Tracking</h4>
                      <p className="text-sm text-cyan-700 font-medium mb-2">Strategy: Visual Ownership</p>
                      <p className="text-cyan-800 mb-2"><strong>Facilitator Move:</strong> Have youth mark or decorate progress (e.g., starring strengths they used).</p>
                      <p className="text-cyan-800"><strong>Why it Works:</strong> Makes growth visible and links internal skills to tangible outcomes.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-cyan-900 mb-2">Goal-Setting in the Debrief</h4>
                      <p className="text-sm text-cyan-700 font-medium mb-2">Strategy: Personal Goal-Setting</p>
                      <p className="text-cyan-800 mb-2"><strong>Facilitator Move:</strong> Ask, &quot;What&apos;s one strength you want to use more next time?&quot;</p>
                      <p className="text-cyan-800"><strong>Why it Works:</strong> Turns a group experience into individual future growth.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">6</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-cyan-900 mb-2">Celebrate Small Wins</h4>
                      <p className="text-sm text-cyan-700 font-medium mb-2">Strategy: Celebrating Small Wins</p>
                      <p className="text-cyan-800 mb-2"><strong>Facilitator Move:</strong> Highlight effort, collaboration, or resilience—even when outcomes vary.</p>
                      <p className="text-cyan-800"><strong>Why it Works:</strong> Reinforces that growth is about learning and persistence, not perfection.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-slate-900">Why This Matters</h3>
                <p className="text-slate-700 leading-relaxed">
                  This timeline demonstrates how facilitators can read group readiness and respond with the right level of support at the right moment. By layering strategies step by step, independence becomes part of the session flow, not an afterthought. Youth leave not only with skills, but also with the belief that they can lead, decide, and grow on their own.
                </p>
              </div>
            </div>
          ) : lesson.id === 'build-decision-making' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                Strong facilitators know that part of leadership is reading the room and adjusting in the moment. Pivoting isn&apos;t abandoning your plan—it&apos;s responding to what participants need so learning stays meaningful and safe.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-amber-900">Cues for Changing Your Approach:</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-amber-800">Participant Disengagement</strong> <span className="text-amber-700">– energy dips, side conversations, or blank stares signal a need to re-energize or shift activity.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-amber-800">Emotional Shifts</strong> <span className="text-amber-700">– frustration, defensiveness, or withdrawal mean the group may need grounding, reassurance, or a pause.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-amber-800">Unexpected Barriers</strong> <span className="text-amber-700">– missing supplies, time crunches, or tech issues call for flexibility and quick re-framing.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-amber-800">Off-Script Opportunities</strong> <span className="text-amber-700">– when curiosity or insights emerge naturally, seize the moment to deepen learning.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-violet-50 border border-violet-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-violet-900">Types of Cues to Watch For:</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-violet-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-violet-800">Cognitive/Engagement Cues</strong> <span className="text-violet-700">– participants aren&apos;t grasping instructions, or focus is slipping.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-violet-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-violet-800">Emotional/Relational Cues</strong> <span className="text-violet-700">– tone, body language, or group dynamics suggest a shift in trust, safety, or confidence.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-violet-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-violet-800">Structural/Logistical Cues</strong> <span className="text-violet-700">– physical space, timing, or materials affect how smoothly the activity runs.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-slate-900">Why it Matters:</h3>
                <p className="text-slate-700 leading-relaxed">
                  Pivoting in response to these signals shows participants that their needs take priority over &quot;sticking to the script.&quot; It builds trust, keeps sessions alive, and models adaptive leadership.
                </p>
              </div>
            </div>
          ) : lesson.id === 'practice-decision-making' ? (
            <div className="space-y-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-red-900">Scenario 1 – Participant Disengagement</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-red-800 mb-2">Cue (Cognitive/Engagement):</p>
                    <p className="text-red-700 leading-relaxed">During a journaling activity, several participants start doodling, whispering, or staring off into space.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-red-800 mb-2">Facilitator Pivot:</p>
                    <p className="text-red-700 leading-relaxed italic">&quot;Looks like our brains need a reset—let&apos;s stand up for a quick stretch and then share one word that describes how you&apos;re feeling right now.&quot;</p>
                  </div>
                  <div>
                    <p className="font-semibold text-red-800 mb-2">Why it Works:</p>
                    <p className="text-red-700 leading-relaxed">Breaks monotony, re-engages attention, and creates space for youth to reset before returning to the activity.</p>
                  </div>
                  <div className="bg-red-100 p-4 rounded-lg">
                    <p className="font-semibold text-red-800 mb-2">Facilitator Tip:</p>
                    <p className="text-red-700 leading-relaxed">Keep pivots light and energizing—sometimes a 2-minute shift is all it takes to bring focus back.</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-yellow-900">Scenario 2 – Emotional Shifts</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-yellow-800 mb-2">Cue (Emotional/Relational):</p>
                    <p className="text-yellow-700 leading-relaxed">A participant shares something personal in discussion. Another sighs loudly and rolls their eyes, causing the first to go quiet.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-yellow-800 mb-2">Facilitator Pivot:</p>
                    <p className="text-yellow-700 leading-relaxed italic">&quot;Let&apos;s pause. Remember, what&apos;s shared here deserves respect. Can someone reflect back what they heard just now, so we can really honor that moment?&quot;</p>
                  </div>
                  <div>
                    <p className="font-semibold text-yellow-800 mb-2">Why it Works:</p>
                    <p className="text-yellow-700 leading-relaxed">Restores emotional safety, validates the speaker, and redirects group norms without shaming anyone.</p>
                  </div>
                  <div className="bg-yellow-100 p-4 rounded-lg">
                    <p className="font-semibold text-yellow-800 mb-2">Facilitator Tip:</p>
                    <p className="text-yellow-700 leading-relaxed">Address breaches immediately and gently—silence can do more harm than the disruption itself.</p>
                  </div>
                </div>
              </div>

              <div className="bg-sky-50 border border-sky-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-sky-900">Scenario 3 – Unexpected Barriers</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-sky-800 mb-2">Cue (Structural/Logistical):</p>
                    <p className="text-sky-700 leading-relaxed">A planned outdoor activity is rained out, and participants look disappointed.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sky-800 mb-2">Facilitator Pivot:</p>
                    <p className="text-sky-700 leading-relaxed italic">&quot;Looks like the weather has its own plan! Instead of our outdoor challenge, let&apos;s bring the energy inside—we&apos;ll adapt the teamwork game to fit our space.&quot;</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sky-800 mb-2">Why it Works:</p>
                    <p className="text-sky-700 leading-relaxed">Models flexibility, keeps momentum alive, and reassures participants that the experience is still valuable.</p>
                  </div>
                  <div className="bg-sky-100 p-4 rounded-lg">
                    <p className="font-semibold text-sky-800 mb-2">Facilitator Tip:</p>
                    <p className="text-sky-700 leading-relaxed">Name the barrier with humor or calmness—your response teaches youth how to handle setbacks with resilience.</p>
                  </div>
                </div>
              </div>

              <div className="bg-lime-50 border border-lime-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-lime-900">Scenario 4 – Off-Script Opportunities</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-lime-800 mb-2">Cue (Cognitive/Engagement + Emotional/Relational):</p>
                    <p className="text-lime-700 leading-relaxed">In the middle of a planned exercise on leadership, a participant shares a story about helping a friend through a tough time. Other participants lean in and nod.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-lime-800 mb-2">Facilitator Pivot:</p>
                    <p className="text-lime-700 leading-relaxed italic">&quot;That&apos;s a powerful example of leadership through empathy. Let&apos;s pause here—who else has a story of showing leadership in an everyday way?&quot;</p>
                  </div>
                  <div>
                    <p className="font-semibold text-lime-800 mb-2">Why it Works:</p>
                    <p className="text-lime-700 leading-relaxed">Seizes a natural moment of connection, deepens discussion, and makes the lesson personally relevant.</p>
                  </div>
                  <div className="bg-lime-100 p-4 rounded-lg">
                    <p className="font-semibold text-lime-800 mb-2">Facilitator Tip:</p>
                    <p className="text-lime-700 leading-relaxed">When youth show genuine curiosity or connection, lean in—these unscripted moments often deliver the deepest learning.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : lesson.id === 'strengthen-decision-making' ? (
            <div className="space-y-8">
              <p className="text-slate-700 leading-relaxed">
                You&apos;ve been facilitating a leadership session, and halfway through, the group&apos;s energy suddenly shifts. Use this scenario to practice real-time decision-making skills as you navigate changing group dynamics.
              </p>
              
              {/* Checkpoint 1 */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-slate-900">Checkpoint 1: Initial Setup</h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  You&apos;re 20 minutes into a structured team-building activity. The group had been engaged and collaborative, but now you notice several participants looking at their phones, two people whispering in the corner, and the overall energy feels flat.
                </p>
                <p className="font-medium text-slate-800 mb-3">
                  What is your immediate response to this shift in group energy?
                </p>
                <textarea
                  value={checkpointResponses.checkpoint1}
                  onChange={(e) => handleCheckpointResponse('checkpoint1', e.target.value)}
                  placeholder="Your response here..."
                  className="w-full min-h-[100px] p-4 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white mb-4"
                />
                
                <button
                  onClick={() => toggleAnswer('answer1')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  {expandedAnswers.answer1 ? '▼' : '▶'} Model Answer
                </button>
                
                {expandedAnswers.answer1 && (
                  <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                    <p className="text-blue-800 leading-relaxed">
                      <strong>Pause and acknowledge:</strong> &quot;I&apos;m noticing our energy has shifted a bit. Let&apos;s take a moment to reset.&quot; Then offer a choice: &quot;Would you prefer to take a 2-minute stretch break, or should we shift gears and try something more active?&quot; This acknowledges the change without blame and gives the group agency in the solution.
                    </p>
                  </div>
                )}
              </div>

              {/* Checkpoint 2 */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-slate-900">Checkpoint 2: Implementing Change</h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  After your initial response, you decide to pivot the activity. However, one participant says, &quot;Can&apos;t we just finish what we started? I was actually getting into it,&quot; while another responds, &quot;Yeah, but half of us are clearly over it.&quot;
                </p>
                <p className="font-medium text-slate-800 mb-3">
                  How do you navigate these competing needs while maintaining group cohesion?
                </p>
                <textarea
                  value={checkpointResponses.checkpoint2}
                  onChange={(e) => handleCheckpointResponse('checkpoint2', e.target.value)}
                  placeholder="Your response here..."
                  className="w-full min-h-[100px] p-4 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white mb-4"
                />
                
                <button
                  onClick={() => toggleAnswer('answer2')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                >
                  {expandedAnswers.answer2 ? '▼' : '▶'} Model Answer
                </button>
                
                {expandedAnswers.answer2 && (
                  <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                    <p className="text-green-800 leading-relaxed">
                      <strong>Honor both perspectives:</strong> &quot;I hear both sides—some of you want to continue, others are ready for something different. Let&apos;s compromise: we&apos;ll wrap up this round in 3 minutes so everyone gets closure, then transition to something that re-energizes the whole group.&quot; This validates both viewpoints while maintaining your role as the decision-maker.
                    </p>
                  </div>
                )}
              </div>

              {/* Checkpoint 3 */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-slate-900">Checkpoint 3: Mid-Course Correction</h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  You&apos;ve implemented your compromise, but as you transition to the new activity, you realize you don&apos;t have all the materials you need. The group is looking at you expectantly, and you can sense some frustration starting to build.
                </p>
                <p className="font-medium text-slate-800 mb-3">
                  What do you do when your pivot plan hits an unexpected obstacle?
                </p>
                <textarea
                  value={checkpointResponses.checkpoint3}
                  onChange={(e) => handleCheckpointResponse('checkpoint3', e.target.value)}
                  placeholder="Your response here..."
                  className="w-full min-h-[100px] p-4 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white mb-4"
                />
                
                <button
                  onClick={() => toggleAnswer('answer3')}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  {expandedAnswers.answer3 ? '▼' : '▶'} Model Answer
                </button>
                
                {expandedAnswers.answer3 && (
                  <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
                    <p className="text-amber-800 leading-relaxed">
                      <strong>Be transparent and collaborative:</strong> &quot;Alright, plot twist—I&apos;m missing some supplies for what I had planned. This happens sometimes! Let&apos;s put our heads together: what could we do with what we have right here?&quot; Turn the obstacle into a group problem-solving opportunity. Your honesty models resilience and shows that adaptability is a strength, not a failure.
                    </p>
                  </div>
                )}
              </div>

              {/* Checkpoint 4 */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-slate-900">Checkpoint 4: Resolution and Learning</h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  The group successfully brainstorms a creative solution using available materials, and the energy is now positive and collaborative. As the session comes to an end, you want to help participants reflect on what just happened.
                </p>
                <p className="font-medium text-slate-800 mb-3">
                  How do you debrief this experience to maximize the learning opportunity?
                </p>
                <textarea
                  value={checkpointResponses.checkpoint4}
                  onChange={(e) => handleCheckpointResponse('checkpoint4', e.target.value)}
                  placeholder="Your response here..."
                  className="w-full min-h-[100px] p-4 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white mb-4"
                />
                
                <button
                  onClick={() => toggleAnswer('answer4')}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  {expandedAnswers.answer4 ? '▼' : '▶'} Model Answer
                </button>
                
                {expandedAnswers.answer4 && (
                  <div className="mt-4 p-4 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
                    <p className="text-purple-800 leading-relaxed">
                      <strong>Connect to real-world application:</strong> &quot;Let&apos;s talk about what just happened—we hit some bumps, adjusted course, and ended up somewhere different but good. What does this teach us about handling unexpected changes in our own lives? How did it feel when we shifted from following a plan to creating our own solution?&quot; Help them see that flexibility and collaboration are transferable leadership skills.
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-slate-100 border border-slate-300 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold mb-3 text-slate-900">Key Takeaway</h3>
                <p className="text-slate-700 leading-relaxed">
                  Effective decision-making in facilitation isn&apos;t about having a perfect plan—it&apos;s about staying present, reading the room, and adapting with confidence. When you model flexibility and collaborative problem-solving, you teach participants that challenges are opportunities for growth and creativity.
                </p>
              </div>
            </div>
          ) : lesson.id === 'build-lead-by-example' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                In facilitation, youth learn more from what you do than what you say. The Build stage of Lead by Example focuses on becoming aware of how your actions, tone, and consistency set the standard for the group.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-900">Core Practices for Leading by Example</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-blue-800">Model Values and Behaviors:</strong> <span className="text-blue-700">Show the same respect, patience, and openness you expect from participants.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-blue-800">Consistency Builds Trust:</strong> <span className="text-blue-700">Keep your word, start on time, and follow the group agreements. These small actions show reliability.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-blue-800">Body Language Matters:</strong> <span className="text-blue-700">Your non-verbal cues (eye contact, posture, expression) communicate just as much as your words.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-blue-800">Practice Alignment:</strong> <span className="text-blue-700">Ask yourself, &quot;Am I demonstrating the qualities I want participants to practice—like empathy, curiosity, and responsibility?&quot;</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-slate-900">Why it Matters:</h3>
                <p className="text-slate-700 leading-relaxed">
                  When facilitators embody the behaviors they ask of others, participants feel safer, more motivated, and more likely to mirror those behaviors themselves. Leading by example sets the tone for the entire learning environment.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-green-900">Values & Behaviors to Model as a Facilitator</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2.5 flex-shrink-0"></div>
                      <div>
                        <strong className="text-green-800">Respect</strong> <span className="text-green-700">– Speak with care, listen actively, and acknowledge every voice.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2.5 flex-shrink-0"></div>
                      <div>
                        <strong className="text-green-800">Consistency</strong> <span className="text-green-700">– Start and end on time, follow through on commitments, and keep group agreements.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2.5 flex-shrink-0"></div>
                      <div>
                        <strong className="text-green-800">Integrity</strong> <span className="text-green-700">– Be honest, transparent, and fair in your decisions.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2.5 flex-shrink-0"></div>
                      <div>
                        <strong className="text-green-800">Patience</strong> <span className="text-green-700">– Give youth space to process, try, and make mistakes without rushing.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2.5 flex-shrink-0"></div>
                      <div>
                        <strong className="text-green-800">Empathy</strong> <span className="text-green-700">– Show understanding through tone, expression, and validating words.</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-teal-500 mt-2.5 flex-shrink-0"></div>
                      <div>
                        <strong className="text-teal-800">Openness</strong> <span className="text-teal-700">– Welcome diverse perspectives and encourage curiosity.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-teal-500 mt-2.5 flex-shrink-0"></div>
                      <div>
                        <strong className="text-teal-800">Responsibility</strong> <span className="text-teal-700">– Own your mistakes, adjust when needed, and model accountability.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-teal-500 mt-2.5 flex-shrink-0"></div>
                      <div>
                        <strong className="text-teal-800">Calmness under Pressure</strong> <span className="text-teal-700">– Respond thoughtfully instead of reacting, especially when challenges arise.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-teal-500 mt-2.5 flex-shrink-0"></div>
                      <div>
                        <strong className="text-teal-800">Clarity</strong> <span className="text-teal-700">– Use simple, direct language and model positive communication.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-teal-500 mt-2.5 flex-shrink-0"></div>
                      <div>
                        <strong className="text-teal-800">Inclusivity</strong> <span className="text-teal-700">– Actively invite participation from quieter voices and model equity in group interactions.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : lesson.id === 'practice-lead-by-example' ? (
            <div className="space-y-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-red-900">Scenario 1 – Respect & Listening</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-red-800 mb-2">Situation:</p>
                    <p className="text-red-700 leading-relaxed">A facilitator tells the group, &quot;Every voice matters here,&quot; but when a quieter participant starts sharing, they quickly move on to another speaker.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-red-800 mb-2">Practice Prompt:</p>
                    <p className="text-red-700 leading-relaxed">How could you adjust your behavior to align with your words?</p>
                  </div>
                  <div className="bg-red-100 p-4 rounded-lg">
                    <p className="font-semibold text-red-800 mb-2">Facilitator Practice:</p>
                    <p className="text-red-700 leading-relaxed italic">Pause, give eye contact, and say, &quot;Let&apos;s make sure we hear your full thought—please continue.&quot;</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-orange-900">Scenario 2 – Consistency & Timekeeping</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-orange-800 mb-2">Situation:</p>
                    <p className="text-orange-700 leading-relaxed">At the start of the program, the facilitator stresses, &quot;We value punctuality,&quot; but they begin sessions late while chatting with other adults.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-orange-800 mb-2">Practice Prompt:</p>
                    <p className="text-orange-700 leading-relaxed">What could you do to model the expectation you&apos;ve set?</p>
                  </div>
                  <div className="bg-orange-100 p-4 rounded-lg">
                    <p className="font-semibold text-orange-800 mb-2">Facilitator Practice:</p>
                    <p className="text-orange-700 leading-relaxed italic">Begin sessions on time, even if not everyone has arrived, and explain: &quot;We&apos;ll respect our time together by starting promptly.&quot;</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-yellow-900">Scenario 3 – Patience & Mistakes</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-yellow-800 mb-2">Situation:</p>
                    <p className="text-yellow-700 leading-relaxed">A youth leads a game and forgets part of the instructions. The facilitator interrupts with corrections, even though they often say, &quot;Mistakes are part of learning.&quot;</p>
                  </div>
                  <div>
                    <p className="font-semibold text-yellow-800 mb-2">Practice Prompt:</p>
                    <p className="text-yellow-700 leading-relaxed">How could you stay aligned with your message about mistakes?</p>
                  </div>
                  <div className="bg-yellow-100 p-4 rounded-lg">
                    <p className="font-semibold text-yellow-800 mb-2">Facilitator Practice:</p>
                    <p className="text-yellow-700 leading-relaxed italic">Allow the youth to continue, then reflect: &quot;I love how you kept going even when it wasn&apos;t perfect—that&apos;s what learning looks like.&quot;</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-green-900">Scenario 4 – Calmness Under Pressure</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-green-800 mb-2">Situation:</p>
                    <p className="text-green-700 leading-relaxed">A disagreement breaks out. The facilitator says, &quot;We&apos;ll handle conflict with respect,&quot; but then raises their voice sharply to regain control.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-green-800 mb-2">Practice Prompt:</p>
                    <p className="text-green-700 leading-relaxed">How could you model calm conflict resolution instead?</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg">
                    <p className="font-semibold text-green-800 mb-2">Facilitator Practice:</p>
                    <p className="text-green-700 leading-relaxed italic">Take a breath, lower your tone, and say: &quot;Let&apos;s pause. Everyone deserves to be heard—we&apos;ll take turns.&quot;</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-900">Scenario 5 – Inclusivity & Equity</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-blue-800 mb-2">Situation:</p>
                    <p className="text-blue-700 leading-relaxed">A facilitator encourages, &quot;Everyone&apos;s perspective matters,&quot; but they consistently call on the same 2–3 confident voices in the circle.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-800 mb-2">Practice Prompt:</p>
                    <p className="text-blue-700 leading-relaxed">How might you bring your words into alignment with your facilitation moves?</p>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <p className="font-semibold text-blue-800 mb-2">Facilitator Practice:</p>
                    <p className="text-blue-700 leading-relaxed italic">Use a talking piece, random draw, or open the floor by inviting: &quot;I&apos;d love to hear from someone we haven&apos;t heard from yet.&quot;</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-100 border border-slate-300 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold mb-3 text-slate-900">Why it Works</h3>
                <p className="text-slate-700 leading-relaxed">
                  Practicing alignment between words and actions strengthens facilitator authenticity. When youth see words and behaviors match, trust grows—and participants mirror that authenticity back.
                </p>
              </div>
            </div>
          ) : lesson.id === 'strengthen-lead-by-example' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                Authentic facilitation is about more than words — it&apos;s about communicating with honesty, calm, and transparency, even under pressure. By practicing these strategies, facilitators build trust, model respect, and keep group energy grounded and focused.
              </p>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-indigo-900">Key Strategies:</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-indigo-800">Pause and Center Yourself</strong> <span className="text-indigo-700">– Take a breath before responding to stay calm and intentional.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-indigo-800">Use &quot;I&quot; Statements</strong> <span className="text-indigo-700">– Share your perspective without blame, reducing defensiveness and inviting understanding.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-indigo-800">Acknowledge Emotions</strong> <span className="text-indigo-700">– Recognize feelings (yours and participants&apos;) to create space for safety and trust.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-indigo-800">Clarify Calmly and Clearly</strong> <span className="text-indigo-700">– Repeat or reframe instructions with patience, keeping your tone steady and supportive.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-indigo-800">Ask for Support When Needed</strong> <span className="text-indigo-700">– Be willing to lean on co-facilitators; modeling humility shows collaboration is valued.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-slate-900">Why it Matters:</h3>
                <p className="text-slate-700 leading-relaxed">
                  These techniques help you stay grounded and consistent, allowing participants to feel safe, respected, and confident in both you and themselves.
                </p>
              </div>
            </div>
          ) : lesson.id === 'build-nonverbal-awareness' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                As a facilitator, your impact depends not just on what you say, but also on how you say it and how it is received. Communication happens in three main ways:
              </p>

              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-emerald-900">1. Verbal Communication</h3>
                  <p className="text-emerald-800 mb-4 font-medium">Spoken words + tone of voice.</p>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-emerald-800 mb-2">Examples:</p>
                      <p className="text-emerald-700">conversations, group discussions, speeches, calls.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-emerald-800 mb-2">Key Skills:</p>
                      <p className="text-emerald-700">Think before you speak, use clear pacing and tone, adapt to your audience, and check in with listeners to ensure understanding.</p>
                    </div>
                    <div className="bg-emerald-100 p-4 rounded-lg">
                      <p className="font-semibold text-emerald-800 mb-2">Facilitation in Action:</p>
                      <p className="text-emerald-700">In GRS Session 8 (REAL Talk for REALationships), facilitators use calm, empathetic speech to create safe spaces for sensitive conversations.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-blue-900">2. Nonverbal Communication</h3>
                  <p className="text-blue-800 mb-4 font-medium">Body language + unspoken cues.</p>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-blue-800 mb-2">Examples:</p>
                      <p className="text-blue-700">facial expressions, posture, gestures, physical appearance.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-800 mb-2">Key Skills:</p>
                      <p className="text-blue-700">Maintain open posture, use eye contact, nod or mirror attentively, and be aware of how nonverbal signals can reveal group comfort or resistance.</p>
                    </div>
                    <div className="bg-blue-100 p-4 rounded-lg">
                      <p className="font-semibold text-blue-800 mb-2">Facilitation in Action:</p>
                      <p className="text-blue-700">In Session 0 (Meet Your Village), facilitators show attentiveness through open body language, helping participants feel welcomed and respected.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-purple-900">3. Written Communication</h3>
                  <p className="text-purple-800 mb-4 font-medium">Text-based messages.</p>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-purple-800 mb-2">Examples:</p>
                      <p className="text-purple-700">emails, texts, memos, letters, handouts.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-purple-800 mb-2">Key Skills:</p>
                      <p className="text-purple-700">Keep grammar and tone professional, be concise and respectful, and match your message to your audience.</p>
                    </div>
                    <div className="bg-purple-100 p-4 rounded-lg">
                      <p className="font-semibold text-purple-800 mb-2">Facilitation in Action:</p>
                      <p className="text-purple-700">In GRS Parenting Toolkit handouts, clear, supportive language builds trust with families and extends the learning beyond sessions.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-slate-900">Why It Matters:</h3>
                <p className="text-slate-700 leading-relaxed">
                  Strong facilitators use all three forms of communication intentionally. Clear speech, supportive body language, and thoughtful writing build trust, model respect, and ensure participants (and their families) feel valued and understood.
                </p>
              </div>
            </div>
          ) : lesson.id === 'practice-nonverbal-awareness' ? (
            <div className="space-y-8">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-emerald-900">Verbal Communication Scenario</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-emerald-800 mb-2">Situation:</p>
                    <p className="text-emerald-700 leading-relaxed">During a discussion about bravery, a participant hesitates to share. The facilitator says quickly: &quot;It&apos;s okay, just go ahead—tell us now.&quot; The participant looks down and stays quiet.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-800 mb-2">Practice Prompt:</p>
                    <p className="text-emerald-700 leading-relaxed">How could you reframe your words and tone to invite participation more gently?</p>
                  </div>
                  <div className="bg-emerald-100 p-4 rounded-lg">
                    <p className="font-semibold text-emerald-800 mb-2">Facilitator Practice Move:</p>
                    <p className="text-emerald-700 leading-relaxed italic">&quot;Take your time—we&apos;d love to hear your thoughts when you&apos;re ready.&quot;</p>
                  </div>
                  <div className="bg-emerald-100 p-4 rounded-lg mt-3">
                    <p className="font-semibold text-emerald-800 mb-2">Why it Works:</p>
                    <p className="text-emerald-700 leading-relaxed">A calm tone and empathetic phrasing reduce pressure and show respect for the participant&apos;s pace.</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-900">Nonverbal Communication Scenario</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-blue-800 mb-2">Situation:</p>
                    <p className="text-blue-700 leading-relaxed">While leading a circle, the facilitator crosses their arms, avoids eye contact, and frequently checks their phone. Participants begin fidgeting and disengaging.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-800 mb-2">Practice Prompt:</p>
                    <p className="text-blue-700 leading-relaxed">What nonverbal adjustments could the facilitator make to re-engage the group?</p>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <p className="font-semibold text-blue-800 mb-2">Facilitator Practice Move:</p>
                    <p className="text-blue-700 leading-relaxed italic">Sit upright, keep an open posture, make eye contact, and nod affirmatively while youth share.</p>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-lg mt-3">
                    <p className="font-semibold text-blue-800 mb-2">Why it Works:</p>
                    <p className="text-blue-700 leading-relaxed">Nonverbal signals communicate attentiveness, helping participants feel seen and valued.</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-purple-900">Written Communication Scenario</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-purple-800 mb-2">Situation:</p>
                    <p className="text-purple-700 leading-relaxed">A facilitator sends a parent message: &quot;Reminder: Don&apos;t forget the session tomorrow. Bring the stuff.&quot; Several parents reply with confusion about what&apos;s required.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-purple-800 mb-2">Practice Prompt:</p>
                    <p className="text-purple-700 leading-relaxed">How could this message be rewritten to reflect clarity and professionalism?</p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-lg">
                    <p className="font-semibold text-purple-800 mb-2">Facilitator Practice Move:</p>
                    <p className="text-purple-700 leading-relaxed italic">&quot;Dear Parents, just a reminder that tomorrow&apos;s session begins at 6:00 PM. Please remind your child to bring their toolkit and journal. Thank you for your support!&quot;</p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-lg mt-3">
                    <p className="font-semibold text-purple-800 mb-2">Why it Works:</p>
                    <p className="text-purple-700 leading-relaxed">Clear, specific language builds trust with families and reinforces a professional, supportive tone.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : lesson.id === 'strengthen-nonverbal-awareness' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                Strong communication doesn&apos;t happen by accident—it requires practice and intentional strategies. As a facilitator, your ability to stay genuine, clear, and adaptable helps participants feel safe, supported, and engaged.
              </p>

              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-teal-900">Key Strategies:</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-teal-800">Pause and Center Yourself</strong> <span className="text-teal-700">– Take a breath before responding to stay calm and intentional.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-teal-800">Acknowledge Emotions</strong> <span className="text-teal-700">– Name feelings in the room to validate experiences and build trust.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-teal-800">Use Open Body Language</strong> <span className="text-teal-700">– Keep posture, eye contact, and gestures welcoming and inclusive.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-teal-800">Mirror Participant Energy</strong> <span className="text-teal-700">– Match the group&apos;s tone and pace to stay connected and responsive.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-teal-800">Be Clear and Professional</strong> <span className="text-teal-700">– Use straightforward, respectful language in all interactions.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-teal-800">Follow Up Thoughtfully</strong> <span className="text-teal-700">– Check back with participants or parents to reinforce support and connection.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-slate-900">Why it Matters:</h3>
                <p className="text-slate-700 leading-relaxed">
                  When you strengthen these habits, you model communication that is calm, respectful, and authentic—qualities that encourage youth to do the same.
                </p>
              </div>
            </div>
          ) : lesson.id === 'build-family-partnership' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                Strong facilitation extends beyond the youth—it also includes clear, respectful communication with parents and caregivers. Building trust with families helps create a supportive network for adolescent growth.
              </p>

              <div className="bg-violet-50 border border-violet-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-violet-900">Key Strategies:</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-violet-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-violet-800">Set Expectations</strong> <span className="text-violet-700">– Be clear at the start about program goals, structure, and how families can support their child.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-violet-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-violet-800">Use Positive Framing</strong> <span className="text-violet-700">– Share progress in ways that highlight strengths and growth, not just challenges.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-violet-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-violet-800">Be Proactive</strong> <span className="text-violet-700">– Provide consistent updates to build trust and show care, even when nothing urgent arises.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-violet-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-violet-800">Practice Active Listening</strong> <span className="text-violet-700">– Listen fully, ask clarifying questions, and reflect back to show understanding.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-violet-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-violet-800">Invite Collaboration</strong> <span className="text-violet-700">– Position parents as partners by asking for their insights and strategies.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-violet-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-violet-800">Maintain Professional Boundaries</strong> <span className="text-violet-700">– Balance warmth with clarity about your role and responsibilities.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-slate-900">Why it Matters:</h3>
                <p className="text-slate-700 leading-relaxed">
                  When facilitators use these strategies, they foster trust, partnership, and consistency between home and program—helping youth feel supported across all parts of their lives.
                </p>
              </div>
            </div>
          ) : lesson.id === 'practice-family-partnership' ? (
            <div className="space-y-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-900">Scenario 1 – Setting Expectations</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-blue-800 mb-2">Parent Question:</p>
                    <p className="text-blue-700 leading-relaxed">&quot;I don&apos;t really understand what my child will be doing in this program. How is it different from school?&quot;</p>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-800 mb-2">Practice Prompt:</p>
                    <p className="text-blue-700 leading-relaxed">How would you explain the goals and structure clearly, while helping the parent feel comfortable and included?</p>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <p className="font-semibold text-blue-800 mb-2">Facilitator Practice Move:</p>
                    <p className="text-blue-700 leading-relaxed italic">&quot;That&apos;s a great question. Our focus isn&apos;t academics—it&apos;s character and confidence building. Each week we explore a theme like self-awareness or courage through activities, discussions, and reflection. Parents play a key role by encouraging conversations at home.&quot;</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-green-900">Scenario 2 – Using Positive Framing</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-green-800 mb-2">Parent Concern:</p>
                    <p className="text-green-700 leading-relaxed">&quot;My daughter can&apos;t seem to stay focused. I&apos;m worried she&apos;s disrupting the group.&quot;</p>
                  </div>
                  <div>
                    <p className="font-semibold text-green-800 mb-2">Practice Prompt:</p>
                    <p className="text-green-700 leading-relaxed">How can you reframe this challenge in a positive way while still addressing the concern?</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg">
                    <p className="font-semibold text-green-800 mb-2">Facilitator Practice Move:</p>
                    <p className="text-green-700 leading-relaxed italic">&quot;She brings a lot of energy and enthusiasm, which is a strength. We&apos;re practicing strategies to help her channel that energy into focus, and she&apos;s already making progress.&quot;</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-amber-900">Scenario 3 – Being Proactive</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-amber-800 mb-2">Parent Question:</p>
                    <p className="text-amber-700 leading-relaxed">&quot;I don&apos;t hear much about what happens during sessions. How do I know what my child is learning?&quot;</p>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-800 mb-2">Practice Prompt:</p>
                    <p className="text-amber-700 leading-relaxed">What proactive step could you take to strengthen trust and keep parents informed?</p>
                  </div>
                  <div className="bg-amber-100 p-4 rounded-lg">
                    <p className="font-semibold text-amber-800 mb-2">Facilitator Practice Move:</p>
                    <p className="text-amber-700 leading-relaxed italic">&quot;I send short weekly updates with highlights from our sessions and tips for supporting learning at home. I&apos;ll make sure you&apos;re added to that list.&quot;</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-purple-900">Scenario 4 – Practicing Active Listening</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-purple-800 mb-2">Parent Concern:</p>
                    <p className="text-purple-700 leading-relaxed">&quot;My son says he feels left out sometimes. I&apos;m worried he&apos;s not connecting with the group.&quot;</p>
                  </div>
                  <div>
                    <p className="font-semibold text-purple-800 mb-2">Practice Prompt:</p>
                    <p className="text-purple-700 leading-relaxed">How can you show empathy, listen deeply, and clarify without jumping to defend?</p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-lg">
                    <p className="font-semibold text-purple-800 mb-2">Facilitator Practice Move:</p>
                    <p className="text-purple-700 leading-relaxed italic">&quot;I hear your concern, and I want to understand more. Can you share what he&apos;s described to you? Together we can think of ways to help him feel more included.&quot;</p>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-indigo-900">Scenario 5 – Inviting Collaboration</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-indigo-800 mb-2">Parent Question:</p>
                    <p className="text-indigo-700 leading-relaxed">&quot;What can I do at home to support what you&apos;re teaching here?&quot;</p>
                  </div>
                  <div>
                    <p className="font-semibold text-indigo-800 mb-2">Practice Prompt:</p>
                    <p className="text-indigo-700 leading-relaxed">How would you encourage partnership and invite their ideas?</p>
                  </div>
                  <div className="bg-indigo-100 p-4 rounded-lg">
                    <p className="font-semibold text-indigo-800 mb-2">Facilitator Practice Move:</p>
                    <p className="text-indigo-700 leading-relaxed italic">&quot;That&apos;s wonderful to hear. What strategies have worked well for you at home so far? We can build on those together to support his growth here.&quot;</p>
                  </div>
                </div>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-rose-900">Scenario 6 – Maintaining Professional Boundaries</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-rose-800 mb-2">Parent Concern:</p>
                    <p className="text-rose-700 leading-relaxed">&quot;I really want to know more about what other kids are struggling with—just so I understand the group better.&quot;</p>
                  </div>
                  <div>
                    <p className="font-semibold text-rose-800 mb-2">Practice Prompt:</p>
                    <p className="text-rose-700 leading-relaxed">How do you balance warmth with boundaries while keeping the focus on their child?</p>
                  </div>
                  <div className="bg-rose-100 p-4 rounded-lg">
                    <p className="font-semibold text-rose-800 mb-2">Facilitator Practice Move:</p>
                    <p className="text-rose-700 leading-relaxed italic">&quot;I can&apos;t share details about other participants to protect their privacy. What I can do is share overall themes we&apos;re working on and specific ways your child is engaging and growing.&quot;</p>
                  </div>
                </div>
              </div>
            </div>
          ) : lesson.id === 'strengthen-family-partnership' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                Complex conversations with parents and caregivers require both honesty and compassion. These strategies help facilitators maintain transparency while protecting emotional safety and family trust.
              </p>

              <div className="bg-gradient-to-br from-pink-50 to-violet-50 border border-pink-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-pink-900">Key Strategies:</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-pink-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-pink-800">Active Listening & Validation</strong> <span className="text-pink-700">– Hear concerns fully, acknowledge emotions, and validate experiences to build rapport.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-pink-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-pink-800">Manage Emotional Responses</strong> <span className="text-pink-700">– Stay calm and grounded, modeling patience and emotional regulation.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-pink-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-pink-800">Set Boundaries with Compassion</strong> <span className="text-pink-700">– Clarify your role and limits respectfully, while keeping focus on the child&apos;s support.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-pink-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-pink-800">Provide Transparent Information</strong> <span className="text-pink-700">– Share updates clearly and honestly, avoiding jargon and being sensitive to emotions.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-pink-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-pink-800">Follow Up & Offer Support</strong> <span className="text-pink-700">– Reconnect after difficult conversations to show ongoing care and reinforce trust.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-slate-900">Why it Matters:</h3>
                <p className="text-slate-700 leading-relaxed">
                  Using these strategies, facilitators can turn hard conversations into opportunities to strengthen relationships with families, demonstrating empathy, professionalism, and partnership.
                </p>
              </div>
            </div>
          ) : lesson.id === 'build-listening-strategies' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                As a facilitator, how you listen often matters more than what you say. Listening is more than eye contact or nodding—it&apos;s about creating a space where participants feel safe, valued, and understood. When you listen deeply, you build trust and open the door to authentic connection and growth.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-amber-900">Core Strategies for Effective Listening</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-600 mt-2.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-amber-800 mb-1">Hold Space with Silence</p>
                      <p className="text-amber-700 leading-relaxed">Use intentional pauses to give participants time to gather thoughts. Silence communicates patience and respect.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-600 mt-2.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-amber-800 mb-1">Listen with Your Body</p>
                      <p className="text-amber-700 leading-relaxed">Keep an open posture, warm expression, and steady eye contact. Nonverbal signals often say more than words.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-600 mt-2.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-amber-800 mb-1">Use Gentle Echoes & Invitations</p>
                      <p className="text-amber-700 leading-relaxed">Reflect back feelings or key words (&quot;Sounds like that was hard for you…&quot;) and ask questions that invite reflection instead of rushing to solve.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-900">Ways to Show You&apos;re Listening</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-blue-800 mb-1">Brief Prompts</p>
                      <p className="text-blue-700 leading-relaxed">Small cues like &quot;Mm-hmm&quot; or &quot;And then?&quot; encourage youth to keep sharing.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-blue-800 mb-1">Summarize & Paraphrase</p>
                      <p className="text-blue-700 leading-relaxed">Restate in your own words to check understanding and show care.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-blue-800 mb-1">Ask Relevant Questions</p>
                      <p className="text-blue-700 leading-relaxed">Clarify details or explore further, demonstrating genuine interest.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-green-900">Why it Matters</h3>
                <p className="text-green-800 leading-relaxed">
                  Effective listening transforms facilitation. It shows youth they are seen and respected, creates emotional safety, and strengthens trust—laying the foundation for meaningful engagement and growth.
                </p>
              </div>
            </div>
          ) : lesson.id === 'practice-listening-strategies' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                Practice your listening skills by matching each scenario to the appropriate listening strategy. This interactive exercise will help you recognize effective listening techniques in action.
              </p>
              
              <ListeningMatchingActivity />
            </div>
          ) : lesson.id === 'strengthen-listening-strategies' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                This activity helps you connect real facilitation scenarios with the listening strategies you&apos;ve just learned. By practicing how to match facilitator responses to the right approach, you&apos;ll see how small choices—like waiting in silence, reflecting back feelings, or using open body language—make a big difference in building trust and safety.
              </p>

              <div className="bg-violet-50 border border-violet-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-violet-900">The Goal: Recognition and Response</h3>
                <p className="text-violet-800 leading-relaxed">
                  The goal is to strengthen your ability to recognize which strategy fits which moment so that, in real sessions, you can respond with clarity, empathy, and confidence.
                </p>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-teal-900">From Practice to Real Sessions</h3>
                <div className="space-y-4 text-teal-800">
                  <p className="leading-relaxed">
                    Effective listening becomes natural through intentional practice. Each time you pause before responding, choose to reflect back what you heard, or create space with silence, you&apos;re building the foundation for deeper connections with participants.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-teal-600 mt-2.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-teal-800 mb-1">In the Moment</p>
                        <p className="text-teal-700 leading-relaxed">Trust your instincts—if someone seems hesitant, try silence. If they&apos;re sharing something emotional, reflect back what you hear.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-teal-600 mt-2.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-teal-800 mb-1">Building Confidence</p>
                        <p className="text-teal-700 leading-relaxed">Each successful listening interaction builds your confidence and the trust participants have in you as their facilitator.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-teal-600 mt-2.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-teal-800 mb-1">Creating Safety</p>
                        <p className="text-teal-700 leading-relaxed">When participants feel truly heard, they&apos;re more likely to share authentically and engage deeply with the learning process.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : lesson.id === 'build-open-ended-questions' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                As a facilitator, the questions you ask shape the depth of conversation.
              </p>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-orange-900">Closed-Ended Questions</h3>
                <div className="space-y-3 text-orange-800">
                  <p className="leading-relaxed">
                    Can be answered with a simple &quot;yes&quot; or &quot;no,&quot; or a short fact. They are useful for quick checks, clarifying details, or confirming understanding.
                  </p>
                  <div className="bg-orange-100 border border-orange-300 rounded-lg p-4">
                    <p className="font-semibold text-orange-900 mb-2">Example:</p>
                    <p className="text-orange-800 italic">&quot;Did you bring your journal today?&quot;</p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-emerald-900">Open-Ended Questions</h3>
                <div className="space-y-3 text-emerald-800">
                  <p className="leading-relaxed">
                    Invite reflection, dialogue, and exploration. They usually start with what, how, or why and encourage participants to share more of their thoughts, feelings, or experiences.
                  </p>
                  <div className="bg-emerald-100 border border-emerald-300 rounded-lg p-4">
                    <p className="font-semibold text-emerald-900 mb-2">Example:</p>
                    <p className="text-emerald-800 italic">&quot;What part of today&apos;s activity felt most meaningful to you?&quot;</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-purple-900">Why it Matters</h3>
                <p className="text-purple-800 leading-relaxed">
                  Closed questions are helpful for structure, but relying on them too much can limit discussion. Open questions create space for youth to think more deeply, share openly, and build connection. Effective facilitators use a balance—knowing when to keep it simple and when to invite deeper reflection.
                </p>
              </div>
            </div>
          ) : lesson.id === 'practice-open-ended-questions' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                Practice transforming closed-ended questions into open-ended ones. This activity will help you develop the skill of creating questions that invite deeper reflection and meaningful conversation with participants.
              </p>
              
              <QuestionRewritingActivity />
            </div>
          ) : lesson.id === 'strengthen-open-ended-questions' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                As a facilitator, the kinds of questions you ask shape the depth and quality of conversation.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-orange-900">Closed Questions</h3>
                  <p className="text-orange-800 leading-relaxed mb-4">
                    Are answered with short responses—often &quot;yes&quot; or &quot;no.&quot; They&apos;re helpful when you need clarity, to wrap up a discussion, or to keep focus tight.
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-emerald-900">Open Questions</h3>
                  <p className="text-emerald-800 leading-relaxed mb-4">
                    Invite reflection, story-sharing, and dialogue. They usually begin with how, what, why, or describe, and they help participants feel engaged and valued.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-900">When to Use Each:</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-blue-800 mb-2">Closed Questions:</p>
                    <p className="text-blue-700 leading-relaxed">End or summarize a conversation, get straightforward answers, or narrow choices.</p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-800 mb-2">Open Questions:</p>
                    <p className="text-blue-700 leading-relaxed">Encourage participation, foster deeper understanding, and build community through shared reflection.</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-purple-900">Why it Matters:</h3>
                <p className="text-purple-800 leading-relaxed">
                  Closed questions give structure, while open questions create space for discovery. Strong facilitators know when to use each type—and how to balance them—to keep discussions clear, inclusive, and meaningful.
                </p>
              </div>
            </div>
          ) : lesson.id === 'practice-group-dynamics' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                Practice responding to common group dynamics challenges. Each scenario presents a real facilitation situation where you&apos;ll need to think quickly and respond with intention.
              </p>
              
              <GroupDynamicsPracticeActivity />
            </div>
          ) : lesson.id === 'build-group-dynamics' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                Every group is its own ecosystem, shaped by the personalities, moods, and relationships of its members. Even if the activities and structures are the same, no two groups will feel alike. As a facilitator, recognizing these dynamics early is key to creating an environment where all participants feel valued and heard.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-amber-900">Common Group Dynamics You May Encounter:</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-amber-800">The Dominator</strong> <span className="text-amber-700">– A few individuals take over discussion and overshadow quieter voices.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-amber-800">The Observer</strong> <span className="text-amber-700">– Someone stays silent, hesitant, or disengaged.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-amber-800">The Side Talkers</strong> <span className="text-amber-700">– Private conversations distract from the main discussion.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-amber-800">The Distractor</strong> <span className="text-amber-700">– Humor or disruptive behavior derails focus.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-amber-800">The Tense Energy</strong> <span className="text-amber-700">– Unspoken conflict or low energy weighs down the group.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-emerald-900">Strategies for Addressing Patterns:</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-emerald-800 mb-2">Dominant Voices –</p>
                    <p className="text-emerald-700 leading-relaxed">Invite them to step back and create space. Use structured turn-taking so everyone has a chance to contribute.</p>
                  </div>
                  <div>
                    <p className="font-medium text-emerald-800 mb-2">Quiet Observers –</p>
                    <p className="text-emerald-700 leading-relaxed">Gently encourage input with open-ended questions, or use smaller groups to increase comfort.</p>
                  </div>
                  <div>
                    <p className="font-medium text-emerald-800 mb-2">Side Conversations –</p>
                    <p className="text-emerald-700 leading-relaxed">Acknowledge the discussion, integrate relevant points into the main dialogue, and reset group focus.</p>
                  </div>
                  <div>
                    <p className="font-medium text-emerald-800 mb-2">Distractors & Tension –</p>
                    <p className="text-emerald-700 leading-relaxed">Name what&apos;s happening, re-establish expectations, and guide the group back toward respect and connection.</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-blue-900">Why it Matters:</h3>
                <p className="text-blue-800 leading-relaxed">
                  By noticing these dynamics and responding with intention, facilitators help balance participation, prevent exclusion, and foster mutual respect. A group that feels heard and supported is more likely to stay engaged, collaborate well, and grow together.
                </p>
              </div>
            </div>
          ) : lesson.id === 'strengthen-group-dynamics' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                Managing group dynamics isn&apos;t only about handling disruptions in the moment. Strong facilitators prepare with intention, read the energy of the room, and make thoughtful adjustments to keep participants engaged and emotionally safe.
              </p>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-purple-900">Key Takeaways:</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">Responsive vs. Reactive</h4>
                    <p className="text-purple-700 leading-relaxed">
                      Effective facilitators respond with awareness and intention rather than reacting from stress or habit. Responsiveness builds trust and models emotional regulation, while reactivity can unintentionally shut down connection.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">Self-Reflection Matters</h4>
                    <p className="text-purple-700 leading-relaxed mb-3">
                      After each session, reflect on:
                    </p>
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500 mt-2.5 flex-shrink-0"></span>
                        <span className="text-purple-700">Where you felt calm and connected</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500 mt-2.5 flex-shrink-0"></span>
                        <span className="text-purple-700">Where you felt stressed or reactive</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500 mt-2.5 flex-shrink-0"></span>
                        <span className="text-purple-700">What small shifts you can make to be more responsive next time</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">Proactive Leadership</h4>
                    <p className="text-purple-700 leading-relaxed">
                      By practicing presence, flexibility, and care, facilitators model the trust, safety, and emotional intelligence they want participants to practice.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-teal-900">Why it Matters:</h3>
                <p className="text-teal-800 leading-relaxed">
                  You won&apos;t get it perfect every time—but your ability to pause, pivot, and guide with intention is what creates space for real growth. Strong facilitation is less about fixing problems, and more about fostering flow, safety, and trust.
                </p>
              </div>
            </div>
          ) : lesson.id === 'build-trust' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                Trust is the foundation of every strong facilitation space. Young learners thrive when they feel safe, respected, and valued. Facilitators build this trust by modeling consistency, care, and respect in every interaction.
              </p>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-emerald-900">Core Practices that Build Trust:</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-emerald-800 mb-2">Consistency</h4>
                    <p className="text-emerald-700 leading-relaxed">
                      Be reliable: show up on time, keep your word, and follow session structure. Predictability creates safety.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-emerald-800 mb-2">Careful Communication</h4>
                    <p className="text-emerald-700 leading-relaxed">
                      Speak with warmth and clarity. Recognize effort as much as achievement, and validate feelings even when you can&apos;t solve the problem.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-emerald-800 mb-2">Confidentiality & Respect</h4>
                    <p className="text-emerald-700 leading-relaxed">
                      Honor privacy by keeping what&apos;s shared in the circle safe (unless safety is at risk). Reinforce agreements about respect and confidentiality.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-blue-900">Why it Matters:</h3>
                <p className="text-blue-800 leading-relaxed">
                  When trust is present, participants feel free to take risks, share openly, and engage deeply in learning. Facilitators who practice inclusion, bias awareness, and empathy create spaces where every learner feels seen and empowered.
                </p>
              </div>
            </div>
          ) : lesson.id === 'practice-trust' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed mb-4">
                3–5 simple moves to build trust every session
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-green-600 text-xl mt-1">✅</div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-900 mb-2">Show Up Consistently</h3>
                      <ul className="space-y-1 text-green-800">
                        <li>• Arrive on time, prepared, and ready to lead.</li>
                        <li>• Keep your word—do what you said you would.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-green-600 text-xl mt-1">✅</div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-900 mb-2">Create Predictability</h3>
                      <ul className="space-y-1 text-green-800">
                        <li>• Follow the agreed structure so youth know what to expect.</li>
                        <li>• Signal transitions clearly to reduce uncertainty.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-green-600 text-xl mt-1">✅</div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-900 mb-2">Communicate with Care</h3>
                      <ul className="space-y-1 text-green-800">
                        <li>• Use warmth in your tone and clarity in your words.</li>
                        <li>• Acknowledge effort as much as achievement.</li>
                        <li>• Listen deeply and validate feelings.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-green-600 text-xl mt-1">✅</div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-900 mb-2">Protect Safety & Confidentiality</h3>
                      <ul className="space-y-1 text-green-800">
                        <li>• Remind the group of the privacy agreement.</li>
                        <li>• Step in gently if respect is broken.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-green-600 text-xl mt-1">✅</div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-900 mb-2">Scan for Inclusion</h3>
                      <ul className="space-y-1 text-green-800">
                        <li>• Notice who&apos;s quiet, withdrawn, or left out.</li>
                        <li>• Intentionally invite them back into the circle.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                  <div className="mb-4">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-2">Scenario 1 – Consistency</h4>
                        <p className="text-slate-700 leading-relaxed mb-3">
                          <span className="font-medium">Situation:</span> The group is waiting to begin, but the facilitator arrives late and frazzled. Participants look restless.
                        </p>
                        <p className="text-slate-700 leading-relaxed mb-3">
                          <span className="font-medium">Trust Move:</span> Show up prepared and on time. Begin with calm presence: &quot;Thanks for being ready to start. Here&apos;s how we&apos;ll spend our time today.&quot;
                        </p>
                        <p className="text-slate-600 italic leading-relaxed">
                          <span className="font-medium">Why it Works:</span> Reliability creates predictability, and predictability makes youth feel safe.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                  <div className="mb-4">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-2">Scenario 2 – Creating Predictability</h4>
                        <p className="text-slate-700 leading-relaxed mb-3">
                          <span className="font-medium">Situation:</span> Halfway through a session, the facilitator suddenly changes the plan without explanation. The group looks confused.
                        </p>
                        <p className="text-slate-700 leading-relaxed mb-3">
                          <span className="font-medium">Trust Move:</span> When shifting plans, explain the reason: &quot;I know we were going to do journaling next, but the energy feels high—let&apos;s move into the game first, then circle back.&quot;
                        </p>
                        <p className="text-slate-600 italic leading-relaxed">
                          <span className="font-medium">Why it Works:</span> Clear transitions reduce uncertainty and maintain trust in your leadership.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                  <div className="mb-4">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-2">Scenario 3 – Communicating with Care</h4>
                        <p className="text-slate-700 leading-relaxed mb-3">
                          <span className="font-medium">Situation:</span> A participant struggles with an activity and says, &quot;I&apos;m no good at this.&quot;
                        </p>
                        <p className="text-slate-700 leading-relaxed mb-3">
                          <span className="font-medium">Trust Move:</span> &quot;I saw how much effort you put into that. Effort matters here as much as results. Want to try again together?&quot;
                        </p>
                        <p className="text-slate-600 italic leading-relaxed">
                          <span className="font-medium">Why it Works:</span> Acknowledging effort validates the learner and encourages persistence.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                  <div className="mb-4">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-2">Scenario 4 – Protecting Safety & Confidentiality</h4>
                        <p className="text-slate-700 leading-relaxed mb-3">
                          <span className="font-medium">Situation:</span> A participant shares something personal, and another makes a joking comment. The sharer looks hurt.
                        </p>
                        <p className="text-slate-700 leading-relaxed mb-3">
                          <span className="font-medium">Trust Move:</span> Step in gently: &quot;Let&apos;s pause—our agreement is that what&apos;s shared here is respected. Jokes can make people feel unsafe. Let&apos;s recommit to holding this space with care.&quot;
                        </p>
                        <p className="text-slate-600 italic leading-relaxed">
                          <span className="font-medium">Why it Works:</span> Reinforcing confidentiality and respect rebuilds safety for the group.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                  <div className="mb-4">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-2">Scenario 5 – Scanning for Inclusion</h4>
                        <p className="text-slate-700 leading-relaxed mb-3">
                          <span className="font-medium">Situation:</span> During discussion, two participants dominate. A quieter participant hasn&apos;t spoken once.
                        </p>
                        <p className="text-slate-700 leading-relaxed mb-3">
                          <span className="font-medium">Trust Move:</span> &quot;I&apos;d like to hear from someone we haven&apos;t heard from yet—[Name], what&apos;s one thought you&apos;d add?&quot;
                        </p>
                        <p className="text-slate-600 italic leading-relaxed">
                          <span className="font-medium">Why it Works:</span> Intentionally drawing in quiet voices shows that every perspective is valued.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : lesson.id === 'strengthen-trust' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                Trust isn&apos;t built only in reactive moments—it&apos;s something you design for. Strong facilitators shape spaces where trust is the norm, not the exception, by using structure, connection, and repair strategies intentionally. When trust is woven into your design, youth feel safe before they even speak.
              </p>

              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <h3 className="text-lg font-semibold text-blue-900">Predictable Structure, Flexible Flow</h3>
                  </div>
                  <p className="text-blue-800 leading-relaxed mb-4">
                    Youth thrive when they know what to expect. Consistent rituals—like opening check-ins or closing reflections—create rhythm and reliability, while flexibility shows responsiveness.
                  </p>
                  <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                    <p className="font-semibold text-blue-900 mb-2">Example:</p>
                    <p className="text-blue-800 leading-relaxed">
                      Every session starts with a two-minute check-in circle and ends with &quot;one word to take away.&quot; Even if activities change, youth know the anchors are steady.
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <h3 className="text-lg font-semibold text-emerald-900">Relationship Before Task</h3>
                  </div>
                  <p className="text-emerald-800 leading-relaxed mb-4">
                    Content comes second to connection. When youth feel seen as people first, they are more willing to engage in activities and learning.
                  </p>
                  <div className="bg-emerald-100 border border-emerald-300 rounded-lg p-4">
                    <p className="font-semibold text-emerald-900 mb-2">Example:</p>
                    <p className="text-emerald-800 leading-relaxed">
                      Instead of jumping straight into an activity, begin with, &quot;How&apos;s everyone doing today? Let&apos;s go around with one high or low from the week.&quot;
                    </p>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <h3 className="text-lg font-semibold text-purple-900">Normalize Emotion and Repair</h3>
                  </div>
                  <p className="text-purple-800 leading-relaxed mb-4">
                    Trust doesn&apos;t mean there are no disruptions—it means challenges are met with care. By naming feelings, acknowledging missteps, and modeling repair, you teach youth that relationships can withstand bumps.
                  </p>
                  <div className="bg-purple-100 border border-purple-300 rounded-lg p-4">
                    <p className="font-semibold text-purple-900 mb-2">Example:</p>
                    <p className="text-purple-800 leading-relaxed">
                      If a tense moment arises, pause: &quot;I see that felt frustrating. Let&apos;s take a breath together and reset so everyone feels safe.&quot;
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-amber-900">Why it Matters</h3>
                <p className="text-amber-800 leading-relaxed">
                  When facilitators design for trust with intention, youth experience safety, consistency, and belonging—not just occasionally, but every time they step into the space.
                </p>
              </div>
            </div>
          ) : lesson.id === 'build-self-reflection' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                As a facilitator, your mindset shapes the group experience. Self-reflection helps you pause, turn inward, and notice how your thoughts, emotions, and assumptions influence your actions.
              </p>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-indigo-900">Key Concepts:</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-indigo-800">Fundamental Attribution Error</strong> <span className="text-indigo-700">– We often blame behavior on personality instead of considering situational factors. (Ex: A &quot;disrespectful&quot; participant might actually be tired, excluded, or overwhelmed.)</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-indigo-800">What Self-Reflection Is</strong> <span className="text-indigo-700">– The act of examining your inner world—your reactions, triggers, and patterns—so you can respond with intention rather than react automatically.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-indigo-800">Why It Matters</strong> <span className="text-indigo-700">– Self-reflection builds emotional intelligence, helps you regulate your state, and allows you to lead with presence, authenticity, and growth.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-cyan-900">Reflection Angles to Explore:</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2.5 flex-shrink-0"></div>
                    <div className="text-cyan-800">
                      <span className="font-medium">Feeling tense when things go off script</span> → discomfort with unpredictability.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2.5 flex-shrink-0"></div>
                    <div className="text-cyan-800">
                      <span className="font-medium">Feeling flustered without the &quot;right&quot; answer</span> → fear of failure or performance pressure.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2.5 flex-shrink-0"></div>
                    <div className="text-cyan-800">
                      <span className="font-medium">Feeling drained when no one engages</span> → belief you must carry group energy.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2.5 flex-shrink-0"></div>
                    <div className="text-cyan-800">
                      <span className="font-medium">Taking challenges personally</span> → desire for respect or affirmation.
                    </div>
                  </div>
                </div>
                <p className="text-cyan-700 leading-relaxed mt-4 italic">
                  These aren&apos;t flaws—they&apos;re insights. Awareness turns them into tools for growth.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-emerald-900">Companion Practice – Journaling:</h3>
                <p className="text-emerald-800 leading-relaxed">
                  Journaling provides a safe way to track emotions, notice patterns, and uncover insights over time. It doesn&apos;t have to be polished—just honest.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-amber-900">Why it Matters:</h3>
                <p className="text-amber-800 leading-relaxed">
                  Self-awareness is a facilitator&apos;s superpower. When you reflect on your own inner world, you model vulnerability and authenticity, creating a culture where youth feel safe to do the same.
                </p>
              </div>
            </div>
          ) : lesson.id === 'practice-self-reflection' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                Trust and presence as a facilitator start with noticing your own emotions. The Mirror Moments Map is a tool to help you reflect on emotional triggers, uncover what&apos;s beneath them, and reframe your response with intention.
              </p>

              <div className="bg-violet-50 border border-violet-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-violet-900">Why This Matters:</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-violet-500 mt-2.5 flex-shrink-0"></div>
                    <p className="text-violet-800">Every strong feeling (pride, doubt, frustration, tension) is a signal, not a problem.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-violet-500 mt-2.5 flex-shrink-0"></div>
                    <p className="text-violet-800">Emotional reactions often connect to core values—like respect, competence, or connection.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-violet-500 mt-2.5 flex-shrink-0"></div>
                    <p className="text-violet-800">By noticing and decoding these signals, you gain clarity about what matters to you and how you want to lead.</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-900">Using the Mirror Moments Map</h3>
                <p className="text-blue-800 leading-relaxed mb-4">
                  Choose 2–3 moments (recent or imagined) when you felt something strongly during facilitation.
                </p>
                <p className="text-blue-800 leading-relaxed mb-4">For each, fill in:</p>
                <div className="space-y-3 ml-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 flex-shrink-0"></div>
                    <p className="text-blue-800 font-medium">What was I feeling?</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 flex-shrink-0"></div>
                    <p className="text-blue-800 font-medium">What might that be about? (trigger, expectation, value, belief)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 flex-shrink-0"></div>
                    <p className="text-blue-800 font-medium">What do I want to remember next time? (reframe or anchor)</p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-emerald-900">Example:</h3>
                <div className="space-y-3">
                  <p className="text-emerald-800">
                    <span className="font-semibold">Feeling:</span> I felt insecure about the lesson I was teaching.
                  </p>
                  <p className="text-emerald-800">
                    <span className="font-semibold">Underneath:</span> I was afraid I didn&apos;t know what to say. I value being helpful.
                  </p>
                  <p className="text-emerald-800">
                    <span className="font-semibold">Reframe:</span> It&apos;s okay not to have the answer. Listening is enough.
                  </p>
                </div>
                <p className="text-emerald-700 leading-relaxed mt-4 italic">
                  You can do this in writing, voice notes, or even a visual map. The goal is authenticity, not perfection.
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-orange-900">The PAUSE – NOTICE – CHOOSE Model</h3>
                <p className="text-orange-800 leading-relaxed mb-4">
                  Use this mini-practice during real-time facilitation:
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <div>
                      <p className="font-semibold text-orange-900">Pause</p>
                      <p className="text-orange-800">Take a breath to create space.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <div>
                      <p className="font-semibold text-orange-900">Notice</p>
                      <p className="text-orange-800">Name what you&apos;re feeling and any story running through your mind.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <div>
                      <p className="font-semibold text-orange-900">Choose</p>
                      <p className="text-orange-800">Respond in a way that reflects your values, not just your emotions.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-100 border border-orange-300 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-orange-900 mb-3">Example:</h4>
                  <div className="space-y-2">
                    <p className="text-orange-800"><span className="font-semibold">Pause:</span> deep breath.</p>
                    <p className="text-orange-800"><span className="font-semibold">Notice:</span> &quot;I feel flustered and unseen.&quot;</p>
                    <p className="text-orange-800"><span className="font-semibold">Choose:</span> &quot;I&apos;m going to ask a clarifying question instead of reacting defensively.&quot;</p>
                  </div>
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-teal-900">Key Insight:</h3>
                <p className="text-teal-800 leading-relaxed">
                  The Mirror Moments Map turns self-reflection into a practice of presence. By pausing, noticing, and choosing, you transform emotional reactions into intentional responses—modeling the authenticity and resilience you want youth to build.
                </p>
              </div>
            </div>
          ) : lesson.id === 'strengthen-self-reflection' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                Strong facilitation isn&apos;t about avoiding tough moments—it&apos;s about learning how to pause, reflect, and respond with intention when challenges arise. The Pause-Notice-Choose model is a simple framework to help you shift from reacting on autopilot to responding in alignment with your values.
              </p>

              <div className="bg-rose-50 border border-rose-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-rose-900">How It Works:</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <div>
                      <p className="font-semibold text-rose-900">Pause</p>
                      <p className="text-rose-800">Take a breath before reacting.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <div>
                      <p className="font-semibold text-rose-900">Notice</p>
                      <p className="text-rose-800">Identify what you&apos;re feeling and what beliefs or biases might be underneath.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <div>
                      <p className="font-semibold text-rose-900">Choose</p>
                      <p className="text-rose-800">Respond in a way that reflects your values and builds trust.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-indigo-900">Practice Scenarios:</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0"></div>
                    <p className="text-indigo-800">A participant makes a sarcastic comment.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0"></div>
                    <p className="text-indigo-800">A parent arrives late and interrupts.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0"></div>
                    <p className="text-indigo-800">A co-facilitator cuts you off mid-direction.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0"></div>
                    <p className="text-indigo-800">The group is quiet or unresponsive.</p>
                  </div>
                </div>
                <p className="text-indigo-700 leading-relaxed mt-4 italic">
                  Each scenario invites you to map your immediate reaction, uncover the belief behind it, and reframe with a values-aligned response.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-emerald-900">Reflection Journal Starter</h3>
                <p className="text-emerald-800 leading-relaxed mb-4">
                  After each session, use these 3 guiding questions to strengthen your practice:
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <div>
                      <p className="font-semibold text-emerald-900">What went well?</p>
                      <p className="text-emerald-800">Acknowledge successes and strategies that resonated.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <div>
                      <p className="font-semibold text-emerald-900">What challenged me?</p>
                      <p className="text-emerald-800">Identify obstacles or tensions to learn from.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <div>
                      <p className="font-semibold text-emerald-900">What do I want to explore?</p>
                      <p className="text-emerald-800">Set intentions for growth and experimentation.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-amber-900">Why it Matters:</h3>
                <p className="text-amber-800 leading-relaxed">
                  By practicing reflection-in-action and building your own debrief routine, you train yourself to stay grounded, flexible, and authentic—qualities that make facilitation safe, trustworthy, and growth-focused for youth.
                </p>
              </div>
            </div>
          ) : lesson.id === 'build-bias-awareness' ? (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-slate-900">What Is Bias?</h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Bias is a preference—positive or negative—that influences how we see and respond to others. It can be:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-slate-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-slate-800">Explicit</strong> <span className="text-slate-700">– conscious preferences or opinions.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-slate-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-slate-800">Implicit</strong> <span className="text-slate-700">– unconscious attitudes that shape our decisions without us realizing it.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-red-900">Why It Matters in Facilitation:</h3>
                <p className="text-red-800 leading-relaxed">
                  Bias affects who we give attention to, how we interpret behaviors, and whose voices we prioritize. Left unchecked, it can quietly shape group dynamics in ways that exclude or discourage participants.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-yellow-900">Common Types of Bias to Notice:</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-yellow-800">Confirmation Bias</strong> <span className="text-yellow-700">– Seeing only what proves what we already believe.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-yellow-800">Affinity Bias</strong> <span className="text-yellow-700">– Favoring those who feel more like us.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2.5 flex-shrink-0"></div>
                    <div>
                      <strong className="text-yellow-800">Attribution Bias</strong> <span className="text-yellow-700">– Assuming behaviors reflect character, not circumstances.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-green-900">Key Insight:</h3>
                <p className="text-green-800 leading-relaxed">
                  Bias doesn&apos;t mean you&apos;re a &quot;bad facilitator.&quot; It means you&apos;re human. By becoming aware of biases and reflecting honestly, you create fairer, more inclusive spaces where all participants feel seen and valued.
                </p>
              </div>
            </div>
          ) : lesson.id === 'practice-bias-awareness' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                Interrupting bias isn&apos;t about shaming yourself—it&apos;s about noticing and redirecting with intention so facilitation stays fair and inclusive.
              </p>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-purple-900">4 Steps to Interrupt Bias:</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <div>
                      <p className="font-semibold text-purple-900">Pause Before Responding</p>
                      <p className="text-purple-800">Slow down to check your gut reaction and choose a thoughtful response.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <div>
                      <p className="font-semibold text-purple-900">Choose Equity Over Ease</p>
                      <p className="text-purple-800">Intentionally invite quieter voices, even if it takes more effort.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <div>
                      <p className="font-semibold text-purple-900">Ask Reflective Questions</p>
                      <p className="text-purple-800">Use prompts like &quot;Whose voice isn&apos;t here yet?&quot; to widen inclusion.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    <div>
                      <p className="font-semibold text-purple-900">Repair When Needed</p>
                      <p className="text-purple-800">Acknowledge missteps honestly: &quot;Thanks for pointing that out—I&apos;ll do better next time.&quot;</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-teal-900">Why it Matters:</h3>
                <p className="text-teal-800 leading-relaxed">
                  Bias shows up in subtle ways, but with awareness and intentional action, facilitators can create safer, more equitable spaces where every participant feels valued.
                </p>
              </div>

              <BiasInterruptionActivity />
            </div>
          ) : lesson.id === 'strengthen-bias-awareness' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                Awareness of bias is only the first step—real growth comes from building habits that make equity and inclusion part of your facilitation every day.
              </p>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-indigo-900">Four Practical Tools:</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <div>
                      <h4 className="font-semibold text-indigo-900 mb-2">Equity Pause (Pre-Session)</h4>
                      <p className="text-indigo-800 leading-relaxed">
                        Before each session, reflect: Who speaks first? Who stays quiet? What can I do to balance voices and create a more inclusive space?
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <div>
                      <h4 className="font-semibold text-indigo-900 mb-2">Post-Session Debrief</h4>
                      <p className="text-indigo-800 leading-relaxed">
                        After sessions, reflect or journal: Whose voices were amplified? Who didn&apos;t get airtime? What patterns repeated? These questions reveal where equity can grow.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <div>
                      <h4 className="font-semibold text-indigo-900 mb-2">Inclusive Planning</h4>
                      <p className="text-indigo-800 leading-relaxed">
                        Design activities for different participation styles (discussion, writing, movement, art, tech). Offering choice empowers youth to contribute in ways that feel authentic.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    <div>
                      <h4 className="font-semibold text-indigo-900 mb-2">Inclusion Micro-Audit</h4>
                      <p className="text-indigo-800 leading-relaxed">
                        Use a quick self-check (Always / Sometimes / Not Yet) to assess how you center or exclude voices, vary participation methods, notice interruptions, and check assumptions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-emerald-900">Why It Matters:</h3>
                <p className="text-emerald-800 leading-relaxed">
                  By consistently practicing these habits, facilitators move beyond good intentions into intentional, equitable action—making inclusion part of the design, not an afterthought.
                </p>
              </div>
            </div>
          ) : lesson.id === 'build-inclusion-scanning' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                Inclusion scanning means intentionally observing your group to ensure every participant is being seen, heard, and valued. It&apos;s about noticing who&apos;s included—and who might be left out.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-900">What to Look For:</h3>
                <ul className="space-y-3 text-blue-800">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                    <span>Who speaks often? Who hasn&apos;t spoken at all?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                    <span>Who shows engagement through eye contact, nodding, or posture—and who looks withdrawn or distracted?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                    <span>Who&apos;s consistently chosen for leadership or public praise?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                    <span>Are participants responding to each other, or only to you?</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-amber-900">Why It Matters:</h3>
                <p className="text-amber-800 leading-relaxed mb-4">
                  These observations reveal hidden dynamics like disengagement, discomfort, or marginalization. Assumptions can be misleading—for example, doodling might look like disinterest, but it could be a focus strategy.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-green-900">Inclusive Next Steps:</h3>
                <ul className="space-y-3 text-green-800">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                    <span>Vary participation methods (pair-shares, quick writes, reflective activities) to engage different learners.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                    <span>Check in with quiet or withdrawn participants privately, with care.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                    <span>Reframe assumptions: engagement looks different for everyone.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-indigo-900">Key Insight:</h3>
                <p className="text-indigo-800 leading-relaxed">
                  Noticing is the first step. By scanning intentionally, you interrupt exclusion before it takes root and create a space where all youth feel seen.
                </p>
              </div>
            </div>
          ) : lesson.id === 'practice-inclusion-scanning' ? (
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                Noticing is the first step; acting in the moment is what makes inclusion real. As a facilitator, you can shift group energy and balance participation through small but intentional moves.
              </p>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-purple-900">Go-To Real-Time Responses:</h3>
                <ul className="space-y-3 text-purple-800">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                    <div>
                      <strong>Open the Circle</strong> – Invite unheard voices: &quot;I&apos;d love to hear from someone we haven&apos;t heard yet.&quot; Pair-shares or small groups can create safety for quieter participants.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                    <div>
                      <strong>Switch the Mode</strong> – If energy dips, change the format (movement, drawing, writing) to invite new forms of expression.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                    <div>
                      <strong>Check Your Cues</strong> – Reflect on your own attention and praise. Redistribute roles and acknowledgment to ensure fairness.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-teal-900">Practical Strategies in Action:</h3>
                <ul className="space-y-3 text-teal-800">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-teal-500 rounded-full mt-2"></span>
                    <div>
                      <strong>Identify Imbalances</strong> – Notice who dominates, who tries but struggles, and who stays silent.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-teal-500 rounded-full mt-2"></span>
                    <div>
                      <strong>Use Round-Robin Formats</strong> – Pause and give each participant a structured chance to share.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-teal-500 rounded-full mt-2"></span>
                    <div>
                      <strong>Encourage Reflection & Feedback</strong> – Ask, &quot;Did everyone feel they had a chance to contribute?&quot; to improve future sessions.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-teal-500 rounded-full mt-2"></span>
                    <div>
                      <strong>Adapt Future Sessions</strong> – Use feedback to plan ground rules, smaller groups, or digital tools that help balance voices.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-rose-900">Why it Matters:</h3>
                <p className="text-rose-800 leading-relaxed">
                  Inclusion isn&apos;t automatic—it takes ongoing attentiveness and adaptation. By noticing imbalances and responding in real time, facilitators create spaces where all voices are welcomed, valued, and heard.
                </p>
              </div>
            </div>
          ) : lesson.id === 'strengthen-inclusion-scanning' ? (
            <InclusionScanningActivity />
          ) : lesson.id === 'integration-reflection' ? (
            <div className="space-y-8">
              <p className="text-slate-700 leading-relaxed text-lg">
                Over 18 phases, you&apos;ve built, practiced, and strengthened the core competencies of effective facilitation. Each phase layered new skills, moving from awareness to practice to mastery.
              </p>

              <div className="grid gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-blue-900">Leadership</h3>
                  <p className="text-blue-800 leading-relaxed">
                    You learned how to give constructive feedback, foster autonomy, and guide real-time decision-making. Practicing these skills built your confidence, while strengthening techniques like goal-setting and reading group cues prepared you to adapt with responsiveness.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-green-900">Communication</h3>
                  <p className="text-green-800 leading-relaxed">
                    You built foundations in clear messaging, non-verbal awareness, and caregiver engagement. Through practice, you refined body language interpretation and role-played challenging conversations. By strengthening advanced skills, you learned to navigate sensitive dynamics with empathy and professionalism.
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-purple-900">Effective Listening</h3>
                  <p className="text-purple-800 leading-relaxed">
                    You practiced listening for understanding, using open-ended questions, and paraphrasing input to ensure clarity. Strengthening empathy helped you respond with compassion and create safe spaces for deeper dialogue.
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-amber-900">Relationship Building</h3>
                  <p className="text-amber-800 leading-relaxed">
                    You explored group dynamics and trust-building, practiced strategies through observation and role-play, and strengthened connections by repairing tensions and fostering psychological safety.
                  </p>
                </div>

                <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-teal-900">Self-Reflection</h3>
                  <p className="text-teal-800 leading-relaxed">
                    You built awareness of your inner reactions, practiced regulation strategies, and strengthened authenticity by aligning facilitation with your core values. Reflection helped you model emotional intelligence for youth.
                  </p>
                </div>

                <div className="bg-rose-50 border border-rose-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-rose-900">Equity & Inclusion</h3>
                  <p className="text-rose-800 leading-relaxed">
                    You examined bias, practiced inclusion through session scanning and adaptive formats, and strengthened your intentionality by elevating marginalized voices and designing for belonging.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-indigo-900">Final Insight:</h3>
                <p className="text-indigo-800 leading-relaxed text-lg">
                  Facilitation is both a skill and a presence. By combining structure with empathy, clarity with flexibility, and awareness with intentional action, you&apos;ve developed the tools to create spaces where youth feel safe, valued, and empowered to grow.
                </p>
              </div>
            </div>
          ) : lesson.id === 'syllabus-overview' ? (
            <div className="space-y-8">
              <p className="text-slate-700 leading-relaxed text-lg">
                The Elevate Adolescence Program (EAP) Facilitator Training is designed to prepare new facilitators with the skills, mindset, and confidence to lead youth programming with impact.
              </p>

              <div className="grid gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-blue-900">Course Format</h3>
                  <ul className="space-y-2 text-blue-800">
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                      <span>Hosted on the EAP Learning Management System (TalentLMS).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                      <span>Must be completed within 90 days of registration.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                      <span>Includes six core competency modules plus a final assessment.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-green-900">Completion Requirements</h3>
                  <ul className="space-y-2 text-green-800">
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                      <span>Work through all lessons and activities in each module.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                      <span>Submit self-reflection and practice exercises where assigned.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                      <span>Pass the final assessment with a minimum score of 80%.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-purple-900">Grading & Evaluation</h3>
                  <ul className="space-y-2 text-purple-800">
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                      <span>Progress is tracked by completion of modules and assessment scores.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                      <span>The program uses a percentage grading system tied to your final assessment.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-amber-900">Access & Support</h3>
                  <ul className="space-y-2 text-amber-800">
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-2 h-2 bg-amber-500 rounded-full mt-2"></span>
                      <span>Login credentials are provided upon registration.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-2 h-2 bg-amber-500 rounded-full mt-2"></span>
                      <span>Learners are expected to work independently but may request support from EAP staff as needed.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-teal-900">Course Objectives</h3>
                <p className="text-teal-800 mb-3">By the end of this training, facilitators will be able to:</p>
                <ul className="space-y-2 text-teal-800">
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-2 h-2 bg-teal-500 rounded-full mt-2"></span>
                    <span>Lead with clarity, empathy, and adaptability.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-2 h-2 bg-teal-500 rounded-full mt-2"></span>
                    <span>Provide constructive feedback that fosters growth.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-2 h-2 bg-teal-500 rounded-full mt-2"></span>
                    <span>Build safe, inclusive, and trusting group environments.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-2 h-2 bg-teal-500 rounded-full mt-2"></span>
                    <span>Strengthen communication skills with youth and caregivers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-2 h-2 bg-teal-500 rounded-full mt-2"></span>
                    <span>Model emotional regulation and reflective practice.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-2 h-2 bg-teal-500 rounded-full mt-2"></span>
                    <span>Recognize and interrupt bias to create equitable spaces.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-rose-900">Core Modules</h3>
                <div className="grid gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <div>
                      <span className="font-medium text-rose-900">Leadership</span>
                      <span className="text-rose-800"> – Guiding with integrity, feedback, autonomy, and decision-making.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <div>
                      <span className="font-medium text-rose-900">Communication</span>
                      <span className="text-rose-800"> – Clear verbal/non-verbal strategies, caregiver engagement.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <div>
                      <span className="font-medium text-rose-900">Effective Listening</span>
                      <span className="text-rose-800"> – Active listening, empathy, and trust-building.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    <div>
                      <span className="font-medium text-rose-900">Relationship Building</span>
                      <span className="text-rose-800"> – Group dynamics, trust, and repair.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                    <div>
                      <span className="font-medium text-rose-900">Self-Reflection</span>
                      <span className="text-rose-800"> – Emotional regulation, triggers, and values alignment.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center text-sm font-bold">6</span>
                    <div>
                      <span className="font-medium text-rose-900">Equity & Inclusion</span>
                      <span className="text-rose-800"> – Bias awareness, scanning, and intentional design.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-indigo-900">Final Assessment</h3>
                <ul className="space-y-2 text-indigo-800">
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-2 h-2 bg-indigo-500 rounded-full mt-2"></span>
                    <span>Covers all six competencies.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-2 h-2 bg-indigo-500 rounded-full mt-2"></span>
                    <span><strong>Passing score: 80% required for certification</strong> as an EAP facilitator.</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-slate-700 leading-relaxed">
              Content for this section will be provided. This is a placeholder for now.
            </p>
          )}
          
          {/* Your Notes for Section 5 */}
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-4">Your Notes</h3>
            <div className="bg-slate-50 bg-opacity-90 p-4 border border-slate-200 rounded-lg">
              <textarea
                value={noteContent}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder="Notes for this skill..."
                className="w-full min-h-[120px] p-4 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                style={{ fontFamily: 'ui-monospace, SFMono-Regular, Monaco, Consolas, monospace' }}
              />
            </div>
          </div>
        </div>
        <hr className="mb-8 border-slate-200" />

        {/* Resources - Only show on Strengthen lessons */}
        {lesson.resources.length > 0 && lesson.id.includes('strengthen') && (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Resources</h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {lesson.resources.map((resource, index) => (
                  <ProtectedPDFLink
                    key={index}
                    href={resource.href}
                    className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all duration-200"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg">
                      <span className="text-2xl">
                        {getResourceIcon(resource.category)}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900">
                        {resource.label}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {resource.category || resource.type.toUpperCase()}
                      </p>
                    </div>
                    
                    <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </ProtectedPDFLink>
                ))}
              </div>
            </div>
            <hr className="mb-8 border-slate-200" />
          </>
        )}

        {/* Final Thoughts - for all lessons */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Final Thoughts</h2>
          
          {/* Your Notes for Final Thoughts */}
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-4">Your Notes</h3>
            <div className="bg-slate-50 bg-opacity-90 p-4 border border-slate-200 rounded-lg">
              <textarea
                value={noteContent}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder="Notes for this skill..."
                className="w-full min-h-[120px] p-4 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                style={{ fontFamily: 'ui-monospace, SFMono-Regular, Monaco, Consolas, monospace' }}
              />
            </div>
          </div>
        </div>
        <hr className="mb-8 border-slate-200" />

        {/* Lesson Completion */}
        <div className="mb-8">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <input
              type="checkbox"
              id="lesson-complete"
              checked={isCompleted}
              onChange={handleCompletionToggle}
              className="w-5 h-5 text-green-600 rounded"
            />
            <label htmlFor="lesson-complete" className="text-sm font-medium cursor-pointer text-green-800">
              Mark lesson as complete
            </label>
            {isCompleted && (
              <span className="ml-auto text-sm text-green-600 font-medium">
                ✓ Completed
              </span>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => router.push(`/sections/${section.id}`)}
            >
              ← Back to {section.title}
            </Button>
            
            {nextLesson && (
              <Button
                onClick={() => router.push(`/sections/${section.id}/${nextLesson.id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next Lesson →
              </Button>
            )}
          </div>
        </div>
      </div>
    </PagePaper>
  );
}