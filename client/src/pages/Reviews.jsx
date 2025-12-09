import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, ThumbsUp, Filter, ChevronDown } from 'lucide-react'
import clsx from 'clsx'

const reviews = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'CEO, TechStart Inc.',
    location: 'New York, USA',
    rating: 5,
    date: '2024-12-01',
    title: 'Best hosting decision we ever made',
    review: 'Migrating our entire infrastructure to Magnetic Clouds was seamless. Their support team guided us through every step, and our site speed improved by 300%. The uptime has been flawless for over a year now.',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
    verified: true,
    helpful: 234
  },
  {
    id: 2,
    name: 'James Kim',
    role: 'Lead Developer',
    location: 'San Francisco, USA',
    rating: 5,
    date: '2024-11-28',
    title: 'Enterprise-grade performance at startup prices',
    review: 'As a developer, I appreciate the technical excellence. NVMe storage, latest PHP versions, free SSL, and their API is fantastic. Been using them for 3 years and never looked back.',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
    verified: true,
    helpful: 189
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'E-commerce Owner',
    location: 'Miami, USA',
    rating: 5,
    date: '2024-11-25',
    title: 'Our online store has never been faster',
    review: 'During Black Friday, our store handled 10x traffic without any issues. The cloud infrastructure scaled automatically. Customer support responded in under 5 minutes when I had questions.',
    img: null,
    initial: 'ER',
    verified: true,
    helpful: 156
  },
  {
    id: 4,
    name: 'Michael Thompson',
    role: 'IT Director',
    location: 'London, UK',
    rating: 5,
    date: '2024-11-20',
    title: 'Security and compliance made easy',
    review: 'For our healthcare company, security is paramount. Magnetic Clouds provides HIPAA-compliant hosting with automatic backups and DDoS protection. Their security team is exceptional.',
    img: 'https://randomuser.me/api/portraits/men/67.jpg',
    verified: true,
    helpful: 142
  },
  {
    id: 5,
    name: 'Lisa Park',
    role: 'Blogger & Influencer',
    location: 'Toronto, Canada',
    rating: 5,
    date: '2024-11-18',
    title: 'Perfect for content creators',
    review: 'Started with their basic plan and now running multiple sites. The WordPress optimization is incredible - my pages load in under 1 second. The pricing is fair and transparent.',
    img: null,
    initial: 'LP',
    verified: true,
    helpful: 128
  },
  {
    id: 6,
    name: 'David Chen',
    role: 'Founder, SaaS Platform',
    location: 'Singapore',
    rating: 5,
    date: '2024-11-15',
    title: 'Scaled from 100 to 100,000 users',
    review: 'We started with a small VPS and now run dedicated servers. The migration assistance was free, and they helped optimize our database queries. True partners in our growth.',
    img: 'https://randomuser.me/api/portraits/men/52.jpg',
    verified: true,
    helpful: 198
  },
  {
    id: 7,
    name: 'Amanda Foster',
    role: 'Web Designer',
    location: 'Sydney, Australia',
    rating: 4,
    date: '2024-11-12',
    title: 'Great for agencies',
    review: 'Managing 50+ client sites is a breeze with their reseller program. The white-label options and client management tools are exactly what agencies need. Only wish they had more data centers in APAC.',
    img: 'https://randomuser.me/api/portraits/women/68.jpg',
    verified: true,
    helpful: 87
  },
  {
    id: 8,
    name: 'Robert Martinez',
    role: 'Game Developer',
    location: 'Austin, USA',
    rating: 5,
    date: '2024-11-10',
    title: 'Low latency game servers',
    review: 'Running multiplayer game servers requires rock-solid infrastructure. Magnetic Clouds delivers <20ms latency and their DDoS protection has saved us multiple times from attacks.',
    img: null,
    initial: 'RM',
    verified: true,
    helpful: 165
  },
  {
    id: 9,
    name: 'Sophie Williams',
    role: 'Marketing Director',
    location: 'Berlin, Germany',
    rating: 5,
    date: '2024-11-08',
    title: 'GDPR compliant and reliable',
    review: 'For our EU operations, GDPR compliance was non-negotiable. Their European data centers and privacy features gave us peace of mind. The German support team is also very responsive.',
    img: 'https://randomuser.me/api/portraits/women/33.jpg',
    verified: true,
    helpful: 112
  },
  {
    id: 10,
    name: 'Alex Johnson',
    role: 'Freelance Developer',
    location: 'Chicago, USA',
    rating: 5,
    date: '2024-11-05',
    title: 'Best value for money',
    review: 'Compared at least 10 hosting providers before choosing Magnetic Clouds. The performance-to-price ratio is unbeatable. Free migrations, free SSL, free backups - what more could you ask for?',
    img: 'https://randomuser.me/api/portraits/men/22.jpg',
    verified: true,
    helpful: 203
  },
  {
    id: 11,
    name: 'Jennifer Lee',
    role: 'Non-profit Director',
    location: 'Seattle, USA',
    rating: 5,
    date: '2024-11-02',
    title: 'Excellent non-profit discount',
    review: 'They offer a 50% discount for registered non-profits. Our charity website runs smoothly, and the support team went above and beyond to help us set up donation pages.',
    img: null,
    initial: 'JL',
    verified: true,
    helpful: 76
  },
  {
    id: 12,
    name: 'Chris Anderson',
    role: 'Agency Owner',
    location: 'Dubai, UAE',
    rating: 5,
    date: '2024-10-30',
    title: '24/7 support that actually works',
    review: 'Had an urgent issue at 3 AM. Got a response in 2 minutes and the problem was resolved in 15 minutes. This is what premium support looks like. Worth every penny.',
    img: 'https://randomuser.me/api/portraits/men/45.jpg',
    verified: true,
    helpful: 145
  }
]

const stats = {
  total: 2847,
  average: 4.9,
  distribution: [
    { stars: 5, count: 2456, percentage: 86 },
    { stars: 4, count: 285, percentage: 10 },
    { stars: 3, count: 71, percentage: 3 },
    { stars: 2, count: 28, percentage: 1 },
    { stars: 1, count: 7, percentage: 0 }
  ]
}

export default function Reviews() {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  const filteredReviews = reviews
    .filter(r => filter === 'all' || r.rating === parseInt(filter))
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.date) - new Date(a.date)
      if (sortBy === 'helpful') return b.helpful - a.helpful
      if (sortBy === 'highest') return b.rating - a.rating
      return 0
    })

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
                {['all', '5', '4', '3', '2', '1'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
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
            {filteredReviews.map((review, i) => (
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
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={clsx(
                          'w-4 h-4',
                          star <= review.rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-dark-300'
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-dark-400">
                    {new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                {/* Content */}
                <h4 className="mt-4 font-semibold text-dark-900 dark:text-white">
                  {review.title}
                </h4>
                <p className="mt-2 text-dark-600 dark:text-dark-400 text-sm leading-relaxed">
                  {review.review}
                </p>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-dark-200 dark:border-dark-700 flex items-center justify-between">
                  <button className="flex items-center gap-2 text-sm text-dark-500 hover:text-primary-500 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    Helpful ({review.helpful})
                  </button>
                  <Quote className="w-5 h-5 text-dark-300" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
            <button className="btn-outline">
              Load More Reviews
            </button>
          </div>
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
