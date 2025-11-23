export interface Website {
  id: string
  name: string
  url: string
  isActive: boolean
  leads: number
  lastScannedAt: Date
  formsDetected: number
}

export interface FormField {
  id: string
  name: string
  type: string
  label: string
  required: boolean
  placeholder?: string
}

export interface DetectedForm {
  id: string
  name: string
  action: string
  method: string
  fields: FormField[]
}

export const mockWebsites: Website[] = [
  {
    id: '1',
    name: 'E-Commerce Store',
    url: 'https://shop.example.com',
    status: 'active',
    leads: 1243,
    lastScanned: '2 hours ago',
    formsDetected: 3
  },
  {
    id: '2',
    name: 'Landing Page',
    url: 'https://landing.example.com',
    status: 'active',
    leads: 856,
    lastScanned: '5 hours ago',
    formsDetected: 2
  },
  {
    id: '3',
    name: 'Corporate Website',
    url: 'https://corporate.example.com',
    status: 'inactive',
    leads: 432,
    lastScanned: '2 days ago',
    formsDetected: 4
  },
  {
    id: '4',
    name: 'Blog Platform',
    url: 'https://blog.example.com',
    status: 'active',
    leads: 2156,
    lastScanned: '1 hour ago',
    formsDetected: 1
  }
]

export const mockDetectedForms: DetectedForm[] = [
  {
    id: 'form-1',
    name: 'Contact Form',
    action: '/api/contact',
    method: 'POST',
    fields: [
      {
        id: 'f1',
        name: 'name',
        type: 'text',
        label: 'Full Name',
        required: true,
        placeholder: 'John Doe'
      },
      {
        id: 'f2',
        name: 'email',
        type: 'email',
        label: 'Email Address',
        required: true,
        placeholder: 'john@example.com'
      },
      {
        id: 'f3',
        name: 'phone',
        type: 'tel',
        label: 'Phone Number',
        required: false,
        placeholder: '+1 234 567 8900'
      },
      {
        id: 'f4',
        name: 'message',
        type: 'textarea',
        label: 'Message',
        required: true,
        placeholder: 'Your message here...'
      }
    ]
  },
  {
    id: 'form-2',
    name: 'Newsletter Subscription',
    action: '/api/newsletter',
    method: 'POST',
    fields: [
      {
        id: 'f5',
        name: 'email',
        type: 'email',
        label: 'Email Address',
        required: true,
        placeholder: 'your@email.com'
      },
      {
        id: 'f6',
        name: 'firstname',
        type: 'text',
        label: 'First Name',
        required: false,
        placeholder: 'John'
      }
    ]
  },
  {
    id: 'form-3',
    name: 'Lead Capture Form',
    action: '/api/leads',
    method: 'POST',
    fields: [
      {
        id: 'f7',
        name: 'name',
        type: 'text',
        label: 'Full Name',
        required: true
      },
      {
        id: 'f8',
        name: 'email',
        type: 'email',
        label: 'Business Email',
        required: true
      },
      {
        id: 'f9',
        name: 'company',
        type: 'text',
        label: 'Company Name',
        required: true
      },
      {
        id: 'f10',
        name: 'employees',
        type: 'select',
        label: 'Company Size',
        required: true
      },
      {
        id: 'f11',
        name: 'interest',
        type: 'select',
        label: 'Interest Area',
        required: false
      }
    ]
  }
]

export interface AnalyticsData {
  totalLeads: number
  activeWebsites: number
  conversionRate: number
  avgResponseTime: string
  leadsOverTime: { date: string; leads: number }[]
  topWebsites: { name: string; leads: number }[]
  formPerformance: {
    name: string
    submissions: number
    conversionRate: number
  }[]
}

export const mockAnalytics: AnalyticsData = {
  totalLeads: 4687,
  activeWebsites: 3,
  conversionRate: 24.5,
  avgResponseTime: '2.3h',
  leadsOverTime: [
    { date: 'Mon', leads: 145 },
    { date: 'Tue', leads: 182 },
    { date: 'Wed', leads: 234 },
    { date: 'Thu', leads: 198 },
    { date: 'Fri', leads: 267 },
    { date: 'Sat', leads: 156 },
    { date: 'Sun', leads: 123 }
  ],
  topWebsites: [
    { name: 'Blog Platform', leads: 2156 },
    { name: 'E-Commerce Store', leads: 1243 },
    { name: 'Landing Page', leads: 856 },
    { name: 'Corporate Website', leads: 432 }
  ],
  formPerformance: [
    { name: 'Contact Form', submissions: 1543, conversionRate: 28.5 },
    { name: 'Newsletter', submissions: 2341, conversionRate: 31.2 },
    { name: 'Lead Capture', submissions: 803, conversionRate: 18.9 }
  ]
}
