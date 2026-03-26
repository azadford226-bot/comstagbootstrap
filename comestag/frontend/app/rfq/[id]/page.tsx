'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, DollarSign, Clock, Users, Send, Eye,
  CheckCircle, Building2, Calendar, Tag,
  AlertCircle, Lock, FileText, Shield, MessageCircle
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { getRfq, type Rfq } from '@/lib/api/rfq'
import { getProfile, isOrganizationProfile } from '@/lib/api/profile'
import { RFQ_STATUS_CONFIG } from '@/components/rfq/rfq-status-badge'

/** Matches API / DB: OPEN → AWARDED or CLOSED; CANCELLED treated as terminal like CLOSED */
const STATUS_STEPS = ['OPEN', 'AWARDED', 'CLOSED'] as const

const OWNER_ACTIONS_BY_STATUS: Record<string, string> = {
  OPEN: 'Review incoming proposals, use Messages to clarify scope, then award a vendor or close the RFQ without an award.',
  AWARDED: 'Work with the awarded vendor on delivery; you can message via the RFQ thread. Mark follow-ups in your internal process.',
  CLOSED: 'This RFQ is closed — read-only for participants.',
  CANCELLED: 'This RFQ was cancelled — read-only.',
}

function formatCurrency(amount: number | null, currency: string) {
  if (!amount) return 'Not specified'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return 'Not set'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function timeRemaining(deadline: string | null) {
  if (!deadline) return null
  const diff = new Date(deadline).getTime() - Date.now()
  if (diff <= 0) return 'Expired'
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Due today'
  if (days === 1) return '1 day left'
  return `${days} days left`
}

export default function RfqDetailPage() {
  const params = useParams()
  const rfqId = params.id as string

  const [rfq, setRfq] = useState<Rfq | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [myOrgId, setMyOrgId] = useState<string | null>(null)

  useEffect(() => {
    getProfile()
      .then((res) => {
        if (res.success && res.data && isOrganizationProfile(res.data)) {
          setMyOrgId(res.data.id)
        } else if (res.success && res.data && 'id' in res.data) {
          setMyOrgId((res.data as { id: string }).id)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!rfqId) return
    setLoading(true)
    getRfq(rfqId)
      .then((result) => {
        if (result.success && result.data) {
          setRfq(result.data)
        } else {
          setError(result.message || 'RFQ not found')
        }
      })
      .catch(() => setError('Failed to load RFQ'))
      .finally(() => setLoading(false))
  }, [rfqId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-5 w-32" />
          <div className="bg-white rounded-xl p-6 space-y-4">
            <Skeleton className="h-7 w-2/3" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-28" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl p-6 space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !rfq) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/rfq" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to RFQs
          </Link>
          <div className="bg-white rounded-xl border border-red-200 p-8 text-center">
            <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Error loading RFQ</h2>
            <p className="text-gray-500">{error || 'RFQ not found'}</p>
          </div>
        </div>
      </div>
    )
  }

  const statusCfg = RFQ_STATUS_CONFIG[rfq.status] || RFQ_STATUS_CONFIG.OPEN
  const StatusIcon = statusCfg.icon
  const remaining = timeRemaining(rfq.deadline)
  const normalizedStatus = rfq.status === 'CANCELLED' ? 'CLOSED' : rfq.status
  const currentStepIndex = Math.max(
    0,
    STATUS_STEPS.indexOf(normalizedStatus as (typeof STATUS_STEPS)[number])
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link href="/rfq" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to RFQs
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusCfg.className}`}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    {statusCfg.label}
                  </span>
                  {rfq.visibility === 'INVITE_ONLY' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium">
                      <Shield className="h-3 w-3" />
                      Invite Only
                    </span>
                  )}
                  {rfq.ndaRequired && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-medium">
                      <Lock className="h-3 w-3" />
                      NDA Required
                    </span>
                  )}
                  {rfq.isOwner && (
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-medium">
                      Your RFQ
                    </span>
                  )}
                  {rfq.hasSubmitted && !rfq.isOwner && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium">
                      <CheckCircle className="h-3 w-3" />
                      Proposal Sent
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{rfq.title}</h1>
              </div>
            </div>

            {/* Status Progress (aligned to RFQ schema) */}
            <div className="flex items-center gap-0 mb-2">
              {STATUS_STEPS.map((step, i) => {
                const isActive = i <= currentStepIndex
                const isCurrent = STATUS_STEPS[currentStepIndex] === step
                return (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          isActive
                            ? isCurrent
                              ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                              : 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {i + 1}
                      </div>
                      <span className={`text-[11px] mt-1 font-medium ${isActive ? 'text-blue-700' : 'text-gray-400'}`}>
                        {step === 'OPEN' ? 'Open' : step === 'AWARDED' ? 'Awarded' : 'Closed'}
                      </span>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 mt-[-14px] ${
                          i < currentStepIndex ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            {/* State machine diagram (schema-aligned) */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">RFQ lifecycle (state machine)</p>
              <div className="rounded-lg bg-slate-50 border border-slate-100 p-3 overflow-x-auto" aria-hidden>
                <svg viewBox="0 0 420 100" className="w-full max-w-lg h-[100px] text-gray-700">
                  <defs>
                    <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                      <polygon points="0 0, 8 3, 0 6" fill="currentColor" />
                    </marker>
                  </defs>
                  <rect x="8" y="28" width="88" height="36" rx="6" fill="#fff" stroke="#94a3b8" strokeWidth="1.5" />
                  <text x="52" y="50" textAnchor="middle" className="fill-gray-800 text-[11px] font-semibold">OPEN</text>
                  <line x1="96" y1="46" x2="128" y2="46" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                  <rect x="128" y="28" width="100" height="36" rx="6" fill="#fff" stroke="#94a3b8" strokeWidth="1.5" />
                  <text x="178" y="50" textAnchor="middle" className="fill-gray-800 text-[11px] font-semibold">AWARDED</text>
                  <line x1="228" y1="46" x2="260" y2="46" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                  <rect x="260" y="28" width="88" height="36" rx="6" fill="#fff" stroke="#94a3b8" strokeWidth="1.5" />
                  <text x="304" y="50" textAnchor="middle" className="fill-gray-800 text-[11px] font-semibold">CLOSED</text>
                  <text x="52" y="18" textAnchor="middle" className="fill-gray-500 text-[9px]">Accept proposals</text>
                  <text x="178" y="18" textAnchor="middle" className="fill-gray-500 text-[9px]">Select vendor</text>
                  <text x="304" y="18" textAnchor="middle" className="fill-gray-500 text-[9px]">Terminal</text>
                  <path d="M 52 64 L 52 78 L 304 78 L 304 64" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#arrowhead)" />
                  <text x="178" y="92" textAnchor="middle" className="fill-gray-500 text-[9px]">May close without award → CLOSED</text>
                </svg>
              </div>
              <p className="text-[11px] text-gray-500 mt-2">
                States match the RFQ API: <code className="bg-gray-100 px-1 rounded">OPEN</code>,{' '}
                <code className="bg-gray-100 px-1 rounded">AWARDED</code>,{' '}
                <code className="bg-gray-100 px-1 rounded">CLOSED</code>,{' '}
                <code className="bg-gray-100 px-1 rounded">CANCELLED</code>.
              </p>
              {rfq.isOwner && (
                <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/80 px-3 py-2 text-sm text-blue-950">
                  <span className="font-semibold">Owner actions ({rfq.status}): </span>
                  {OWNER_ACTIONS_BY_STATUS[rfq.status] ?? OWNER_ACTIONS_BY_STATUS.OPEN}
                </div>
              )}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            <div className="px-5 py-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                <DollarSign className="h-3.5 w-3.5" />
                Budget
              </div>
              <p className="font-semibold text-gray-900">{formatCurrency(rfq.budget, rfq.budgetCurrency)}</p>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                <Calendar className="h-3.5 w-3.5" />
                Deadline
              </div>
              <p className="font-semibold text-gray-900">{formatDate(rfq.deadline)}</p>
              {remaining && (
                <p className={`text-xs mt-0.5 ${remaining === 'Expired' ? 'text-red-500' : 'text-amber-600'}`}>
                  {remaining}
                </p>
              )}
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                <Users className="h-3.5 w-3.5" />
                Proposals
              </div>
              <p className="font-semibold text-gray-900">{rfq.proposalCount}</p>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                <Tag className="h-3.5 w-3.5" />
                Category
              </div>
              <p className="font-semibold text-gray-900">{rfq.category || 'General'}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{rfq.description}</p>
            </div>

            {/* Requirements */}
            {rfq.requirements && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gray-400" />
                  Requirements
                </h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{rfq.requirements}</div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                {rfq.isOwner ? (
                  <>
                    <Link
                      href={`/rfq/${rfq.id}/proposals`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      View Proposals ({rfq.proposalCount})
                    </Link>
                  </>
                ) : rfq.status === 'OPEN' && !rfq.hasSubmitted ? (
                  <Link
                    href={`/rfq/${rfq.id}/submit`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    Submit Proposal
                  </Link>
                ) : rfq.hasSubmitted ? (
                  <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                    <CheckCircle className="h-4 w-4" />
                    Proposal Submitted
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-500 rounded-lg text-sm">
                    <Lock className="h-4 w-4" />
                    {rfq.status === 'AWARDED' ? 'RFQ has been awarded' : 'RFQ is closed'}
                  </div>
                )}

                {/* Thread-based discussion link */}
                {rfq.status === 'OPEN' && (
                  <Link
                    href={
                      myOrgId && !rfq.isOwner
                        ? `/messages?rfq=${rfq.id}&ctx=${encodeURIComponent(`${rfq.id}:${myOrgId}`)}&subject=${encodeURIComponent(`RFQ: ${rfq.title}`)}`
                        : `/messages?rfq=${rfq.id}&subject=${encodeURIComponent(`RFQ: ${rfq.title}`)}`
                    }
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Open organization thread
                  </Link>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Details</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Posted</dt>
                  <dd className="text-gray-900 font-medium">{formatDate(rfq.createdAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Last Updated</dt>
                  <dd className="text-gray-900 font-medium">{formatDate(rfq.updatedAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Visibility</dt>
                  <dd className="text-gray-900 font-medium capitalize">{rfq.visibility?.toLowerCase().replace('_', ' ') || 'Public'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Currency</dt>
                  <dd className="text-gray-900 font-medium">{rfq.budgetCurrency}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
