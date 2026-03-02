'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  FileText, Plus, ArrowLeft, Search, Clock, DollarSign,
  Users, CheckCircle, XCircle, Eye, Send, Building2, BadgeCheck,
  Calendar, Tag, Loader2, X, ChevronRight
} from 'lucide-react'
import { listRfqs, createRfq, type Rfq, type CreateRfqRequest } from '@/lib/api/rfq'

const CATEGORIES = [
  'Software Development',
  'Cloud Services',
  'Consulting',
  'Data Analytics',
  'Cybersecurity',
  'Integration',
  'Support & Maintenance',
  'Training',
  'Other',
]

const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Retail',
  'Manufacturing',
  'Education',
  'Marketing',
  'Logistics',
]

export default function RFQPage() {
  const [rfqs, setRfqs] = useState<Rfq[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'mine' | 'available'>('all')
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedRFQ, setSelectedRFQ] = useState<Rfq | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    industry: '',
    budget: '',
    budgetCurrency: 'USD',
    deadline: '',
    requirements: '',
    visibility: 'PUBLIC',
  })

  const fetchRFQs = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await listRfqs({
        filter: filter,
        status: statusFilter || undefined,
        page: 0,
        size: 100,
      })

      if (result.success && result.data) {
        setRfqs(result.data.content || [])
      } else {
        console.error('Error fetching RFQs:', result.message)
      }
    } catch (error) {
      console.error('Error fetching RFQs:', error)
    }
    setIsLoading(false)
  }, [filter, statusFilter])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRFQs()
  }, [fetchRFQs])

  const handleCreate = async () => {
    if (!formData.title || !formData.description) return

    setIsCreating(true)
    try {
      const request: CreateRfqRequest = {
        title: formData.title,
        description: formData.description,
        category: formData.category || undefined,
        industryId: formData.industry ? parseInt(formData.industry) : undefined,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        budgetCurrency: formData.budgetCurrency,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
        requirements: formData.requirements || undefined,
        visibility: formData.visibility,
      }

      const result = await createRfq(request)

      if (result.success) {
        setShowCreateModal(false)
        setFormData({
          title: '',
          description: '',
          category: '',
          industry: '',
          budget: '',
          budgetCurrency: 'USD',
          deadline: '',
          requirements: '',
          visibility: 'PUBLIC',
        })
        await fetchRFQs()
      } else {
        console.error('Error creating RFQ:', result.message)
        alert(result.message || 'Failed to create RFQ')
      }
    } catch (error) {
      console.error('Error creating RFQ:', error)
      alert('Failed to create RFQ')
    }
    setIsCreating(false)
  }

  const filteredRFQs = rfqs.filter(rfq =>
    rfq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rfq.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      OPEN: 'bg-green-100 text-green-800',
      CLOSED: 'bg-gray-100 text-gray-800',
      AWARDED: 'bg-blue-100 text-blue-800',
      CANCELLED: 'bg-red-100 text-red-800',
    }
    return styles[status] || 'bg-gray-100 text-gray-800'
  }

  const formatCurrency = (amount: number | null, currency: string) => {
    if (!amount) return 'Budget not specified'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">RFQ / RFP</h1>
                <p className="text-sm text-gray-500">Request for Quote & Proposals</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" />
              Post RFQ
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Tab Filters */}
            <div className="flex gap-2">
              {(['all', 'available', 'mine'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === f
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f === 'all' ? 'All RFQs' : f === 'available' ? 'Available' : 'My RFQs'}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search RFQs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
              <option value="AWARDED">Awarded</option>
            </select>
          </div>
        </div>

        {/* RFQ List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : filteredRFQs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No RFQs Found</h3>
            <p className="text-gray-500 mb-4">
              {filter === 'mine'
                ? "You haven't posted any RFQs yet"
                : 'No RFQs match your criteria'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Post your first RFQ
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredRFQs.map((rfq) => (
              <div
                key={rfq.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:border-primary-200 transition-colors cursor-pointer"
                onClick={() => setSelectedRFQ(rfq)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(rfq.status)}`}>
                        {rfq.status}
                      </span>
                      {rfq.category && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {rfq.category}
                        </span>
                      )}
                      {rfq.isOwner && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                          Your RFQ
                        </span>
                      )}
                      {rfq.hasSubmitted && !rfq.isOwner && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                          Proposal Sent
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{rfq.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{rfq.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatCurrency(rfq.budget, rfq.budgetCurrency)}</span>
                      </div>
                      {rfq.deadline && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Due: {new Date(rfq.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{rfq.proposalCount} proposals</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create RFQ Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Post New RFQ</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Custom CRM Development Project"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Describe your project requirements..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select industry</option>
                    {INDUSTRIES.map((ind, idx) => (
                      <option key={ind} value={(idx + 1).toString()}>{ind}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                  <div className="flex gap-2">
                    <select
                      value={formData.budgetCurrency}
                      onChange={(e) => setFormData({ ...formData, budgetCurrency: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Amount"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detailed Requirements
                </label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="List specific requirements, technologies, deliverables..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="PUBLIC"
                      checked={formData.visibility === 'PUBLIC'}
                      onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Public - visible to all</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="INVITE_ONLY"
                      checked={formData.visibility === 'INVITE_ONLY'}
                      onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Invite only</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={isCreating || !formData.title || !formData.description}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Post RFQ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RFQ Detail Modal */}
      {selectedRFQ && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedRFQ.status)}`}>
                      {selectedRFQ.status}
                    </span>
                    {selectedRFQ.category && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {selectedRFQ.category}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedRFQ.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedRFQ(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Details */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="font-semibold">{formatCurrency(selectedRFQ.budget, selectedRFQ.budgetCurrency)}</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Clock className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Deadline</p>
                  <p className="font-semibold">
                    {selectedRFQ.deadline
                      ? new Date(selectedRFQ.deadline).toLocaleDateString()
                      : 'Open'}
                  </p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Proposals</p>
                  <p className="font-semibold">{selectedRFQ.proposalCount}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{selectedRFQ.description}</p>
              </div>

              {selectedRFQ.requirements && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Requirements</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedRFQ.requirements}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setSelectedRFQ(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Close
              </button>
              {selectedRFQ.isOwner ? (
                <Link
                  href={`/rfq/${selectedRFQ.id}/proposals`}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View Proposals
                </Link>
              ) : selectedRFQ.status === 'OPEN' && !selectedRFQ.hasSubmitted ? (
                <Link
                  href={`/rfq/${selectedRFQ.id}/submit`}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Submit Proposal
                </Link>
              ) : selectedRFQ.hasSubmitted ? (
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Proposal Submitted
                </span>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


