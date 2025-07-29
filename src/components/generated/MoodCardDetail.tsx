import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2, Heart, Calendar, Tag, Sparkles, Copy, Check, Twitter, Facebook, Instagram } from 'lucide-react';
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
interface MoodCardDetailProps {
  review: ReviewData;
  onBack: () => void;
  mpid?: string;
}
const MoodCardDetail: React.FC<MoodCardDetailProps> = ({
  review,
  onBack
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const handleDownload = async () => {
    setIsDownloading(true);

    // Mock download process
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real app, this would generate and download the mood card image
    const link = document.createElement('a');
    link.href = '#'; // Would be the actual image URL
    link.download = `mood-card-${review.id}.png`;
    // link.click();

    setIsDownloading(false);
  };
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };
  const handleSocialShare = (platform: string) => {
    const text = `Check out my reading mood card: "${review.moodSummary}"`;
    const url = window.location.href;
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
        handleCopyLink();
        return;
    }
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  // Generate a gradient based on emotions
  const getEmotionGradient = () => {
    const emotionColors: Record<string, string> = {
      happy: '#fbbf24',
      sad: '#3b82f6',
      excited: '#f59e0b',
      contemplative: '#8b5cf6',
      melancholic: '#6366f1',
      hopeful: '#10b981',
      anxious: '#ef4444',
      thrilled: '#ec4899',
      inspired: '#06b6d4',
      curious: '#84cc16',
      satisfied: '#14b8a6',
      peaceful: '#a78bfa'
    };
    const colors = review.emotions.slice(0, 3).map(emotion => emotionColors[emotion.toLowerCase()] || '#8b5cf6');
    if (colors.length === 1) {
      return `linear-gradient(135deg, ${colors[0]}, ${colors[0]}80)`;
    } else if (colors.length === 2) {
      return `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
    } else {
      return `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`;
    }
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-accent/5 p-4" data-magicpath-id="0" data-magicpath-path="MoodCardDetail.tsx">
      <div className="max-w-4xl mx-auto pt-8" data-magicpath-id="1" data-magicpath-path="MoodCardDetail.tsx">
        {/* Header */}
        <div className="flex items-center justify-between mb-8" data-magicpath-id="2" data-magicpath-path="MoodCardDetail.tsx">
          <button onClick={onBack} className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors" data-magicpath-id="3" data-magicpath-path="MoodCardDetail.tsx">
            <ArrowLeft className="w-5 h-5" data-magicpath-id="4" data-magicpath-path="MoodCardDetail.tsx" />
            <span data-magicpath-id="5" data-magicpath-path="MoodCardDetail.tsx">Back to Archive</span>
          </button>

          <div className="flex items-center space-x-3" data-magicpath-id="6" data-magicpath-path="MoodCardDetail.tsx">
            <button onClick={handleDownload} disabled={isDownloading} className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors" data-magicpath-id="7" data-magicpath-path="MoodCardDetail.tsx">
              <Download className="w-4 h-4" data-magicpath-id="8" data-magicpath-path="MoodCardDetail.tsx" />
              <span data-magicpath-id="9" data-magicpath-path="MoodCardDetail.tsx">{isDownloading ? 'Generating...' : 'Download'}</span>
            </button>

            <div className="relative" data-magicpath-id="10" data-magicpath-path="MoodCardDetail.tsx">
              <button onClick={() => setShowShareMenu(!showShareMenu)} className="flex items-center space-x-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors" data-magicpath-id="11" data-magicpath-path="MoodCardDetail.tsx">
                <Share2 className="w-4 h-4" data-magicpath-id="12" data-magicpath-path="MoodCardDetail.tsx" />
                <span data-magicpath-id="13" data-magicpath-path="MoodCardDetail.tsx">Share</span>
              </button>

              {showShareMenu && <motion.div initial={{
              opacity: 0,
              scale: 0.95,
              y: -10
            }} animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }} className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg z-10" data-magicpath-id="14" data-magicpath-path="MoodCardDetail.tsx">
                  <div className="p-2" data-magicpath-id="15" data-magicpath-path="MoodCardDetail.tsx">
                    <button onClick={() => handleSocialShare('twitter')} className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-muted rounded-lg transition-colors" data-magicpath-id="16" data-magicpath-path="MoodCardDetail.tsx">
                      <Twitter className="w-4 h-4 text-blue-500" data-magicpath-id="17" data-magicpath-path="MoodCardDetail.tsx" />
                      <span className="text-sm" data-magicpath-id="18" data-magicpath-path="MoodCardDetail.tsx">Twitter</span>
                    </button>
                    <button onClick={() => handleSocialShare('facebook')} className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-muted rounded-lg transition-colors" data-magicpath-id="19" data-magicpath-path="MoodCardDetail.tsx">
                      <Facebook className="w-4 h-4 text-blue-600" data-magicpath-id="20" data-magicpath-path="MoodCardDetail.tsx" />
                      <span className="text-sm" data-magicpath-id="21" data-magicpath-path="MoodCardDetail.tsx">Facebook</span>
                    </button>
                    <button onClick={() => handleSocialShare('instagram')} className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-muted rounded-lg transition-colors" data-magicpath-id="22" data-magicpath-path="MoodCardDetail.tsx">
                      <Instagram className="w-4 h-4 text-pink-500" data-magicpath-id="23" data-magicpath-path="MoodCardDetail.tsx" />
                      <span className="text-sm" data-magicpath-id="24" data-magicpath-path="MoodCardDetail.tsx">Instagram</span>
                    </button>
                    <div className="border-t border-border my-2" data-magicpath-id="25" data-magicpath-path="MoodCardDetail.tsx" />
                    <button onClick={handleCopyLink} className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-muted rounded-lg transition-colors" data-magicpath-id="26" data-magicpath-path="MoodCardDetail.tsx">
                      {copied ? <Check className="w-4 h-4 text-green-500" data-magicpath-id="27" data-magicpath-path="MoodCardDetail.tsx" /> : <Copy className="w-4 h-4" data-magicpath-id="28" data-magicpath-path="MoodCardDetail.tsx" />}
                      <span className="text-sm" data-magicpath-id="29" data-magicpath-path="MoodCardDetail.tsx">{copied ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                </motion.div>}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8" data-magicpath-id="30" data-magicpath-path="MoodCardDetail.tsx">
          {/* Mood Card Visualization */}
          <motion.div initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          delay: 0.2
        }} className="space-y-6" data-magicpath-id="31" data-magicpath-path="MoodCardDetail.tsx">
            {/* Main Mood Card */}
            <div className="relative" data-magicpath-id="32" data-magicpath-path="MoodCardDetail.tsx">
              <div className="aspect-square rounded-2xl p-8 text-white relative overflow-hidden" style={{
              background: getEmotionGradient()
            }} data-magicpath-id="33" data-magicpath-path="MoodCardDetail.tsx">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" data-magicpath-id="34" data-magicpath-path="MoodCardDetail.tsx">
                  <div className="absolute top-4 right-4 w-32 h-32 border border-white/20 rounded-full" data-magicpath-id="35" data-magicpath-path="MoodCardDetail.tsx" />
                  <div className="absolute bottom-8 left-8 w-24 h-24 border border-white/20 rounded-full" data-magicpath-id="36" data-magicpath-path="MoodCardDetail.tsx" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white/10 rounded-full" data-magicpath-id="37" data-magicpath-path="MoodCardDetail.tsx" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between" data-magicpath-id="38" data-magicpath-path="MoodCardDetail.tsx">
                  <div data-magicpath-id="39" data-magicpath-path="MoodCardDetail.tsx">
                    <div className="flex items-center space-x-2 mb-4" data-magicpath-id="40" data-magicpath-path="MoodCardDetail.tsx">
                      <Heart className="w-6 h-6" data-magicpath-id="41" data-magicpath-path="MoodCardDetail.tsx" />
                      <span className="text-sm font-medium opacity-90" data-magicpath-id="42" data-magicpath-path="MoodCardDetail.tsx">BookMood</span>
                    </div>
                    
                    <div className="mb-6" data-magicpath-id="43" data-magicpath-path="MoodCardDetail.tsx">
                      <p className="text-sm opacity-75 mb-2" data-magicpath-id="44" data-magicpath-path="MoodCardDetail.tsx">
                        {review.createdAt.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4" data-magicpath-id="45" data-magicpath-path="MoodCardDetail.tsx">
                    <blockquote className="text-lg font-medium leading-relaxed" data-magicpath-id="46" data-magicpath-path="MoodCardDetail.tsx">
                      "{review.moodSummary}"
                    </blockquote>

                    <div className="flex flex-wrap gap-2" data-magicpath-id="47" data-magicpath-path="MoodCardDetail.tsx">
                      {review.emotions.slice(0, 3).map((emotion, index) => <span key={index} className="px-3 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full" data-magicpath-uuid={(emotion as any)["mpid"] ?? "unsafe"} data-magicpath-id="48" data-magicpath-path="MoodCardDetail.tsx">
                          {emotion}
                        </span>)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between" data-magicpath-id="49" data-magicpath-path="MoodCardDetail.tsx">
                    <div className="flex items-center space-x-2" data-magicpath-id="50" data-magicpath-path="MoodCardDetail.tsx">
                      <Sparkles className="w-4 h-4 opacity-75" />
                      <span className="text-xs opacity-75" data-magicpath-id="51" data-magicpath-path="MoodCardDetail.tsx">AI Generated</span>
                    </div>
                    <div className="text-xs opacity-75" data-magicpath-id="52" data-magicpath-path="MoodCardDetail.tsx">
                      #{review.id.slice(0, 8)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Variations */}
            <div className="grid grid-cols-3 gap-3" data-magicpath-id="53" data-magicpath-path="MoodCardDetail.tsx">
              {[1, 2, 3].map(variant => <div key={variant} className="aspect-square rounded-lg p-4 text-white text-xs relative overflow-hidden cursor-pointer hover:scale-105 transition-transform" style={{
              background: variant === 1 ? getEmotionGradient() : variant === 2 ? `linear-gradient(45deg, ${getEmotionGradient().split(',')[0]}, #1f2937)` : `linear-gradient(180deg, ${getEmotionGradient().split(',')[0]}, transparent)`
            }} data-magicpath-id="54" data-magicpath-path="MoodCardDetail.tsx">
                  <div className="absolute inset-0 bg-black/10" data-magicpath-id="55" data-magicpath-path="MoodCardDetail.tsx" />
                  <div className="relative z-10" data-magicpath-id="56" data-magicpath-path="MoodCardDetail.tsx">
                    <Heart className="w-3 h-3 mb-2" data-magicpath-id="57" data-magicpath-path="MoodCardDetail.tsx" />
                    <p className="font-medium line-clamp-2 mb-2" data-magicpath-id="58" data-magicpath-path="MoodCardDetail.tsx">
                      {review.moodSummary.slice(0, 50)}...
                    </p>
                    <div className="flex flex-wrap gap-1" data-magicpath-id="59" data-magicpath-path="MoodCardDetail.tsx">
                      {review.emotions.slice(0, 2).map((emotion, idx) => <span key={idx} className="px-1 py-0.5 bg-white/20 rounded text-xs" data-magicpath-uuid={(emotion as any)["mpid"] ?? "unsafe"} data-magicpath-id="60" data-magicpath-path="MoodCardDetail.tsx">
                          {emotion.slice(0, 6)}
                        </span>)}
                    </div>
                  </div>
                </div>)}
            </div>
          </motion.div>

          {/* Details Panel */}
          <motion.div initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          delay: 0.4
        }} className="space-y-6" data-magicpath-id="61" data-magicpath-path="MoodCardDetail.tsx">
            {/* Metadata */}
            <div className="bg-card border border-border rounded-xl p-6" data-magicpath-id="62" data-magicpath-path="MoodCardDetail.tsx">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center" data-magicpath-id="63" data-magicpath-path="MoodCardDetail.tsx">
                <Calendar className="w-5 h-5 mr-2" data-magicpath-id="64" data-magicpath-path="MoodCardDetail.tsx" />
                Reading Details
              </h2>
              
              <div className="space-y-4" data-magicpath-id="65" data-magicpath-path="MoodCardDetail.tsx">
                <div data-magicpath-id="66" data-magicpath-path="MoodCardDetail.tsx">
                  <p className="text-sm font-medium text-muted-foreground mb-1" data-magicpath-id="67" data-magicpath-path="MoodCardDetail.tsx">Date</p>
                  <p className="text-foreground" data-magicpath-id="68" data-magicpath-path="MoodCardDetail.tsx">
                    {review.createdAt.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  </p>
                </div>

                <div data-magicpath-id="69" data-magicpath-path="MoodCardDetail.tsx">
                  <p className="text-sm font-medium text-muted-foreground mb-2" data-magicpath-id="70" data-magicpath-path="MoodCardDetail.tsx">Emotions Detected</p>
                  <div className="flex flex-wrap gap-2" data-magicpath-id="71" data-magicpath-path="MoodCardDetail.tsx">
                    {review.emotions.map((emotion, index) => <span key={index} className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full font-medium" data-magicpath-id="72" data-magicpath-path="MoodCardDetail.tsx">
                        {emotion}
                      </span>)}
                  </div>
                </div>

                <div data-magicpath-id="73" data-magicpath-path="MoodCardDetail.tsx">
                  <p className="text-sm font-medium text-muted-foreground mb-2" data-magicpath-id="74" data-magicpath-path="MoodCardDetail.tsx">Topics</p>
                  <div className="flex flex-wrap gap-2" data-magicpath-id="75" data-magicpath-path="MoodCardDetail.tsx">
                    {review.topics.map((topic, index) => <span key={index} className="px-3 py-1 text-sm bg-accent/10 text-accent rounded-full font-medium flex items-center" data-magicpath-id="76" data-magicpath-path="MoodCardDetail.tsx">
                        <Tag className="w-3 h-3 mr-1" data-magicpath-id="77" data-magicpath-path="MoodCardDetail.tsx" />
                        {topic}
                      </span>)}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="bg-card border border-border rounded-xl p-6" data-magicpath-id="78" data-magicpath-path="MoodCardDetail.tsx">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center" data-magicpath-id="79" data-magicpath-path="MoodCardDetail.tsx">
                <Sparkles className="w-5 h-5 mr-2" />
                AI Mood Analysis
              </h3>
              
              <div className="space-y-4" data-magicpath-id="80" data-magicpath-path="MoodCardDetail.tsx">
                <div data-magicpath-id="81" data-magicpath-path="MoodCardDetail.tsx">
                  <p className="text-sm font-medium text-muted-foreground mb-2" data-magicpath-id="82" data-magicpath-path="MoodCardDetail.tsx">Generated Summary</p>
                  <blockquote className="text-foreground italic border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg" data-magicpath-id="83" data-magicpath-path="MoodCardDetail.tsx">
                    "{review.moodSummary}"
                  </blockquote>
                </div>

                <div className="pt-4 border-t border-border" data-magicpath-id="84" data-magicpath-path="MoodCardDetail.tsx">
                  <p className="text-xs text-muted-foreground" data-magicpath-id="85" data-magicpath-path="MoodCardDetail.tsx">
                    This analysis was generated using AI to capture the emotional essence of your reading experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Original Review */}
            <div className="bg-card border border-border rounded-xl p-6" data-magicpath-id="86" data-magicpath-path="MoodCardDetail.tsx">
              <h3 className="text-lg font-semibold text-foreground mb-4" data-magicpath-id="87" data-magicpath-path="MoodCardDetail.tsx">Your Original Review</h3>
              <div className="prose prose-sm max-w-none" data-magicpath-id="88" data-magicpath-path="MoodCardDetail.tsx">
                <p className="text-muted-foreground leading-relaxed" data-magicpath-id="89" data-magicpath-path="MoodCardDetail.tsx">
                  {review.review}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-border rounded-xl p-6" data-magicpath-id="90" data-magicpath-path="MoodCardDetail.tsx">
              <h3 className="text-lg font-semibold text-foreground mb-4" data-magicpath-id="91" data-magicpath-path="MoodCardDetail.tsx">Mood Card Stats</h3>
              <div className="grid grid-cols-2 gap-4" data-magicpath-id="92" data-magicpath-path="MoodCardDetail.tsx">
                <div className="text-center" data-magicpath-id="93" data-magicpath-path="MoodCardDetail.tsx">
                  <p className="text-2xl font-bold text-primary" data-magicpath-id="94" data-magicpath-path="MoodCardDetail.tsx">{review.emotions.length}</p>
                  <p className="text-sm text-muted-foreground" data-magicpath-id="95" data-magicpath-path="MoodCardDetail.tsx">Emotions</p>
                </div>
                <div className="text-center" data-magicpath-id="96" data-magicpath-path="MoodCardDetail.tsx">
                  <p className="text-2xl font-bold text-accent" data-magicpath-id="97" data-magicpath-path="MoodCardDetail.tsx">{review.topics.length}</p>
                  <p className="text-sm text-muted-foreground" data-magicpath-id="98" data-magicpath-path="MoodCardDetail.tsx">Topics</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Click outside to close share menu */}
      {showShareMenu && <div className="fixed inset-0 z-0" onClick={() => setShowShareMenu(false)} data-magicpath-id="99" data-magicpath-path="MoodCardDetail.tsx" />}
    </motion.div>;
};
export default MoodCardDetail;