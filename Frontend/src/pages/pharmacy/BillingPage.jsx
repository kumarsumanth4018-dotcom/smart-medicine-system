/**
 * Component: BillingPage
 *
 * Description:
 *   Point-of-sale billing screen for the pharmacy owner. Build a cart of
 *   medicines + quantities, submit as one bill — the backend deducts stock
 *   FIFO (oldest expiry first) and returns a receipt showing exactly which
 *   batches were used.
 *
 * Backend:
 *   POST /api/v1/kendras/:id/bill  → { items: [{ pmbi_code, quantity }] }
 *   Response: { bill_id, items: [{ ..., batches_used }], total_amount, billed_at }
 */

import { useState, useMemo } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  HiOutlineMagnifyingGlass, HiOutlineTrash, HiOutlinePlus,
  HiOutlineExclamationTriangle, HiOutlineCheckCircle, HiOutlineReceiptPercent,
} from 'react-icons/hi2'
import Button from '../../components/ui/Button'
import { useAuth } from '../../contexts/AuthContext'
import kendraService from '../../services/kendraService'
import medicineService from '../../services/medicineService'

function BillingPage() {
  const { currentUser } = useAuth()
  const kendraId = currentUser?.assignedKendraId ?? null

  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([]) // [{ pmbi_code, name, price, quantity }]
  const [error, setError] = useState('')
  const [receipt, setReceipt] = useState(null)

  const medicinesQuery = useQuery({
    queryKey: ['medicines', 'all-for-billing'],
    queryFn: async () => (await medicineService.getAll({ page: 1, page_size: 200 })).data.results,
  })

  const searchResults = useMemo(() => {
    if (!search.trim()) return []
    const q = search.toLowerCase()
    return (medicinesQuery.data ?? [])
      .filter(m =>
        m.brand_name.toLowerCase().includes(q) ||
        m.generic_name.toLowerCase().includes(q) ||
        m.pmbi_code.toLowerCase().includes(q))
      .slice(0, 8)
  }, [search, medicinesQuery.data])

  const billMutation = useMutation({
    mutationFn: (payload) => kendraService.generateBill(kendraId, payload),
    onSuccess: (res) => {
      setReceipt(res.data)
      setCart([])
      setError('')
    },
    onError: (err) => {
      setError(err?.response?.data?.detail ?? 'Billing failed. Please try again.')
    },
  })

  function addToCart(medicine) {
    setSearch('')
    setCart((prev) => {
      const existing = prev.find((c) => c.pmbi_code === medicine.pmbi_code)
      if (existing) {
        return prev.map((c) =>
          c.pmbi_code === medicine.pmbi_code ? { ...c, quantity: c.quantity + 1 } : c,
        )
      }
      return [...prev, {
        pmbi_code: medicine.pmbi_code,
        name: medicine.brand_name,
        price: medicine.jan_aushadhi_mrp,
        quantity: 1,
      }]
    })
  }

  function updateQuantity(pmbiCode, quantity) {
    const qty = Math.max(1, Number(quantity) || 1)
    setCart((prev) => prev.map((c) => (c.pmbi_code === pmbiCode ? { ...c, quantity: qty } : c)))
  }

  function removeFromCart(pmbiCode) {
    setCart((prev) => prev.filter((c) => c.pmbi_code !== pmbiCode))
  }

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0)

  function handleGenerateBill() {
    setError('')
    if (cart.length === 0) {
      setError('Add at least one medicine to the cart.')
      return
    }
    billMutation.mutate({
      items: cart.map((c) => ({ pmbi_code: c.pmbi_code, quantity: c.quantity })),
    })
  }

  if (!kendraId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
        <HiOutlineExclamationTriangle size={28} className="text-warning-500" aria-hidden="true" />
        <p className="text-sm font-semibold text-slate-700">No Kendra assigned to your account yet.</p>
        <p className="text-xs text-slate-500 max-w-sm">
          An admin needs to link your account to a Jan Aushadhi Kendra before you can generate bills.
        </p>
      </div>
    )
  }

  // ── Receipt view, shown after a successful bill ────────────────────────
  if (receipt) {
    return (
      <article className="max-w-lg mx-auto flex flex-col gap-4">
        <div className="flex items-center gap-2 text-success-700">
          <HiOutlineCheckCircle size={22} aria-hidden="true" />
          <h1 className="text-lg font-extrabold">Bill Generated</h1>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
          <p className="text-xs text-slate-400">Bill ID: {receipt.bill_id}</p>
          <p className="text-xs text-slate-400">
            {new Date(receipt.billed_at).toLocaleString()}
          </p>

          <div className="divide-y divide-slate-100">
            {receipt.items.map((item) => (
              <div key={item.pmbi_code} className="py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{item.medicine_name}</p>
                  <p className="text-sm font-bold text-slate-900">₹{item.line_total.toFixed(2)}</p>
                </div>
                <p className="text-xs text-slate-500">
                  {item.quantity} × ₹{item.unit_price} = ₹{item.line_total.toFixed(2)}
                </p>
                <div className="mt-1.5 flex flex-col gap-0.5">
                  {item.batches_used.map((b, i) => (
                    <p key={i} className="text-[10px] text-slate-400 font-mono">
                      Batch {b.batch_number} (exp. {new Date(b.expiry_date).toLocaleDateString()}) — {b.quantity_deducted} units
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <p className="text-sm font-bold text-slate-900">Total</p>
            <p className="text-lg font-extrabold text-primary-600">₹{receipt.total_amount.toFixed(2)}</p>
          </div>
        </div>

        <Button variant="primary" onClick={() => setReceipt(null)}>
          Generate Another Bill
        </Button>
      </article>
    )
  }

  // ── Cart / billing entry view ───────────────────────────────────────────
  return (
    <article aria-label="Billing" className="flex flex-col gap-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <HiOutlineReceiptPercent size={22} className="text-primary-600" aria-hidden="true" />
          Billing
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Select medicines and quantities sold — stock is deducted oldest-expiry-first automatically.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-danger-50 text-danger-700 text-xs">
          <HiOutlineExclamationTriangle size={14} aria-hidden="true" /> {error}
        </div>
      )}

      {/* Medicine search / add */}
      <div className="relative">
        <HiOutlineMagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search medicine to add…"
          aria-label="Search medicine to bill"
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        />
        {searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
            {searchResults.map((m) => (
              <button
                key={m.pmbi_code}
                type="button"
                onClick={() => addToCart(m)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-primary-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{m.brand_name}</p>
                  <p className="text-xs text-slate-500">{m.pmbi_code} · ₹{m.jan_aushadhi_mrp}</p>
                </div>
                <HiOutlinePlus size={16} className="text-primary-500" aria-hidden="true" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Cart */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {cart.length === 0 ? (
          <p className="text-center py-10 text-sm text-slate-400">Cart is empty. Search above to add medicines.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {cart.map((item) => (
              <div key={item.pmbi_code} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{item.name}</p>
                  <p className="text-xs text-slate-500">₹{item.price} each</p>
                </div>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.pmbi_code, e.target.value)}
                  aria-label={`Quantity for ${item.name}`}
                  className="w-16 h-9 px-2 rounded-lg border border-slate-200 text-sm text-center outline-none focus:border-primary-500"
                />
                <p className="w-20 text-right text-sm font-bold text-slate-900">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.pmbi_code)}
                  aria-label={`Remove ${item.name}`}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-danger-500 hover:bg-danger-50 transition-colors"
                >
                  <HiOutlineTrash size={16} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50">
            <p className="text-sm font-bold text-slate-900">Total</p>
            <p className="text-lg font-extrabold text-primary-600">₹{cartTotal.toFixed(2)}</p>
          </div>
        )}
      </div>

      <Button
        variant="primary"
        onClick={handleGenerateBill}
        disabled={cart.length === 0 || billMutation.isPending}
      >
        {billMutation.isPending ? 'Generating…' : 'Generate Bill'}
      </Button>
    </article>
  )
}

export default BillingPage