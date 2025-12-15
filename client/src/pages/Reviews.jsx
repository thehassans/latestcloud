import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, ThumbsUp, Filter, ChevronDown, ChevronLeft, ChevronRight, Server, Globe, Shield, Mail, Cloud, Database } from 'lucide-react'
import clsx from 'clsx'

// Name lists for generating reviews
const maleFirstNames = ['Ahmed', 'Hassan', 'Michael', 'David', 'James', 'Robert', 'John', 'William', 'Richard', 'Joseph', 'Thomas', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Edward', 'Jason', 'Jeffrey', 'Ryan', 'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon', 'Benjamin', 'Samuel', 'Raymond', 'Gregory', 'Frank', 'Alexander', 'Patrick', 'Jack', 'Dennis', 'Raj', 'Amir', 'Mohammed', 'Ali', 'Omar', 'Yusuf', 'Ibrahim', 'Tariq', 'Karim', 'Rashid']
const femaleFirstNames = ['Sarah', 'Emily', 'Lisa', 'Amanda', 'Sophie', 'Jennifer', 'Jessica', 'Ashley', 'Samantha', 'Elizabeth', 'Michelle', 'Kimberly', 'Melissa', 'Stephanie', 'Nicole', 'Angela', 'Christina', 'Rebecca', 'Laura', 'Rachel', 'Katherine', 'Nancy', 'Betty', 'Margaret', 'Sandra', 'Dorothy', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Helen', 'Deborah', 'Brenda', 'Amy', 'Anna', 'Olivia', 'Emma', 'Ava', 'Isabella', 'Mia', 'Charlotte', 'Fatima', 'Aisha', 'Zainab', 'Nadia', 'Layla', 'Priya', 'Ananya', 'Mei', 'Yuki']
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Khan', 'Patel', 'Singh', 'Kumar', 'Chen', 'Wang', 'Kim', 'Park', 'Tanaka', 'Suzuki']

const locations = ['New York, USA', 'Los Angeles, USA', 'Chicago, USA', 'Houston, USA', 'Miami, USA', 'Seattle, USA', 'Boston, USA', 'Austin, USA', 'Denver, USA', 'San Francisco, USA', 'London, UK', 'Manchester, UK', 'Birmingham, UK', 'Edinburgh, UK', 'Dublin, Ireland', 'Paris, France', 'Berlin, Germany', 'Munich, Germany', 'Amsterdam, Netherlands', 'Stockholm, Sweden', 'Oslo, Norway', 'Copenhagen, Denmark', 'Helsinki, Finland', 'Sydney, Australia', 'Melbourne, Australia', 'Brisbane, Australia', 'Toronto, Canada', 'Vancouver, Canada', 'Montreal, Canada', 'Singapore', 'Hong Kong', 'Tokyo, Japan', 'Seoul, South Korea', 'Mumbai, India', 'Bangalore, India', 'Delhi, India', 'Dubai, UAE', 'Abu Dhabi, UAE', 'Dhaka, Bangladesh', 'Chittagong, Bangladesh', 'Karachi, Pakistan', 'Lagos, Nigeria', 'Cairo, Egypt', 'Johannesburg, South Africa', 'São Paulo, Brazil', 'Mexico City, Mexico', 'Buenos Aires, Argentina']

const roles = ['CEO', 'CTO', 'Founder', 'Co-Founder', 'Developer', 'Lead Developer', 'Senior Developer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'DevOps Engineer', 'System Administrator', 'IT Director', 'IT Manager', 'Technical Lead', 'Project Manager', 'Product Manager', 'Marketing Director', 'Marketing Manager', 'Digital Marketer', 'SEO Specialist', 'Content Creator', 'Blogger', 'Influencer', 'E-commerce Owner', 'Online Store Owner', 'Business Owner', 'Entrepreneur', 'Startup Founder', 'Agency Owner', 'Web Designer', 'Graphic Designer', 'UX Designer', 'Freelancer', 'Consultant', 'Data Scientist', 'Game Developer', 'App Developer', 'Software Engineer', 'Security Analyst']

const services = [
  { name: 'VPS Hosting', icon: Server },
  { name: 'Cloud Server', icon: Cloud },
  { name: 'Dedicated Server', icon: Database },
  { name: 'Domain Registration', icon: Globe },
  { name: 'SSL Certificate', icon: Shield },
  { name: 'Professional Email', icon: Mail },
  { name: 'Website Backup', icon: Database },
  { name: 'Web Development', icon: Globe },
]

const reviewTitles = [
  'Best hosting decision we ever made', 'Enterprise-grade performance', 'Incredible speed and uptime',
  'Perfect for our business', 'Exceeded all expectations', 'Amazing customer support',
  'Rock-solid infrastructure', 'Highly recommend!', 'Game changer for our website',
  'Worth every penny', 'Fast, reliable, and secure', 'Outstanding service quality',
  'Best value hosting provider', 'Seamless migration experience', 'Top-notch performance',
  'Excellent for e-commerce', 'Perfect for developers', 'Great for agencies',
  'Scalable and powerful', 'Security you can trust', 'Lightning fast servers',
  'Professional and reliable', 'Best support team ever', 'Fantastic experience overall',
  'Our website has never been faster', 'Flawless uptime record', 'Great for WordPress',
  'Perfect for high-traffic sites', 'Affordable enterprise hosting', 'Simply the best'
]

const reviewTexts = [
  'Migrating to Magnetic Clouds was the best decision for our business. The speed improvement is noticeable and our customers love it.',
  'The support team is incredibly responsive. They helped us optimize our server configuration and now our site loads in under 2 seconds.',
  'We\'ve been hosting with them for over 2 years now. Zero downtime and consistent performance. Highly recommended!',
  'The pricing is very competitive for the quality of service. NVMe storage, free SSL, and excellent support.',
  'Our e-commerce store handles thousands of orders daily without any issues. The infrastructure scales beautifully.',
  'As a developer, I appreciate the technical details. Latest PHP, MySQL 8, Redis caching - everything a modern app needs.',
  'The migration was completely free and they handled everything. Our site was up and running in hours.',
  'DDoS protection saved our business during a major attack. Their security team responded immediately.',
  'We manage 50+ client websites on their platform. The reseller program is excellent with great margins.',
  'The control panel is intuitive and powerful. Even non-technical team members can manage basic tasks.',
  'Automatic backups have saved us multiple times. Peace of mind knowing our data is always safe.',
  'The global CDN makes our website fast everywhere. Customers from Asia to Europe all get great speeds.',
  'Started with a small VPS, now running dedicated servers. They grew with our business seamlessly.',
  'Email deliverability improved significantly after switching. No more emails going to spam.',
  'The staging environment feature is perfect for testing updates before going live.',
  'Their API documentation is excellent. We integrated server management into our workflow easily.',
  'WordPress hosting is optimized perfectly. Our blog loads instantly and handles traffic spikes well.',
  'The money-back guarantee gave us confidence to try. After the first week, we knew we made the right choice.',
  'Customer support actually understands technical issues. No scripted responses, just real solutions.',
  'The uptime guarantee is real. We\'ve tracked 99.99% uptime over the past year.',
]

// Mulberry32 seeded random number generator for better distribution
const mulberry32 = (seed) => {
  return () => {
    let t = seed += 0x6D2B79F5
    t = Math.imul(t ^ t >>> 15, t | 1)
    t ^= t + Math.imul(t ^ t >>> 7, t | 61)
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

// Generate all 2847 reviews
const generateReviews = () => {
  const allReviews = []
  const totalReviews = 2847
  
  for (let i = 0; i < totalReviews; i++) {
    // Create unique random generator for each review
    const rand = mulberry32(i * 12345 + 67890)
    
    // Determine gender (50/50)
    const isFemale = rand() > 0.5
    const firstNames = isFemale ? femaleFirstNames : maleFirstNames
    
    const firstName = firstNames[Math.floor(rand() * firstNames.length)]
    const lastName = lastNames[Math.floor(rand() * lastNames.length)]
    const name = `${firstName} ${lastName}`
    
    // Determine if review has image (70% have images)
    const hasImage = rand() > 0.3
    const photoIndex = Math.floor(rand() * 99) + 1 // 1-99
    const photoGender = isFemale ? 'women' : 'men'
    
    // Rating: Only 4, 4.5, or 5 stars (70% 5-star, 15% 4.5-star, 15% 4-star)
    const ratingRand = rand()
    let rating
    if (ratingRand < 0.70) rating = 5
    else if (ratingRand < 0.85) rating = 4.5
    else rating = 4
    
    // Generate date (spread over last 2 years)
    const daysAgo = Math.floor(rand() * 730) // 0-730 days ago
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    const dateStr = date.toISOString().split('T')[0]
    
    // Select service
    const service = services[Math.floor(rand() * services.length)]
    
    allReviews.push({
      id: i + 1,
      name,
      role: roles[Math.floor(rand() * roles.length)],
      location: locations[Math.floor(rand() * locations.length)],
      rating,
      date: dateStr,
      title: reviewTitles[Math.floor(rand() * reviewTitles.length)],
      review: reviewTexts[Math.floor(rand() * reviewTexts.length)],
      img: hasImage ? `https://randomuser.me/api/portraits/${photoGender}/${photoIndex}.jpg` : null,
      initial: !hasImage ? `${firstName[0]}${lastName[0]}` : null,
      verified: rand() > 0.05, // 95% verified
      helpful: Math.floor(rand() * 300) + 1,
      service: service.name,
      serviceIcon: service.icon
    })
  }
  
  // Sort by date (most recent first)
  return allReviews.sort((a, b) => new Date(b.date) - new Date(a.date))
}

const reviews = generateReviews()

const stats = {
  total: 2847,
  average: 4.8,
  distribution: [
    { stars: 5, count: 1993, percentage: 70 },
    { stars: 4.5, count: 427, percentage: 15 },
    { stars: 4, count: 427, percentage: 15 }
  ]
}

const REVIEWS_PER_PAGE = 12

export default function Reviews() {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [helpfulClicks, setHelpfulClicks] = useState({})
  const [currentPage, setCurrentPage] = useState(1)

  const handleHelpful = (reviewId) => {
    setHelpfulClicks(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }))
  }

  const filteredReviews = useMemo(() => {
    return reviews
      .filter(r => filter === 'all' || r.rating === parseFloat(filter))
      .sort((a, b) => {
        if (sortBy === 'recent') return new Date(b.date) - new Date(a.date)
        if (sortBy === 'helpful') return b.helpful - a.helpful
        if (sortBy === 'highest') return b.rating - a.rating
        return 0
      })
  }, [filter, sortBy])

  const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE)
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE)

  // Reset to page 1 when filter changes
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-500/10 via-purple-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-display">
              Customer <span className="text-gradient">Reviews</span>
            </h1>
            <p className="mt-4 text-xl text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
              See what our customers say about their experience with Magnetic Clouds
            </p>

            {/* Overall Rating */}
            <div className="mt-10 flex flex-col items-center">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="mt-2 text-3xl font-bold">{stats.average}/5</p>
              <p className="text-dark-500">Based on {stats.total.toLocaleString()} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="mt-8 max-w-md mx-auto space-y-2">
              {stats.distribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <span className="w-8 text-sm text-dark-500">{item.stars}★</span>
                  <div className="flex-1 h-3 bg-dark-200 dark:bg-dark-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.8, delay: (5 - item.stars) * 0.1 }}
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                    />
                  </div>
                  <span className="w-12 text-sm text-dark-500 text-right">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-dark-200 dark:border-dark-800 sticky top-16 bg-white/90 dark:bg-dark-950/90 backdrop-blur-lg z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-dark-500" />
              <span className="text-sm font-medium">Filter:</span>
              <div className="flex gap-2">
                {['all', '5', '4.5', '4'].map((f) => (
                  <button
                    key={f}
                    onClick={() => handleFilterChange(f)}
                    className={clsx(
                      'px-3 py-1.5 text-sm rounded-lg transition-colors',
                      filter === f
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700'
                    )}
                  >
                    {f === 'all' ? 'All' : `${f}★`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-dark-100 dark:bg-dark-800 px-4 py-1.5 pr-8 rounded-lg text-sm cursor-pointer"
                >
                  <option value="recent">Most Recent</option>
                  <option value="helpful">Most Helpful</option>
                  <option value="highest">Highest Rated</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedReviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-lg border border-dark-200 dark:border-dark-700 hover:shadow-xl transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {review.img ? (
                      <img src={review.img} alt={review.name} className="w-full h-full object-cover" />
                    ) : (
                      review.initial
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{review.name}</h3>
                      {review.verified && (
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-dark-500 truncate">{review.role}</p>
                    <p className="text-xs text-dark-400">{review.location}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFull = star <= Math.floor(review.rating)
                      const isHalf = star === Math.ceil(review.rating) && review.rating % 1 !== 0
                      return (
                        <div key={star} className="relative">
                          <Star className={clsx('w-4 h-4', isFull || isHalf ? 'text-yellow-500' : 'text-dark-300', isFull && 'fill-yellow-500')} />
                          {isHalf && (
                            <div className="absolute inset-0 overflow-hidden w-1/2">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <span className="text-xs text-dark-400">
                    {new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                {/* Service Purchased */}
                {review.service && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-medium">
                    {review.serviceIcon && <review.serviceIcon className="w-3.5 h-3.5" />}
                    {review.service}
                  </div>
                )}

                {/* Content */}
                <h4 className="mt-3 font-semibold text-dark-900 dark:text-white">
                  {review.title}
                </h4>
                <p className="mt-2 text-dark-600 dark:text-dark-400 text-sm leading-relaxed">
                  {review.review}
                </p>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-dark-200 dark:border-dark-700 flex items-center justify-between">
                  <button 
                    onClick={() => handleHelpful(review.id)}
                    className={clsx(
                      "flex items-center gap-2 text-sm transition-colors",
                      helpfulClicks[review.id] 
                        ? "text-primary-500" 
                        : "text-dark-500 hover:text-primary-500"
                    )}
                  >
                    <ThumbsUp className={clsx("w-4 h-4", helpfulClicks[review.id] && "fill-primary-500")} />
                    Helpful ({review.helpful + (helpfulClicks[review.id] ? 1 : 0)})
                  </button>
                  <Quote className="w-5 h-5 text-dark-300" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-col items-center gap-4">
              <p className="text-sm text-dark-500">
                Showing {startIndex + 1}-{Math.min(startIndex + REVIEWS_PER_PAGE, filteredReviews.length)} of {filteredReviews.length.toLocaleString()} reviews
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 400, behavior: 'smooth' }) }}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {currentPage > 3 && (
                    <>
                      <button onClick={() => { setCurrentPage(1); window.scrollTo({ top: 400, behavior: 'smooth' }) }} className="px-3 py-1.5 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800">1</button>
                      {currentPage > 4 && <span className="px-2 text-dark-400">...</span>}
                    </>
                  )}
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    if (pageNum < 1 || pageNum > totalPages) return null
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => { setCurrentPage(pageNum); window.scrollTo({ top: 400, behavior: 'smooth' }) }}
                        className={clsx(
                          "px-3 py-1.5 rounded-lg transition-colors",
                          currentPage === pageNum
                            ? "bg-primary-500 text-white"
                            : "hover:bg-dark-100 dark:hover:bg-dark-800"
                        )}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && <span className="px-2 text-dark-400">...</span>}
                      <button onClick={() => { setCurrentPage(totalPages); window.scrollTo({ top: 400, behavior: 'smooth' }) }} className="px-3 py-1.5 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800">{totalPages}</button>
                    </>
                  )}
                </div>
                
                <button
                  onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 400, behavior: 'smooth' }) }}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold font-display">Join Thousands of Happy Customers</h2>
          <p className="mt-4 text-lg text-white/80">
            Experience the Magnetic Clouds difference with our 30-day money-back guarantee.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="/hosting" className="bg-white text-primary-600 px-8 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-colors">
              Get Started Today
            </a>
            <a href="/contact" className="border-2 border-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors">
              Contact Sales
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
