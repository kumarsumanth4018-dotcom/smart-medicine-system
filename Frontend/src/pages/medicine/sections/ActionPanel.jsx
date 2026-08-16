/**
 * Component: ActionPanel
 *
 * Description:
 *   Sticky side panel (desktop) / bottom bar (mobile) containing all
 *   primary and secondary actions for the medicine detail page.
 *
 * Responsibilities:
 *   - Compare Medicine, Save Medicine, Share Medicine (with local state)
 *   - Print Information, Download PDF, Report Incorrect Information
 *   - All are UI-only placeholders
 *
 * Backend readiness:
 *   - Save → POST /api/v1/users/me/saved-medicines/:id
 *   - Report → POST /api/v1/medicines/:id/report
 *   - PDF → GET /api/v1/medicines/:id/pdf
 */

import { useState } from 'react'
import {
  HiOutlineBookmark, HiBookmark,
  HiOutlineShare, HiOutlinePrinter,
  HiOutlineArrowsRightLeft,
  HiOutlineDocumentArrowDown,
  HiOutlineFlag,
} from 'react-icons/hi2'
import Button from '../../../components/ui/Button'

// =====================================================
// Action Panel
// =====================================================
function ActionPanel({ medicine = {} }) {
  const [isSaved,   setIsSaved]   = useState(false)
  const [isShared,  setIsShared]  = useState(false)

  const { name = 'Medicine', price } = medicine

  function handleSave() {
    setIsSaved((s) => !s)
    // TODO: POST/DELETE /api/v1/users/me/saved-medicines/:id
  }

  function handleShare() {
    setIsShared(true)
    setTimeout(() => setIsShared(false), 2000)
    // TODO: Web Share API or custom share dialog
  }

  function handlePrint() {
    // TODO: window.print() with print-specific CSS
  }

  function handleDownloadPdf() {
    // TODO: GET /api/v1/medicines/:id/pdf
  }

  function handleReport() {
    // TODO: open report dialog / POST /api/v1/medicines/:id/report
  }

  function handleCompare() {
    // TODO: add to compare selection and navigate to results
  }

  return (
    <aside
      aria-label="Medicine actions"
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3"
    >
      <h2 className="text-sm font-bold text-slate-900 mb-1">Actions</h2>

      {/* Primary actions */}
      <Button
        variant="primary"
        fullWidth
        leftIcon={<HiOutlineArrowsRightLeft size={16} />}
        onClick={handleCompare}
        aria-label={`Compare ${name} with other medicines`}
      >
        Compare Medicine
      </Button>

      <Button
        variant={isSaved ? 'secondary' : 'outline'}
        fullWidth
        leftIcon={isSaved ? <HiBookmark size={16} /> : <HiOutlineBookmark size={16} />}
        onClick={handleSave}
        aria-label={isSaved ? `Remove ${name} from saved` : `Save ${name}`}
        aria-pressed={isSaved}
      >
        {isSaved ? 'Saved' : 'Save Medicine'}
      </Button>

      <Button
        variant="outline"
        fullWidth
        leftIcon={<HiOutlineShare size={16} />}
        onClick={handleShare}
        aria-label={`Share ${name}`}
      >
        {isShared ? 'Copied link!' : 'Share Medicine'}
      </Button>

      {/* Divider */}
      <hr className="border-slate-100" />

      {/* Secondary actions */}
      <button
        type="button"
        onClick={handlePrint}
        aria-label={`Print information for ${name}`}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 text-left"
      >
        <HiOutlinePrinter size={15} className="text-slate-400" aria-hidden="true" />
        Print Information
      </button>

      <button
        type="button"
        onClick={handleDownloadPdf}
        aria-label={`Download PDF for ${name}`}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 text-left"
      >
        <HiOutlineDocumentArrowDown size={15} className="text-slate-400" aria-hidden="true" />
        Download PDF
        {/* TODO: GET /api/v1/medicines/:id/pdf */}
      </button>

      <button
        type="button"
        onClick={handleReport}
        aria-label={`Report incorrect information for ${name}`}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-danger-600 hover:bg-danger-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-400 text-left"
      >
        <HiOutlineFlag size={15} aria-hidden="true" />
        Report Incorrect Info
      </button>

      {/* Price summary */}
      {price !== undefined && (
        <>
          <hr className="border-slate-100" />
          <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Generic Price</p>
            <p className="text-2xl font-extrabold text-primary-700">₹{price}</p>
            <p className="text-xs text-slate-400">at Jan Aushadhi Kendra</p>
            {/* TODO: price from API */}
          </div>
        </>
      )}
    </aside>
  )
}

export default ActionPanel
