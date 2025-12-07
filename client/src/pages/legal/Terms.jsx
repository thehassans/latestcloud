import { Helmet } from 'react-helmet-async'

export default function Terms() {
  return (
    <>
      <Helmet><title>Terms of Service - Magnetic Clouds</title></Helmet>
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-dark-500">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using Magnetic Clouds services, you accept and agree to be bound by these Terms of Service.</p>
          
          <h2>2. Services</h2>
          <p>Magnetic Clouds provides web hosting, domain registration, VPS, cloud servers, and related services.</p>
          
          <h2>3. Account Registration</h2>
          <p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials.</p>
          
          <h2>4. Payment Terms</h2>
          <p>All services are billed in advance. Prices are subject to change with 30 days notice.</p>
          
          <h2>5. Acceptable Use</h2>
          <p>You agree not to use our services for any illegal or unauthorized purpose. This includes but is not limited to:</p>
          <ul>
            <li>Hosting malicious content or malware</li>
            <li>Sending spam or unsolicited emails</li>
            <li>Infringing on intellectual property rights</li>
            <li>Mining cryptocurrency without authorization</li>
          </ul>
          
          <h2>6. Service Level Agreement</h2>
          <p>We guarantee 99.9% uptime for all hosting services. Credits will be issued for any downtime exceeding this guarantee.</p>
          
          <h2>7. Refund Policy</h2>
          <p>We offer a 45-day money-back guarantee on all shared hosting plans. VPS and dedicated servers are eligible for refunds within 7 days.</p>
          
          <h2>8. Termination</h2>
          <p>We reserve the right to terminate accounts that violate these terms without prior notice.</p>
          
          <h2>9. Limitation of Liability</h2>
          <p>Magnetic Clouds shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.</p>
          
          <h2>10. Contact</h2>
          <p>For questions about these terms, contact us at legal@magneticclouds.com</p>
        </div>
      </div>
    </>
  )
}
