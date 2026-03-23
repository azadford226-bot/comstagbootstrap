'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, DollarSign, Clock, Users, CheckCircle, XCircle,
  Award, Loader2, AlertCircle, FileText, Star
} from 'lucide-react'
import {
  getRfq, listProposals, awardRfq,
  type Rfq, type RfqProposal
} from '@/lib/api/rfq'

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  SUBMITTED: { label: 'Submitted', cls: 'bg-gray-100 text-gray-700' },
  SHORTLISTED: { label: 'Shortlisted', cls: 'bg-amber-100 text-amber-700' },
  ACCEPTED: { label: 'Accepted', cls: 'bg-green-100 text-green-700' },
  REJECTED: { label: 'Rejected', cls: 'bg-red-100 text-red-700' },
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function RfqProposalsPage() {
  const params = useParams()
  const rfqId = params.id as string

  const [rfq, setRfq] = useState<Rfq | null>(null)
  const [proposals, setProposals] = useState<RfqProposal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [awarding, setAwarding] = useState<string | null>(null)
  const [awardSuccess, setAwardSuccess] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [rfqResult, proposalResult] = await Promise.all([
        getRfq(rfqId),
        listProposals(rfqId, page, 20),
      ])

      if (rfqResult.success && rfqResult.data) {
        setRfq(rfqResult.data)
      } else {
        setError(rfqResult.message || 'Failed to load RFQ')
      }

      if (proposalResult.success && proposalResult.data) {
        setProposals(proposalResult.data.content)
        setTotalPages(proposalResult.data.totalPages)
      }
    } catch {
      setError('Failed to load data')
    }
    setLoading(false)
  }, [rfqId, page])

  useEffect(() => {
    if (rfqId) fetchData()
  }, [rfqId, fetchData])

  const handleAward = async (organizationId: string) => {
    if (!confirm('Are you sure you want to award this RFQ to this organization? This action cannot be undone.')) {
      return
    }

    setAwarding(organizationId)
    try {
      const result = await awardRfq({
        rfqId,
        awardedToOrganizationId: organizationId,
      })

      if (result.success) {
        setAwardSuccess(true)
        await fetchData()
      } else {
        alert(result.message || 'Failed to award RFQ')
      }
    } catch {
      alert('Network error. Please try again.')
    }
    setAwarding(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-500">Loading proposals...</p>
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
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Error</h2>
            <p className="text-gray-500">{error || 'Unable to load RFQ'}</p>
          </div>
        </div>
      </div>
    )
  }

  const isOpen = rfq.status === 'OPEN'
  const isAwarded = rfq.status === 'AWARDED'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back nav */}
        <Link
          href={`/rfq/${rfqId}`}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to RFQ
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">{rfq.title}</h1>
              <p className="text-sm text-gray-500">
                {proposals.length} proposal{proposals.length !== 1 ? 's' : ''} received
              </p>
            </div>
            <div className="flex items-center gap-2">
              {rfq.budget && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                  <DollarSign className="h-3.5 w-3.5" />
                  {formatCurrency(rfq.budget, rfq.budgetCurrency)}
                </span>
              )}
            </div>
          </div>

          {awardSuccess && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800 text-sm">
              <CheckCircle className="h-4 w-4" />
              RFQ has been awarded successfully!
            </div>
          )}
        </div>

        {/* Proposals */}
        {proposals.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals yet</h3>
            <p className="text-gray-500">When suppliers submit proposals, they will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal, idx) => {
              const badge = STATUS_BADGE[proposal.status] || STATUS_BADGE.SUBMITTED
              const isAccepted = proposal.status === 'ACCEPTED'
              const isAwardTarget = rfq.awardedToId === proposal.organizationId

              return (
                <div
                  key={proposal.id}
                  className={`bg-white rounded-xl border shadow-sm overflow-hidden ${
                    isAwardTarget
                      ? 'border-green-300 ring-1 ring-green-200'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                          #{idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500">
                              Org: {proposal.organizationId.slice(0, 8)}...
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.cls}`}>
                              {badge.label}
                            </span>
                            {isAwardTarget && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                <Award className="h-3 w-3" />
                                Awarded
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Submitted {formatDate(proposal.submittedAt)}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(proposal.price, proposal.currency)}
                        </p>
                        {proposal.deliveryTime && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 justify-end mt-0.5">
                            <Clock className="h-3 w-3" />
                            {proposal.deliveryTime}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {proposal.proposalText}
                      </p>
                    </div>

                    {isOpen && !isAwarded && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleAward(proposal.organizationId)}
                          disabled={awarding === proposal.organizationId}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                          {awarding === proposal.organizationId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Award className="h-4 w-4" />
                          )}
                          Award RFQ
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
