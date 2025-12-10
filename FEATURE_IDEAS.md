# Feature Ideas for English Verbs App

## Recently Added Features

### Search Functionality
- Real-time search across all verb types
- Search in English or Turkish
- Filter by category (Irregular, Phrasal, Stative, Verb Patterns)
- Example sentences included in search results
- Clean, responsive UI with result count

### Favorites System
- Star/bookmark verbs for quick access
- Dedicated Favorites page
- Remove individual favorites or clear all
- Persistent storage using localStorage
- Visual feedback with star icons

### Example Sentences
- Multiple example sentences for each verb
- Real-world usage examples
- Context for better understanding

## Suggested Future Features

### 1. Daily Goals & Streaks
**Priority: High**
- Set daily learning goals (e.g., 10 verbs per day)
- Track consecutive days of study (streaks)
- Calendar view showing activity
- Motivational badges for milestones
- Push notifications for daily reminders

### 2. Audio Pronunciation
**Priority: High**
- Text-to-speech for verb pronunciation
- Native speaker audio samples
- Playback speed control
- Practice pronunciation mode

### 3. Dark Mode
**Priority: Medium**
- Toggle between light and dark themes
- Automatic theme based on system settings
- Eye-friendly for night studying
- Smooth theme transitions

### 4. Advanced Statistics
**Priority: Medium**
- Learning velocity (verbs learned per week)
- Most practiced verb categories
- Time spent learning
- Success rate over time
- Weekly/monthly progress reports
- Export statistics as PDF or CSV

### 5. Difficulty Levels
**Priority: Medium**
- Mark verbs as Easy/Medium/Hard
- Auto-adjust based on performance
- Separate practice modes for each level
- Focus on difficult verbs

### 6. Study Reminders
**Priority: Medium**
- Custom notification schedule
- "Time to review" reminders
- Spaced repetition reminders
- Daily study time suggestions

### 7. Achievements & Badges
**Priority: Low-Medium**
- "First 10 verbs learned"
- "7-day streak"
- "Master of Phrasal Verbs"
- "100 verbs practiced"
- Social sharing of achievements

### 8. Verb Collections/Categories
**Priority: Medium**
- Business English verbs
- Travel English verbs
- Academic English verbs
- Conversational verbs
- Custom user-created collections

### 9. Flashcard Customization
**Priority: Low**
- Card color themes
- Font size adjustment
- Show/hide elements
- Custom card layouts
- Card shuffle options

### 10. Export/Import Progress
**Priority: Medium**
- Export learning data as JSON
- Import from other devices
- Backup to cloud (Supabase)
- Sync across devices

### 11. Social Features
**Priority: Low**
- Share progress with friends
- Leaderboards
- Study groups
- Challenge friends
- Community-contributed example sentences

### 12. Advanced Practice Modes
**Priority: High**
- Fill in the blank exercises
- Multiple choice quizzes
- Sentence construction
- Verb conjugation practice
- Listening comprehension

### 13. Sentence Builder
**Priority: Medium**
- Build sentences using learned verbs
- Grammar correction
- Suggestions for improvement
- Save created sentences

### 14. Verb Context & Usage Notes
**Priority: Medium**
- Formal vs informal usage
- British vs American English
- Common collocations
- Frequency of use
- Register information

### 15. Study Plans
**Priority: High**
- Predefined study paths (Beginner, Intermediate, Advanced)
- Custom study plans
- Daily study schedule
- Progress tracking per plan
- Certificates on completion

### 16. Offline Mode Enhancement
**Priority: Medium**
- Download specific verb sets
- Offline practice tests
- Sync when online
- Offline audio support

### 17. Gamification
**Priority: Medium**
- Points system
- Levels and XP
- Daily challenges
- Bonus rewards
- Competition modes

### 18. AI-Powered Features
**Priority: Low**
- AI-generated example sentences
- Personalized learning suggestions
- Smart review scheduling
- Context-aware explanations

### 19. Video Lessons
**Priority: Low**
- Short video explanations
- Usage in context videos
- Pronunciation guides
- Native speaker interviews

### 20. Integration Features
**Priority: Low**
- Calendar integration
- Note-taking apps sync
- Anki deck export
- Quizlet compatibility

## Implementation Priority

### Phase 1 (Quick Wins)
1. Dark Mode
2. Advanced Statistics
3. Daily Goals & Streaks
4. Study Reminders

### Phase 2 (Core Learning)
1. Audio Pronunciation
2. Advanced Practice Modes
3. Difficulty Levels
4. Study Plans

### Phase 3 (Engagement)
1. Achievements & Badges
2. Gamification
3. Verb Collections
4. Export/Import

### Phase 4 (Advanced)
1. Social Features
2. AI-Powered Features
3. Video Lessons
4. Integration Features

## Technical Considerations

### Database Schema Updates Needed
- User profiles table
- Study sessions table
- Achievements table
- Custom collections table
- Audio files storage
- Statistics aggregation tables

### APIs to Consider
- Text-to-Speech API (Web Speech API or cloud service)
- Push Notifications (Web Push API)
- Cloud Storage (Supabase Storage)
- Analytics service

### Performance Optimizations
- Lazy loading for pages
- Image optimization
- Code splitting
- Service Worker caching improvements
- Database indexing

## User Feedback Priorities

Consider gathering user feedback on:
1. Most wanted features
2. Pain points in current flow
3. Desired practice modes
4. Preferred notification frequency
5. UI/UX improvements

---

**Note**: All features should maintain the app's core principles:
- Simple and intuitive
- Mobile-first design
- Offline capability
- Fast and responsive
- Beautiful UI
