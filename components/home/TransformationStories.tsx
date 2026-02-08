'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import { CheckCircle, Clock, Users, Star } from 'lucide-react';

interface Story {
  _id: string;
  name: string;
  role: string;
  image: string;
  messages: {
    text: string;
    sender: 'user' | 'institute';
    time: string;
  }[];
  rating: number;
}

const stories: Story[] = [
  {
    _id: '1',
    name: 'Priya Sharma',
    role: 'Software Engineer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    messages: [
      { sender: 'institute', text: 'Hi Priya! How has your meditation journey been? 🧘‍♀️', time: '10:30 AM' },
      { sender: 'user', text: 'It\'s been absolutely life-changing! I used to have such bad anxiety attacks before every presentation at work.', time: '10:31 AM' },
      { sender: 'institute', text: 'We remember those days. How are things now? 😊', time: '10:32 AM' },
      { sender: 'user', text: 'Now I actually look forward to them! The breathing techniques you taught me help me stay calm and focused. My team even noticed the difference! 🙏', time: '10:33 AM' },
      { sender: 'institute', text: 'That\'s wonderful to hear! Your dedication to the 40-day practice really shows. ✨', time: '10:34 AM' },
      { sender: 'user', text: 'Thank you so much! I\'ve recommended the program to all my friends too. This is the best investment I\'ve made in myself! 💙', time: '10:35 AM' }
    ],
    rating: 5
  },
  {
    _id: '2',
    name: 'Rahul Verma',
    role: 'Business Owner',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    messages: [
      { sender: 'institute', text: 'Hello Rahul! How\'s the business going after completing the program? 📈', time: '2:15 PM' },
      { sender: 'user', text: 'You won\'t believe it - my business grew 40% in just 3 months! 😲', time: '2:16 PM' },
      { sender: 'institute', text: 'Wow! That\'s incredible! What do you think made the difference?', time: '2:17 PM' },
      { sender: 'user', text: 'The meditation practice helped me make clearer decisions. I\'m not constantly stressed anymore. My team says I\'m a better leader now too. 🎯', time: '2:18 PM' },
      { sender: 'user', text: 'The morning routine you suggested is pure gold. I start every day with 20 minutes of meditation now.', time: '2:19 PM' },
      { sender: 'institute', text: 'That\'s amazing growth, Rahul! So proud of your journey! 🌟', time: '2:20 PM' }
    ],
    rating: 5
  },
  {
    _id: '3',
    name: 'Ananya Patel',
    role: 'Medical Student',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    messages: [
      { sender: 'institute', text: 'Hey Ananya! How are your studies going? 📚', time: '6:45 PM' },
      { sender: 'user', text: 'Honestly? I was drowning in studies before I found this program. Sleepless nights, constant anxiety... 😔', time: '6:46 PM' },
      { sender: 'institute', text: 'And now? We hope things have improved 💙', time: '6:47 PM' },
      { sender: 'user', text: 'Now I can actually focus! The mindfulness techniques help me study smarter, not harder. I even have time for hobbies now! 🎨', time: '6:48 PM' },
      { sender: 'user', text: 'My grades improved, and more importantly, I\'m happy and peaceful. This program taught me to find stillness in chaos. 🙏', time: '6:49 PM' },
      { sender: 'institute', text: 'That balance is so important, especially in medical school. You\'re an inspiration! ✨', time: '6:50 PM' }
    ],
    rating: 5
  }
];

export function TransformationStories() {
  const [activeStory, setActiveStory] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'chat' | 'before' | 'after'>('chat');

  const currentStory = stories[activeStory];

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-semibold mb-4">
            💬 Real Conversations
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            Stories of{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Transformation
            </span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            Read real conversations with our community members about their transformative journeys
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Stories Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              Community Stories
            </h3>

            <div className="space-y-3">
              {stories.map((story, index) => (
                <motion.button
                  key={story._id}
                  onClick={() => {
                    setActiveStory(index);
                    setSelectedTab('chat');
                  }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left p-4 rounded-2xl transition-all duration-300 ${
                    activeStory === index
                      ? 'bg-emerald-600 shadow-lg shadow-emerald-500/25'
                      : 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image
                        src={story.image}
                        alt={story.name}
                        width={50}
                        height={50}
                        className="rounded-full object-cover"
                      />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${
                        activeStory === index ? 'border-emerald-600 bg-emerald-400' : 'border-slate-800 bg-slate-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-bold text-sm mb-0.5 truncate ${
                        activeStory === index ? 'text-white' : 'text-slate-200'
                      }`}>
                        {story.name}
                      </h4>
                      <p className={`text-xs truncate ${
                        activeStory === index ? 'text-emerald-100' : 'text-slate-500'
                      }`}>
                        {story.role}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(story.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-blue-400 fill-blue-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-6 p-5 rounded-2xl bg-slate-800/50 border border-slate-700"
            >
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-emerald-400">50K+</div>
                  <div className="text-xs text-slate-500">Lives Changed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">4.9/5</div>
                  <div className="text-xs text-slate-500">Rating</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Chat Window */}
          <motion.div
            key={activeStory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
              {/* Chat Header */}
              <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex items-center gap-4">
                <div className="relative">
                  <Image
                    src={currentStory.image}
                    alt={currentStory.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-800" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold">{currentStory.name}</h3>
                  <p className="text-slate-400 text-sm">{currentStory.role}</p>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs">Online</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-[#0b141a]">
                {currentStory.messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-emerald-600 text-white rounded-br-sm'
                            : 'bg-slate-700 text-slate-100 rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 text-xs text-slate-500 ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}>
                        <span>{message.time}</span>
                        {message.sender === 'user' && (
                          <CheckCircle className="w-3 h-3 text-blue-400" />
                        )}
                      </div>
                    </div>
                    {message.sender === 'institute' && (
                      <div className="order-2 mr-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                          MI
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Before/After Toggle */}
              <div className="bg-slate-800 px-6 py-4 border-t border-slate-700">
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setSelectedTab('chat')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedTab === 'chat'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => setSelectedTab('before')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedTab === 'before'
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    Before
                  </button>
                  <button
                    onClick={() => setSelectedTab('after')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedTab === 'after'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    After
                  </button>
                </div>

                {selectedTab !== 'chat' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900 rounded-xl p-4"
                  >
                    {activeStory === 0 && selectedTab === 'before' && (
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-red-400">
                          <span className="text-2xl">😔</span>
                          <span className="font-semibold">Before Transformation</span>
                        </div>
                        <p className="text-slate-300 text-sm">Constant anxiety attacks before every work presentation. Couldn't focus, had sleepless nights, and felt overwhelmed by stress.</p>
                      </div>
                    )}
                    {activeStory === 0 && selectedTab === 'after' && (
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-emerald-400">
                          <span className="text-2xl">😊</span>
                          <span className="font-semibold">After Transformation</span>
                        </div>
                        <p className="text-slate-300 text-sm">Now looks forward to presentations! Breathing techniques keep me calm and focused. Team noticed the difference. Recommended the program to all friends!</p>
                      </div>
                    )}
                    {activeStory === 1 && selectedTab === 'before' && (
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-red-400">
                          <span className="text-2xl">😓</span>
                          <span className="font-semibold">Before Transformation</span>
                        </div>
                        <p className="text-slate-300 text-sm">Stressed business owner making poor decisions under pressure. Constantly overwhelmed, no work-life balance, business stagnating.</p>
                      </div>
                    )}
                    {activeStory === 1 && selectedTab === 'after' && (
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-emerald-400">
                          <span className="text-2xl">🎉</span>
                          <span className="font-semibold">After Transformation</span>
                        </div>
                        <p className="text-slate-300 text-sm">Business grew 40% in 3 months! Makes clearer decisions, no longer constantly stressed. Team says I'm a better leader. Morning meditation routine is pure gold!</p>
                      </div>
                    )}
                    {activeStory === 2 && selectedTab === 'before' && (
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-red-400">
                          <span className="text-2xl">😰</span>
                          <span className="font-semibold">Before Transformation</span>
                        </div>
                        <p className="text-slate-300 text-sm">Medical student drowning in studies. Sleepless nights, constant anxiety, no time for hobbies, barely coping with pressure.</p>
                      </div>
                    )}
                    {activeStory === 2 && selectedTab === 'after' && (
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-emerald-400">
                          <span className="text-2xl">🌟</span>
                          <span className="font-semibold">After Transformation</span>
                        </div>
                        <p className="text-slate-300 text-sm">Can actually focus now! Studies smarter, not harder. Has time for hobbies, grades improved, and most importantly - happy and peaceful!</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto"
        >
          {[
            { value: '50,000+', label: 'Lives Transformed' },
            { value: '4.9/5', label: 'Average Rating' },
            { value: '95%', label: 'Success Rate' },
            { value: '1000+', label: 'Video Stories' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
