import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react'
import './index.css'

declare global {
  interface Window {
    LeadTracker?: {
      init: (config: any) => void
    }
  }
}

const ContactForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phoneNumber: '',
    option: '',
    message: ''
  })
  const [message, setMessage] = useState({ text: '', type: '' })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  useEffect(() => {
    if (window.LeadTracker) {
      window.LeadTracker.init({
        websiteId: 'ws_01KAQR9M6EFYKXPWRZEBN76AQ4', // Replace with actual website ID
        secretKey:
          'cc910012e55c65277e9bcb8fae1871dbaddd4a2643c910879dd2daae6cf906fb', // Replace with actual secret key
        endpoint: 'http://localhost:3001/api/v1/leads/collect',
        trackAllForms: true,
        debug: true,
        onSuccess: (resp: any) => {
          console.log('Lead captured successfully', resp)
          setMessage({ text: 'Form submitted successfully!', type: 'success' })
          // Reset form
          setFormData({
            email: '',
            password: '',
            phoneNumber: '',
            option: '',
            message: ''
          })
        },
        onError: (err: any) => {
          console.error('Error capturing lead:', err)
          setMessage({
            text: 'Failed to submit form. Please try again later.',
            type: 'error'
          })
        }
      })
    }
  }, [])

  const handleSubmit = () => {}

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Contact Us</h2>
          <p className="mt-2 text-sm text-gray-600">
            Fill out the form below and we'll get back to you soon.
          </p>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-md ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <form
          data-lead-form
          data-form-name="Local Form"
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <div className="mt-1">
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="option"
              className="block text-sm font-medium text-gray-700"
            >
              Select an option
            </label>
            <div className="mt-1">
              <select
                id="option"
                name="option"
                required
                value={formData.option}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select an option</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Your Message
            </label>
            <div className="mt-1">
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                value={formData.message}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<ContactForm />)
