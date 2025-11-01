# Implementation Plan

- [x] 1. Setup design system and theme configuration
  - Create TailwindCSS configuration with custom color palette, typography scale, and spacing system
  - Add custom CSS variables for theme colors in globals.css
  - Configure font imports (Inter/Poppins) with font-display: swap
  - _Requirements: 1.4, 1.5, 1.6_

- [x] 2. Create core layout components
  - _Requirements: 1.2, 1.3_

- [x] 2.1 Implement Header component with authentication states
  - Create Header component with logo, navigation links, and auth buttons
  - Implement scroll detection for backdrop blur effect
  - Add authenticated state with balance display and user avatar dropdown
  - Implement mobile responsive behavior with hamburger menu
  - _Requirements: 1.2_

- [x] 2.2 Implement Sidebar navigation component
  - Create Sidebar component with menu items (Promociones, Afiliado, Club VIP, Blog, Foro, Patrocinios)
  - Add icons using Lucide React for each menu item
  - Implement active state highlighting with left border indicator
  - Add hover effects with smooth transitions
  - Implement mobile overlay behavior with slide-in animation
  - _Requirements: 1.3_

- [x] 2.3 Create main layout wrapper component
  - Create layout component that combines Header and Sidebar
  - Implement responsive grid layout for sidebar + main content
  - Add mobile menu state management
  - Handle overlay backdrop for mobile sidebar
  - _Requirements: 1.2, 1.3_

- [ ] 3. Implement landing page with hero section
  - _Requirements: 1.1, 1.8_

- [ ] 3.1 Create hero section component
  - Implement hero section with main headline "El casino con apuestas deportivas más grande del mundo"
  - Add primary "Registrarse" button with blue accent color and hover effect
  - Create social login icons section (Google, Facebook, Twitch)
  - Add fade-in animation on page load
  - Implement responsive text sizing for mobile/tablet/desktop
  - _Requirements: 1.1_

- [ ] 3.2 Create CategoryCard component for Casino and Sports
  - Build CategoryCard component with image background, gradient overlay, title, and player count
  - Implement hover effect with scale(1.02) and brightness increase
  - Add smooth transitions (300ms ease-out)
  - Create color variants for Casino (green #00C67A) and Sports (cyan #1DB4F9)
  - Add click handler for navigation
  - _Requirements: 1.1, 1.9_

- [ ] 3.3 Implement landing page layout with category cards
  - Create landing page component structure
  - Add two-column grid for Casino and Sports cards
  - Implement responsive behavior (stack vertically on mobile)
  - Add spacing and padding following design system
  - _Requirements: 1.1, 1.7_

- [ ] 4. Implement live stats system
  - _Requirements: 1.9_

- [ ] 4.1 Create live stats API endpoint
  - Create /api/stats/live endpoint to fetch active player counts
  - Query database for current active sessions in casino and sports
  - Return formatted response with player counts and game statistics
  - Implement caching to reduce database load (30 second cache)
  - _Requirements: 1.9_

- [ ] 4.2 Create useLiveStats custom hook
  - Implement useLiveStats hook with polling mechanism (30 second interval)
  - Add loading and error states
  - Implement cleanup on component unmount
  - Add automatic retry on fetch failure
  - _Requirements: 1.9_

- [ ] 4.3 Integrate live stats into category cards
  - Connect CategoryCard components to useLiveStats hook
  - Display real-time player counts with number formatting (e.g., 66,434)
  - Add loading skeleton while fetching initial data
  - Handle error states gracefully
  - _Requirements: 1.9_

- [ ] 5. Create games section components
  - _Requirements: 1.8_

- [ ] 5.1 Implement GameCard component
  - Create GameCard component with image, name, player count, and position badge
  - Add hover overlay with additional game information
  - Implement smooth transitions and animations
  - Add click handler for game navigation
  - _Requirements: 1.8_

- [ ] 5.2 Create trending games section
  - Build trending games section with title and "Ver todos" link
  - Implement 6-column grid for game cards (responsive: 2 cols mobile, 3 cols tablet, 6 cols desktop)
  - Add game data with placeholder images
  - Integrate with live stats for player counts
  - _Requirements: 1.8_

- [ ] 5.3 Implement game categories section
  - Create large category cards for Slots and Blackjack
  - Add gradient backgrounds and emoji icons
  - Display active player counts for each category
  - Implement hover effects with chevron animation
  - _Requirements: 1.8_

- [ ] 6. Implement authentication integration
  - _Requirements: 1.10_

- [ ] 6.1 Update login modal with new styling
  - Apply new design system colors and typography to existing login modal
  - Update button styles to match new theme
  - Add smooth transitions and animations
  - Ensure responsive behavior
  - _Requirements: 1.10_

- [ ] 6.2 Update registration modal with new styling
  - Apply new design system to registration modal
  - Update form inputs with new styling
  - Add social login buttons with icons
  - Implement validation error states with new colors
  - _Requirements: 1.10_

- [ ] 6.3 Implement user dropdown menu in header
  - Create dropdown component for authenticated user menu
  - Add menu items: Perfil, Configuración, Cerrar sesión
  - Implement smooth dropdown animation
  - Add click outside to close functionality
  - _Requirements: 1.10_

- [ ] 7. Implement responsive behavior
  - _Requirements: 1.7_

- [ ] 7.1 Add mobile menu functionality
  - Implement hamburger menu button in header for mobile
  - Add slide-in animation for mobile sidebar
  - Create overlay backdrop with fade animation
  - Handle body scroll lock when menu is open
  - _Requirements: 1.7_

- [ ] 7.2 Optimize layouts for tablet breakpoint
  - Adjust grid columns for category cards (2 columns)
  - Resize game cards appropriately
  - Adjust typography sizes for tablet
  - Test and fix any layout issues at 768-1024px
  - _Requirements: 1.7_

- [ ] 7.3 Test and fix mobile responsive issues
  - Test all components on mobile viewport (<768px)
  - Ensure touch targets are minimum 44x44px
  - Verify text is readable without zooming
  - Fix any overflow or layout breaking issues
  - _Requirements: 1.7, 1.12_

- [ ] 8. Implement animations and transitions
  - _Requirements: 1.6_

- [ ] 8.1 Add page load animations
  - Implement fade-in animation for hero section
  - Add staggered animation for category cards
  - Create smooth entrance for game cards
  - Use CSS transitions for GPU acceleration
  - _Requirements: 1.6_

- [ ] 8.2 Add hover and interaction animations
  - Implement hover effects for all interactive elements
  - Add button press animations
  - Create smooth transitions for dropdown menus
  - Ensure all animations run at 60fps
  - _Requirements: 1.6_

- [ ] 8.3 Add loading state animations
  - Create skeleton loaders for category cards
  - Implement loading spinners for async operations
  - Add pulse animation for loading states
  - Create smooth transitions between loading and loaded states
  - _Requirements: 1.6_

- [ ] 9. Implement performance optimizations
  - _Requirements: 1.11_

- [ ] 9.1 Optimize images with Next.js Image component
  - Replace all img tags with Next.js Image component
  - Add priority flag for above-the-fold images
  - Implement blur placeholders for better UX
  - Configure image optimization in next.config.js
  - _Requirements: 1.11_

- [ ] 9.2 Implement code splitting and lazy loading
  - Add dynamic imports for heavy components (modals, game details)
  - Implement lazy loading for game card images
  - Split vendor bundles appropriately
  - Measure and optimize bundle sizes
  - _Requirements: 1.11_

- [ ] 9.3 Add performance monitoring
  - Implement Web Vitals tracking (LCP, FID, CLS)
  - Add custom performance marks for key interactions
  - Set up error boundary components
  - Configure performance budgets
  - _Requirements: 1.11_

- [ ] 10. Implement accessibility features
  - _Requirements: 1.12_

- [ ] 10.1 Add keyboard navigation support
  - Ensure all interactive elements are keyboard accessible
  - Implement visible focus indicators
  - Add keyboard shortcuts for common actions
  - Test tab order and focus management
  - _Requirements: 1.12_

- [ ] 10.2 Add ARIA labels and semantic HTML
  - Add appropriate ARIA labels to all components
  - Use semantic HTML elements (nav, main, article, etc.)
  - Implement ARIA live regions for dynamic content
  - Add alt text to all images
  - _Requirements: 1.12_

- [ ] 10.3 Ensure color contrast compliance
  - Verify all text meets WCAG AA standards (4.5:1 contrast)
  - Test with color blindness simulators
  - Add visual indicators beyond color alone
  - Test with screen readers (NVDA, JAWS, VoiceOver)
  - _Requirements: 1.12_

- [ ]* 11. Create comprehensive test suite
  - _Requirements: All_

- [ ]* 11.1 Write unit tests for components
  - Write tests for CategoryCard component (rendering, hover, click)
  - Write tests for GameCard component (data display, interactions)
  - Write tests for Header component (auth states, mobile menu)
  - Write tests for Sidebar component (navigation, active states)
  - Write tests for useLiveStats hook (polling, error handling)
  - _Requirements: All_

- [ ]* 11.2 Write integration tests
  - Test landing page loads with correct data
  - Test navigation flow from landing to games section
  - Test live stats update mechanism
  - Test authentication flow with new UI
  - Test mobile menu interactions
  - _Requirements: All_

- [ ]* 11.3 Write E2E tests for critical paths
  - Test user journey: landing → casino → game selection
  - Test registration flow with new modals
  - Test authenticated user experience
  - Test mobile responsive behavior
  - Test live stats updates in real-time
  - _Requirements: All_

- [ ] 12. Polish and final touches
  - _Requirements: All_

- [ ] 12.1 Add promotional banner component
  - Create promotional banner with welcome bonus message
  - Style with accent colors and proper spacing
  - Add "Reclamar Ahora" button with hover effect
  - Make dismissible with local storage persistence
  - _Requirements: 1.1_

- [ ] 12.2 Implement error states and empty states
  - Create error message components with retry functionality
  - Design empty state illustrations for no games/data
  - Add friendly error messages in Spanish
  - Implement toast notifications for user feedback
  - _Requirements: All_

- [ ] 12.3 Add micro-interactions and polish
  - Add subtle animations to icons and buttons
  - Implement smooth scroll behavior
  - Add loading states for all async operations
  - Polish spacing and alignment across all breakpoints
  - _Requirements: 1.6_

- [ ] 13. Documentation and deployment preparation
  - _Requirements: All_

- [ ] 13.1 Create component documentation
  - Document all component props and usage examples
  - Create Storybook stories for visual component library
  - Add JSDoc comments to all components and hooks
  - Create README with setup instructions
  - _Requirements: All_

- [ ] 13.2 Prepare for deployment
  - Configure environment variables for production
  - Set up feature flags for gradual rollout
  - Create deployment checklist
  - Prepare rollback plan
  - _Requirements: All_

- [ ] 13.3 Conduct final QA and testing
  - Test on all major browsers (Chrome, Firefox, Safari, Edge)
  - Test on various devices (iOS, Android, desktop)
  - Verify all links and navigation work correctly
  - Check performance metrics meet targets
  - Conduct accessibility audit with automated tools
  - _Requirements: All_
