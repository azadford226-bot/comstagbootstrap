'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Send, DollarSign, Clock, FileText, Loader2,
  AlertCircle, CheckCircle, Building2, Calendar, Tag, BadgeCheck
} from 'lucide-react'
import { getRfq, submitProposal, type Rfq, type SubmitProposalRequest } from '@/lib/api/rfq'

export default function SubmitProposalPage() {
  const router = useRouter()
  const params = useParams()
  const rfqId = params.id as string

  const [rfq, setRfq] = useState<Rfq | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    proposalText: '',
    price: '',
    currency: 'USD',
    deliveryTime: '',
  })

  useEffect(() => {
    if (rfqId) {
      fetchRFQ()
    }
  }, [rfqId])

  const fetchRFQ = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getRfq(rfqId)

      if (result.success && result.data) {
        setRfq(result.data)
        // Pre-fill currency from RFQ budget currency if available
        if (result.data.budgetCurrency) {
          setFormData(prev => ({ ...prev, currency: result.data!.budgetCurrency }))
        }
      } else {
        setError(result.message || 'RFQ not found')
      }
    } catch (error) {
      console.error('Error fetching RFQ:', error)
      setError('Failed to load RFQ. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.proposalText.trim()) {
      setError('Please provide a proposal description')
      return
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price')
      return
    }

    setIsSubmitting(true)
    try {
      const request: SubmitProposalRequest = {
        rfqId,
        proposalText: formData.proposalText,
        price: parseFloat(formData.price),
        currency: formData.currency,
        deliveryTime: formData.deliveryTime || undefined,
      }

      const result = await submitProposal(request)

      if (result.success) {
        setSuccess(true)
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push('/rfq')
        }, 2000)
      } else {
        setError(result.message || 'Failed to submit proposal. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting proposal:', error)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading RFQ...</p>
        </div>
      </div>
    )
  }

  if (error && !rfq) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/rfq"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to RFQs
          </Link>
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
            <div className="flex items-center gap-3 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <div>
                <h2 className="font-semibold">Error</h2>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-green-200 p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Proposal Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">Your proposal has been submitted and the RFQ owner will be notified.</p>
            <p className="text-sm text-gray-500">Redirecting to RFQ page...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/rfq"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to RFQs
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Submit Proposal</h1>
        </div>

        {/* RFQ Details Card */}
        {rfq && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{rfq.title}</h2>
                <p className="text-gray-700">{rfq.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              {rfq.category && (
                <div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                    <Tag className="h-4 w-4" />
                    Category
                  </div>
                  <p className="font-medium text-gray-900">{rfq.category}</p>
                </div>
              )}
              {rfq.budget && (
                <div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                    <DollarSign className="h-4 w-4" />
                    Budget
                  </div>
                  <p className="font-medium text-gray-900">
                    {rfq.budgetCurrency} {rfq.budget.toLocaleString()}
                  </p>
                </div>
              )}
              {rfq.deadline && (
                <div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                    <Calendar className="h-4 w-4" />
                    Deadline
                  </div>
                  <p className="font-medium text-gray-900">
                    {new Date(rfq.deadline).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Proposal Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your Proposal</h2>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Proposal Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proposal Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.proposalText}
                onChange={(e) => setFormData({ ...formData, proposalText: e.target.value })}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Describe your proposal, approach, deliverables, and why you're the best fit for this RFQ..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Be specific about your approach, timeline, and what you&apos;ll deliver.
              </p>
            </div>

            {/* Price and Currency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Delivery Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Delivery Time
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.deliveryTime}
                    onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., 2 weeks, 1 month, 3-6 months"
                  />
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Optional: Estimated time to complete the project
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
            <Link
              href="/rfq"
              className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !formData.proposalText.trim() || !formData.price}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Proposal
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


