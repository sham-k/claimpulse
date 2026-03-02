export type ClaimStatus = 'submitted' | 'in_review' | 'approved' | 'denied' | 'resubmitted'
export type ClaimPriority = 'high' | 'medium' | 'low'
export type PayerType = 'Medicare' | 'Medicaid' | 'UnitedHealth' | 'Aetna' | 'Humana' | 'BCBS'

export interface Claim {
  id: string
  patientName: string
  patientId: string
  agency: string
  payer: PayerType
  serviceType: 'Home Health' | 'Hospice' | 'Personal Care'
  billedAmount: number
  status: ClaimStatus
  priority: ClaimPriority
  submittedDate: string
  lastUpdated: string
  denialReason?: string
  denialCode?: string
  dos: string // date of service
  episodeDays: number
}

export const MOCK_CLAIMS: Claim[] = [
  {
    id: 'CLM-2024-00441',
    patientName: 'Margaret Okonkwo',
    patientId: 'PT-88234',
    agency: 'Sunrise Home Health',
    payer: 'Medicare',
    serviceType: 'Home Health',
    billedAmount: 4820.0,
    status: 'denied',
    priority: 'high',
    submittedDate: '2024-11-02',
    lastUpdated: '2024-11-14',
    denialReason: 'No qualifying hospital stay of 3 or more days prior to home health admission. Patient does not meet homebound criteria as documented.',
    denialCode: 'CO-50',
    dos: '2024-10-15',
    episodeDays: 60,
  },
  {
    id: 'CLM-2024-00438',
    patientName: 'Robert Vasquez',
    patientId: 'PT-77109',
    agency: 'CareFirst Agency',
    payer: 'UnitedHealth',
    serviceType: 'Home Health',
    billedAmount: 3340.0,
    status: 'denied',
    priority: 'high',
    submittedDate: '2024-10-28',
    lastUpdated: '2024-11-10',
    denialReason: 'Prior authorization not obtained. Service rendered before authorization approval. Authorization request submitted after service date.',
    denialCode: 'CO-197',
    dos: '2024-10-05',
    episodeDays: 30,
  },
  {
    id: 'CLM-2024-00452',
    patientName: 'Dorothy Chen',
    patientId: 'PT-92341',
    agency: 'Lakeside Care Partners',
    payer: 'Humana',
    serviceType: 'Hospice',
    billedAmount: 6100.0,
    status: 'denied',
    priority: 'high',
    submittedDate: '2024-11-05',
    lastUpdated: '2024-11-18',
    denialReason: 'Terminal prognosis not adequately documented. Physician certification does not clearly establish 6-month life expectancy. Additional clinical notes required.',
    denialCode: 'CO-167',
    dos: '2024-10-20',
    episodeDays: 90,
  },
  {
    id: 'CLM-2024-00429',
    patientName: 'James Thornton',
    patientId: 'PT-65502',
    agency: 'Sunrise Home Health',
    payer: 'Medicaid',
    serviceType: 'Personal Care',
    billedAmount: 1890.0,
    status: 'in_review',
    priority: 'medium',
    submittedDate: '2024-11-08',
    lastUpdated: '2024-11-20',
    dos: '2024-10-28',
    episodeDays: 30,
  },
  {
    id: 'CLM-2024-00447',
    patientName: 'Anita Patel',
    patientId: 'PT-81774',
    agency: 'CareFirst Agency',
    payer: 'BCBS',
    serviceType: 'Home Health',
    billedAmount: 2750.0,
    status: 'in_review',
    priority: 'medium',
    submittedDate: '2024-11-12',
    lastUpdated: '2024-11-21',
    dos: '2024-11-01',
    episodeDays: 30,
  },
  {
    id: 'CLM-2024-00433',
    patientName: 'William Okafor',
    patientId: 'PT-70228',
    agency: 'Lakeside Care Partners',
    payer: 'Medicare',
    serviceType: 'Home Health',
    billedAmount: 5200.0,
    status: 'approved',
    priority: 'low',
    submittedDate: '2024-10-20',
    lastUpdated: '2024-11-08',
    dos: '2024-10-01',
    episodeDays: 60,
  },
  {
    id: 'CLM-2024-00421',
    patientName: 'Susan Holloway',
    patientId: 'PT-58834',
    agency: 'Sunrise Home Health',
    payer: 'Aetna',
    serviceType: 'Hospice',
    billedAmount: 7400.0,
    status: 'approved',
    priority: 'low',
    submittedDate: '2024-10-15',
    lastUpdated: '2024-11-02',
    dos: '2024-10-01',
    episodeDays: 90,
  },
  {
    id: 'CLM-2024-00461',
    patientName: 'Carlos Mendez',
    patientId: 'PT-98712',
    agency: 'CareFirst Agency',
    payer: 'Medicare',
    serviceType: 'Home Health',
    billedAmount: 3800.0,
    status: 'submitted',
    priority: 'medium',
    submittedDate: '2024-11-19',
    lastUpdated: '2024-11-19',
    dos: '2024-11-10',
    episodeDays: 30,
  },
  {
    id: 'CLM-2024-00418',
    patientName: 'Patricia Nwosu',
    patientId: 'PT-44219',
    agency: 'Lakeside Care Partners',
    payer: 'UnitedHealth',
    serviceType: 'Personal Care',
    billedAmount: 2100.0,
    status: 'resubmitted',
    priority: 'medium',
    submittedDate: '2024-11-16',
    lastUpdated: '2024-11-22',
    denialReason: 'Original denial: duplicate claim submission.',
    denialCode: 'CO-18',
    dos: '2024-10-15',
    episodeDays: 30,
  },
]

export const METRICS = {
  totalBilled: 142_880,
  totalRecovered: 98_450,
  atRisk: 24_260,
  denialRate: 18.4,
  avgDaysToReimbursement: 22,
  claimsThisMonth: 47,
}
