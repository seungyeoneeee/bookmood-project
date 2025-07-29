import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Heart, Tag, TrendingUp, Filter, Grid, List, Download, Share2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
interface ReviewData {
  id: string;
  bookId: string;
  review: string;
  emotions: string[];
  topics: string[];
  moodSummary: string;
  createdAt: Date;
  moodCardUrl?: string;
  mpid?: string;
}
interface ArchiveDashboardProps {
  reviews: ReviewData[];
  onMoodCardSelect: (review: ReviewData) => void;
  onBack: () => void;
  mpid?: string;
}
type ViewMode = 'grid' | 'timeline';
type FilterType = 'all' | 'month' | 'emotion' | 'topic';
const ArchiveDashboard: React.FC<ArchiveDashboardProps> = ({
  reviews,
  onMoodCardSelect,
  onBack
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedFilter, setSelectedFilter] = useState<string>('');

  // Process data for visualizations
  const chartData = useMemo(() => {
    const monthlyData = reviews.reduce((acc, review) => {
      const month = review.createdAt.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      });
      if (!acc[month]) {
        acc[month] = {
          month,
          count: 0,
          emotions: {}
        };
      }
      acc[month].count++;
      review.emotions.forEach(emotion => {
        acc[month].emotions[emotion] = (acc[month].emotions[emotion] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, any>);
    return Object.values(monthlyData);
  }, [reviews]);
  const emotionData = useMemo(() => {
    const emotions = reviews.flatMap(r => r.emotions);
    const emotionCounts = emotions.reduce((acc, emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(emotionCounts).map(([emotion, count]) => ({
      emotion,
      count
    })).sort((a, b) => b.count - a.count).slice(0, 8);
  }, [reviews]);
  const topicData = useMemo(() => {
    const topics = reviews.flatMap(r => r.topics);
    const topicCounts = topics.reduce((acc, topic) => {
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(topicCounts).map(([topic, count]) => ({
      topic,
      count
    })).sort((a, b) => b.count - a.count).slice(0, 6);
  }, [reviews]);
  const filteredReviews = useMemo(() => {
    if (filterType === 'all' || !selectedFilter) return reviews;
    return reviews.filter(review => {
      switch (filterType) {
        case 'month':
          const reviewMonth = review.createdAt.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
          });
          return reviewMonth === selectedFilter;
        case 'emotion':
          return review.emotions.includes(selectedFilter);
        case 'topic':
          return review.topics.includes(selectedFilter);
        default:
          return true;
      }
    });
  }, [reviews, filterType, selectedFilter]);
  const colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#84cc16'];
  const renderMoodCard = (review: ReviewData, index: number) => <motion.div key={review.id} initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    delay: index * 0.1
  }} onClick={() => onMoodCardSelect(review)} className="group cursor-pointer" data-magicpath-id="0" data-magicpath-path="ArchiveDashboard.tsx">
      <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300" data-magicpath-id="1" data-magicpath-path="ArchiveDashboard.tsx">
        <div className="flex items-start justify-between mb-4" data-magicpath-id="2" data-magicpath-path="ArchiveDashboard.tsx">
          <div className="flex-1" data-magicpath-id="3" data-magicpath-path="ArchiveDashboard.tsx">
            <p className="text-sm text-muted-foreground mb-2 flex items-center" data-magicpath-id="4" data-magicpath-path="ArchiveDashboard.tsx">
              <Calendar className="w-3 h-3 mr-1" data-magicpath-id="5" data-magicpath-path="ArchiveDashboard.tsx" />
              {review.createdAt.toLocaleDateString()}
            </p>
            <p className="text-foreground font-medium line-clamp-3 mb-4" data-magicpath-id="6" data-magicpath-path="ArchiveDashboard.tsx">
              {review.moodSummary}
            </p>
          </div>
          <Heart className="w-5 h-5 text-accent group-hover:text-accent/80 transition-colors" data-magicpath-id="7" data-magicpath-path="ArchiveDashboard.tsx" />
        </div>

        <div className="space-y-3" data-magicpath-id="8" data-magicpath-path="ArchiveDashboard.tsx">
          <div data-magicpath-id="9" data-magicpath-path="ArchiveDashboard.tsx">
            <p className="text-xs font-medium text-muted-foreground mb-2" data-magicpath-id="10" data-magicpath-path="ArchiveDashboard.tsx">Emotions</p>
            <div className="flex flex-wrap gap-1" data-magicpath-id="11" data-magicpath-path="ArchiveDashboard.tsx">
              {review.emotions.slice(0, 3).map((emotion, idx) => <span key={idx} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full" data-magicpath-uuid={(emotion as any)["mpid"] ?? "unsafe"} data-magicpath-id="12" data-magicpath-path="ArchiveDashboard.tsx">
                  {emotion}
                </span>)}
            </div>
          </div>

          <div data-magicpath-id="13" data-magicpath-path="ArchiveDashboard.tsx">
            <p className="text-xs font-medium text-muted-foreground mb-2" data-magicpath-id="14" data-magicpath-path="ArchiveDashboard.tsx">Topics</p>
            <div className="flex flex-wrap gap-1" data-magicpath-id="15" data-magicpath-path="ArchiveDashboard.tsx">
              {review.topics.slice(0, 2).map((topic, idx) => <span key={idx} className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-full" data-magicpath-uuid={(topic as any)["mpid"] ?? "unsafe"} data-magicpath-id="16" data-magicpath-path="ArchiveDashboard.tsx">
                  {topic}
                </span>)}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between" data-magicpath-id="17" data-magicpath-path="ArchiveDashboard.tsx">
          <span className="text-xs text-muted-foreground" data-magicpath-id="18" data-magicpath-path="ArchiveDashboard.tsx">Click to view details</span>
          <div className="flex items-center space-x-2" data-magicpath-id="19" data-magicpath-path="ArchiveDashboard.tsx">
            <button className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity" data-magicpath-id="20" data-magicpath-path="ArchiveDashboard.tsx">
              <Download className="w-3 h-3" data-magicpath-id="21" data-magicpath-path="ArchiveDashboard.tsx" />
            </button>
            <button className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity" data-magicpath-id="22" data-magicpath-path="ArchiveDashboard.tsx">
              <Share2 className="w-3 h-3" data-magicpath-id="23" data-magicpath-path="ArchiveDashboard.tsx" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>;
  const renderTimeline = () => <div className="space-y-6" data-magicpath-id="24" data-magicpath-path="ArchiveDashboard.tsx">
      {filteredReviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((review, index) => <motion.div key={review.id} initial={{
      opacity: 0,
      x: -20
    }} animate={{
      opacity: 1,
      x: 0
    }} transition={{
      delay: index * 0.1
    }} onClick={() => onMoodCardSelect(review)} className="group cursor-pointer" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="25" data-magicpath-path="ArchiveDashboard.tsx">
            <div className="flex space-x-4" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="26" data-magicpath-path="ArchiveDashboard.tsx">
              <div className="flex flex-col items-center" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="27" data-magicpath-path="ArchiveDashboard.tsx">
                <div className="w-3 h-3 bg-primary rounded-full group-hover:bg-primary/80 transition-colors" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="28" data-magicpath-path="ArchiveDashboard.tsx" />
                {index < filteredReviews.length - 1 && <div className="w-px h-16 bg-border mt-2" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="29" data-magicpath-path="ArchiveDashboard.tsx" />}
              </div>
              <div className="flex-1 bg-card border border-border rounded-xl p-6 group-hover:shadow-lg group-hover:border-primary/20 transition-all duration-300" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="30" data-magicpath-path="ArchiveDashboard.tsx">
                <div className="flex items-start justify-between mb-3" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="31" data-magicpath-path="ArchiveDashboard.tsx">
                  <p className="text-sm text-muted-foreground" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="32" data-magicpath-path="ArchiveDashboard.tsx">
                    {review.createdAt.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
                  </p>
                  <Heart className="w-4 h-4 text-accent" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="33" data-magicpath-path="ArchiveDashboard.tsx" />
                </div>
                
                <p className="text-foreground font-medium mb-4 line-clamp-2" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-field="moodSummary:unknown" data-magicpath-id="34" data-magicpath-path="ArchiveDashboard.tsx">
                  {review.moodSummary}
                </p>

                <div className="flex flex-wrap gap-2 mb-3" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="35" data-magicpath-path="ArchiveDashboard.tsx">
                  {review.emotions.map((emotion, idx) => <span key={idx} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="36" data-magicpath-path="ArchiveDashboard.tsx">
                      {emotion}
                    </span>)}
                  {review.topics.map((topic, idx) => <span key={idx} className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-full" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="37" data-magicpath-path="ArchiveDashboard.tsx">
                      {topic}
                    </span>)}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-field="review:unknown" data-magicpath-id="38" data-magicpath-path="ArchiveDashboard.tsx">
                  {review.review}
                </p>
              </div>
            </div>
          </motion.div>)}
    </div>;
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-primary/5 p-4" data-magicpath-id="39" data-magicpath-path="ArchiveDashboard.tsx">
      <div className="max-w-7xl mx-auto pt-8" data-magicpath-id="40" data-magicpath-path="ArchiveDashboard.tsx">
        {/* Header */}
        <div className="flex items-center justify-between mb-8" data-magicpath-id="41" data-magicpath-path="ArchiveDashboard.tsx">
          <div className="flex items-center space-x-4" data-magicpath-id="42" data-magicpath-path="ArchiveDashboard.tsx">
            <button onClick={onBack} className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors" data-magicpath-id="43" data-magicpath-path="ArchiveDashboard.tsx">
              <ArrowLeft className="w-5 h-5" data-magicpath-id="44" data-magicpath-path="ArchiveDashboard.tsx" />
              <span data-magicpath-id="45" data-magicpath-path="ArchiveDashboard.tsx">Back</span>
            </button>
            <div data-magicpath-id="46" data-magicpath-path="ArchiveDashboard.tsx">
              <h1 className="text-3xl font-bold text-foreground" data-magicpath-id="47" data-magicpath-path="ArchiveDashboard.tsx">My Reading Archive</h1>
              <p className="text-muted-foreground" data-magicpath-id="48" data-magicpath-path="ArchiveDashboard.tsx">{reviews.length} emotional journeys captured</p>
            </div>
          </div>

          <div className="flex items-center space-x-3" data-magicpath-id="49" data-magicpath-path="ArchiveDashboard.tsx">
            <div className="flex items-center bg-muted rounded-lg p-1" data-magicpath-id="50" data-magicpath-path="ArchiveDashboard.tsx">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`} data-magicpath-id="51" data-magicpath-path="ArchiveDashboard.tsx">
                <Grid className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('timeline')} className={`p-2 rounded-md transition-colors ${viewMode === 'timeline' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`} data-magicpath-id="52" data-magicpath-path="ArchiveDashboard.tsx">
                <List className="w-4 h-4" data-magicpath-id="53" data-magicpath-path="ArchiveDashboard.tsx" />
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8" data-magicpath-id="54" data-magicpath-path="ArchiveDashboard.tsx">
          {/* Reading Timeline */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6" data-magicpath-id="55" data-magicpath-path="ArchiveDashboard.tsx">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center" data-magicpath-id="56" data-magicpath-path="ArchiveDashboard.tsx">
              <TrendingUp className="w-5 h-5 mr-2" data-magicpath-id="57" data-magicpath-path="ArchiveDashboard.tsx" />
              Reading Timeline
            </h3>
            <div className="h-64" data-magicpath-id="58" data-magicpath-path="ArchiveDashboard.tsx">
              <ResponsiveContainer width="100%" height="100%" data-magicpath-id="59" data-magicpath-path="ArchiveDashboard.tsx">
                <LineChart data={chartData} data-magicpath-id="60" data-magicpath-path="ArchiveDashboard.tsx">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" data-magicpath-id="61" data-magicpath-path="ArchiveDashboard.tsx" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" data-magicpath-id="62" data-magicpath-path="ArchiveDashboard.tsx" />
                  <YAxis stroke="hsl(var(--muted-foreground))" data-magicpath-id="63" data-magicpath-path="ArchiveDashboard.tsx" />
                  <Tooltip contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} data-magicpath-id="64" data-magicpath-path="ArchiveDashboard.tsx" />
                  <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={3} dot={{
                  fill: 'hsl(var(--primary))',
                  strokeWidth: 2,
                  r: 4
                }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Emotions */}
          <div className="bg-card border border-border rounded-xl p-6" data-magicpath-id="65" data-magicpath-path="ArchiveDashboard.tsx">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center" data-magicpath-id="66" data-magicpath-path="ArchiveDashboard.tsx">
              <Heart className="w-5 h-5 mr-2" data-magicpath-id="67" data-magicpath-path="ArchiveDashboard.tsx" />
              Top Emotions
            </h3>
            <div className="space-y-3" data-magicpath-id="68" data-magicpath-path="ArchiveDashboard.tsx">
              {emotionData.slice(0, 5).map((item, index) => <div key={item.emotion} className="flex items-center justify-between" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="69" data-magicpath-path="ArchiveDashboard.tsx">
                  <span className="text-sm text-foreground capitalize" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="emotion:unknown" data-magicpath-id="70" data-magicpath-path="ArchiveDashboard.tsx">{item.emotion}</span>
                  <div className="flex items-center space-x-2" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="71" data-magicpath-path="ArchiveDashboard.tsx">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="72" data-magicpath-path="ArchiveDashboard.tsx">
                      <div className="h-full bg-primary rounded-full transition-all duration-500" style={{
                    width: `${item.count / emotionData[0].count * 100}%`
                  }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="73" data-magicpath-path="ArchiveDashboard.tsx" />
                    </div>
                    <span className="text-xs text-muted-foreground w-6 text-right" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="count:unknown" data-magicpath-id="74" data-magicpath-path="ArchiveDashboard.tsx">{item.count}</span>
                  </div>
                </div>)}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8" data-magicpath-id="75" data-magicpath-path="ArchiveDashboard.tsx">
          <div className="flex items-center space-x-2" data-magicpath-id="76" data-magicpath-path="ArchiveDashboard.tsx">
            <Filter className="w-4 h-4 text-muted-foreground" data-magicpath-id="77" data-magicpath-path="ArchiveDashboard.tsx" />
            <span className="text-sm font-medium text-foreground" data-magicpath-id="78" data-magicpath-path="ArchiveDashboard.tsx">Filter by:</span>
          </div>
          
          <select value={filterType} onChange={e => {
          setFilterType(e.target.value as FilterType);
          setSelectedFilter('');
        }} className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" data-magicpath-id="79" data-magicpath-path="ArchiveDashboard.tsx">
            <option value="all" data-magicpath-id="80" data-magicpath-path="ArchiveDashboard.tsx">All Reviews</option>
            <option value="month" data-magicpath-id="81" data-magicpath-path="ArchiveDashboard.tsx">By Month</option>
            <option value="emotion" data-magicpath-id="82" data-magicpath-path="ArchiveDashboard.tsx">By Emotion</option>
            <option value="topic" data-magicpath-id="83" data-magicpath-path="ArchiveDashboard.tsx">By Topic</option>
          </select>

          {filterType !== 'all' && <select value={selectedFilter} onChange={e => setSelectedFilter(e.target.value)} className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" data-magicpath-id="84" data-magicpath-path="ArchiveDashboard.tsx">
              <option value="" data-magicpath-id="85" data-magicpath-path="ArchiveDashboard.tsx">Select {filterType}</option>
              {filterType === 'month' && chartData.map((item: any) => <option key={item.month} value={item.month} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="month:unknown" data-magicpath-id="86" data-magicpath-path="ArchiveDashboard.tsx">{item.month}</option>)}
              {filterType === 'emotion' && emotionData.map(item => <option key={item.emotion} value={item.emotion} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="emotion:unknown" data-magicpath-id="87" data-magicpath-path="ArchiveDashboard.tsx">{item.emotion}</option>)}
              {filterType === 'topic' && topicData.map(item => <option key={item.topic} value={item.topic} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="topic:unknown" data-magicpath-id="88" data-magicpath-path="ArchiveDashboard.tsx">{item.topic}</option>)}
            </select>}

          {selectedFilter && <button onClick={() => {
          setFilterType('all');
          setSelectedFilter('');
        }} className="px-3 py-2 text-xs bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors" data-magicpath-id="89" data-magicpath-path="ArchiveDashboard.tsx">
              Clear Filter
            </button>}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait" data-magicpath-id="90" data-magicpath-path="ArchiveDashboard.tsx">
          {viewMode === 'grid' ? <motion.div key="grid" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-magicpath-id="91" data-magicpath-path="ArchiveDashboard.tsx">
              {filteredReviews.map((review, index) => renderMoodCard(review, index))}
            </motion.div> : <motion.div key="timeline" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} data-magicpath-id="92" data-magicpath-path="ArchiveDashboard.tsx">
              {renderTimeline()}
            </motion.div>}
        </AnimatePresence>

        {filteredReviews.length === 0 && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} className="text-center py-16" data-magicpath-id="93" data-magicpath-path="ArchiveDashboard.tsx">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" data-magicpath-id="94" data-magicpath-path="ArchiveDashboard.tsx" />
            <h3 className="text-xl font-semibold text-foreground mb-2" data-magicpath-id="95" data-magicpath-path="ArchiveDashboard.tsx">No reviews found</h3>
            <p className="text-muted-foreground" data-magicpath-id="96" data-magicpath-path="ArchiveDashboard.tsx">
              {selectedFilter ? 'Try adjusting your filters' : 'Start by adding your first book review'}
            </p>
          </motion.div>}
      </div>
    </motion.div>;
};
export default ArchiveDashboard;