# AI-Native Workflow Note - Scribe Collaborative Document Editor

## AI Tools Used

- **v0 by Vercel** - Primary development environment for the entire Scribe project
- **Claude (via v0)** - Code generation, architecture decisions, debugging, and iterative refinement
- **Google Gemini (via Nanobanana)** - Generated the Scribe logo (stylized "S" pencil icon with teal/blue gradient)

---

## Where AI Materially Sped Up Work

| Area | Time Saved | How |
|------|------------|-----|
| **Logo creation** | ~1 hour | Used Google Gemini via Nanobanana to generate a professional logo |
| **Auth scaffolding** | ~2 hours | Complete login, signup, middleware, and protected route patterns |
| **Component library** | ~3 hours | Rich text toolbar, share dialog, comments, version history |
| **Database queries** | ~1 hour | Supabase queries with proper error handling patterns |
| **CSS debugging** | ~30 min | Diagnosed html2canvas + oklch color failure, pivoted to jsPDF |
| **Theme refactoring** | ~1 hour | Dark purple theme - updated only `globals.css` |
| **Documentation** | ~30 min | ENGINEERING.md, README.md, architecture notes |
| **Carousel implementation** | ~45 min | HeroCarousel with embla-carousel and auto-play |

**Total time saved: ~9 hours**

---

## What AI-Generated Output I Changed or Rejected

| Original AI Output | My Action | Reason |
|--------------------|-----------|--------|
| Sharing query `.or()` syntax | Rewrote to `.eq('shared_with_email', user.email)` | Testing showed shared documents not appearing |
| PDF export using html2canvas | Replaced with jsPDF native text rendering | html2canvas fails on oklch/lab colors |
| Comments visible to all users | Added `canEdit` prop restriction | Only edit-access users should see comments |
| Versions on auto-save | Changed to manual "Save" only | Prevent excessive version clutter |
| Hardcoded `neutral-*` colors | Replaced with semantic tokens | Theme consistency and dark mode support |
| Carousel without auto-play | Added 5-second auto-play | Better UX for feature showcase |

---

## How I Verified Correctness

### Functional Testing
- Created 2 real Supabase accounts and tested sharing workflow
- Verified permission boundaries: view-only users cannot edit, see comments, or create versions
- Tested all CRUD operations with real data

### Debugging Approach
- Used `[v0]` prefixed console logs to trace execution
- Read debug logs to identify root causes
- Removed debug statements after verification

### UX Quality Checks
- Tested dark purple theme across mobile/tablet/desktop viewports
- Verified WCAG AAA contrast ratios (white on near-black)
- Tested interactive states (hover, focus, disabled, loading)
- Verified logo renders at multiple sizes (24px to 64px)

### Implementation Reliability
- All Supabase queries include error handling
- Form validation prevents invalid submissions
- Auto-save debouncing prevents excessive writes
- Permission checks happen server-side only

---

## AI Usage Insights

### Where AI Excelled
- Boilerplate and scaffolding (auth flows, CRUD)
- Pattern recognition (shadcn/ui conventions)
- Integration knowledge (Supabase patterns)
- Theme system understanding (design tokens)
- Error diagnosis (oklch color parsing issue)

### Where Human Judgment Was Essential
- Debugging edge cases (sharing query failures)
- Business logic (edit-only comments)
- Architecture decisions (manual vs auto-save versions)
- Quality verification (real account testing)
- Design trade-offs (semantic tokens vs component-specific styling)

### Key Learnings
- AI is fastest at scaffolding (80% complete quickly)
- Testing is non-negotiable before production
- Error logs point to root causes
- Document why AI output was changed
- Combine AI tools strategically

---

## Practical Recommendations

### Do's ✅
- Use AI for scaffolding and boilerplate
- Ask AI to follow existing code patterns
- Have AI generate test cases alongside code
- Document when you override AI suggestions
- Test thoroughly before considering complete
- Use AI for documentation

### Don'ts ❌
- Don't trust AI-generated SQL without testing
- Don't use AI for security-critical code without review
- Don't skip error handling
- Don't assume AI understands full context
- Don't ignore error logs
- Don't rely solely on AI for architecture

---

## Conclusion

AI reduced development time by approximately **30-40%** while maintaining high code quality and UX standards. The combination of v0, Claude, and Gemini created a production-ready collaborative document editor in a single sprint.

**Human expertise remained essential** for debugging edge cases, architectural decisions, and quality assurance. Treat AI as a powerful amplifier of developer productivity, not a replacement for human judgment.
