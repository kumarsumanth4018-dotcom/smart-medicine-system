/**
 * Component: MedicineFormPage
 *
 * Description:
 *   Shared professional form for adding or editing a medicine
 *   in the pharmacy inventory. Mode is determined by the URL.
 *
 * Responsibilities:
 *   • Add Medicine — blank form with Save + Cancel
 *   • Edit Medicine — pre-filled form with Update + Cancel
 *   • Validation using React Hook Form + Zod
 *   • Image placeholder upload slot
 *   • Barcode placeholder field
 *   • Supplier placeholder field
 *
 * Backend readiness:
 *   Add  → POST /api/v1/pharmacy/inventory
 *   Edit → PUT  /api/v1/pharmacy/inventory/:id
 */

import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { HiOutlineArrowLeft, HiOutlineCamera, HiOutlineQrCode } from 'react-icons/hi2'
import { MdMedication } from 'react-icons/md'
import Input    from '../../components/forms/Input'
import Select   from '../../components/forms/Select'
import Textarea from '../../components/forms/Textarea'
import Button   from '../../components/ui/Button'
import { ROUTES } from '../../constants/routes'
import { CATEGORIES, DOSAGE_FORMS, INVENTORY } from './data/inventoryData'

// ── Zod validation schema ──────────────────────────────────────────────────
const medicineSchema = z.object({
  name:        z.string().min(2, 'Medicine name is required'),
  genericName: z.string().min(2, 'Generic name is required'),
  composition: z.string().min(3, 'Composition is required'),
  manufacturer:z.string().min(2, 'Manufacturer is required'),
  category:    z.string().min(1, 'Category is required'),
  strength:    z.string().min(1, 'Strength is required'),
  dosageForm:  z.string().min(1, 'Dosage form is required'),
  batch:       z.string().min(2, 'Batch number is required'),
  mfgDate:     z.string().min(1, 'Manufacturing date is required'),
  expiry:      z.string().min(1, 'Expiry date is required'),
  qty:         z.coerce.number().min(0, 'Quantity cannot be negative'),
  price:       z.coerce.number().min(0.01, 'Price must be positive'),
  supplier:    z.string().optional(),
  barcode:     z.string().optional(),
  notes:       z.string().optional(),
})

function MedicineFormPage() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const isEdit     = !!id

  // Pre-fill for edit mode — TODO: fetch from GET /api/v1/pharmacy/inventory/:id
  const prefill = isEdit ? INVENTORY.find(i => i.id === id) : undefined

  const {
    register, handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(medicineSchema),
    defaultValues: prefill ? {
      name: prefill.name, genericName: prefill.genericName,
      composition: prefill.composition, manufacturer: prefill.manufacturer,
      category: prefill.category, strength: prefill.strength,
      dosageForm: prefill.dosageForm, batch: prefill.batch,
      mfgDate: prefill.mfgDate, expiry: prefill.expiry,
      qty: prefill.qty, price: prefill.price,
    } : {},
  })

  function onSubmit(_data) {
    // TODO: POST /api/v1/pharmacy/inventory (add) or PUT /api/v1/pharmacy/inventory/:id (edit)
    navigate(ROUTES.PHARMACY.INVENTORY)
  }

  return (
    <article aria-label={isEdit ? 'Edit Medicine' : 'Add Medicine'} className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          to={ROUTES.PHARMACY.INVENTORY}
          aria-label="Back to inventory"
          className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <HiOutlineArrowLeft size={16} aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">
            {isEdit ? 'Edit Medicine' : 'Add Medicine'}
          </h1>
          <p className="text-xs text-slate-500">
            {isEdit ? `Editing: ${prefill?.name ?? id}` : 'Add a new medicine to your inventory'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

        {/* Image placeholder */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-sm font-semibold text-slate-800 mb-3">Medicine Image</p>
          <div
            aria-label="Medicine image upload placeholder"
            className="flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
          >
            {/* TODO: file upload input for medicine image */}
            <MdMedication size={32} className="text-slate-300 mb-2" aria-hidden="true" />
            <p className="text-xs text-slate-400">Click to upload medicine image</p>
            <p className="text-[10px] text-slate-300 mt-0.5">PNG, JPG up to 2MB (placeholder)</p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <p className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">Basic Information</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Medicine Name"  required error={errors.name?.message}         {...register('name')}         placeholder="Enter medicine name (e.g. Paracetamol IP 500mg)" />
            <Input label="Generic Name"   required error={errors.genericName?.message}  {...register('genericName')}  placeholder="Enter generic name (e.g. Acetaminophen)" />
          </div>
          <Input label="Composition" required error={errors.composition?.message} {...register('composition')} placeholder="Enter active composition (e.g. Paracetamol IP 500mg)" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Manufacturer" required error={errors.manufacturer?.message} {...register('manufacturer')} placeholder="Enter manufacturer name (e.g. Jan Aushadhi / BPPI)" />
            <Select
              label="Category" required
              options={CATEGORIES.map(c => ({ value: c, label: c }))}
              placeholder="Select medicine category"
              error={errors.category?.message}
              {...register('category')}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Strength" required error={errors.strength?.message} {...register('strength')} placeholder="Enter strength (e.g. 500mg, 10ml)" />
            <Select
              label="Dosage Form" required
              options={DOSAGE_FORMS.map(f => ({ value: f, label: f }))}
              placeholder="Select dosage form"
              error={errors.dosageForm?.message}
              {...register('dosageForm')}
            />
          </div>
        </div>

        {/* Batch & Dates */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <p className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">Batch & Dates</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Batch Number"       required type="text" error={errors.batch?.message}   {...register('batch')}   placeholder="Enter batch number (e.g. BAT-2025-001)" />
            <Input label="Manufacturing Date" required type="date" error={errors.mfgDate?.message}  {...register('mfgDate')} />
            <Input label="Expiry Date"        required type="date" error={errors.expiry?.message}   {...register('expiry')} />
          </div>
        </div>

        {/* Stock & Pricing */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <p className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">Stock & Pricing</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Quantity" required type="number" error={errors.qty?.message}   {...register('qty')}   placeholder="Enter quantity in stock" />
            <Input label="Price (₹)" required type="number" error={errors.price?.message} {...register('price')} placeholder="Enter selling price (e.g. 25.00)" />
          </div>
          <Input label="Supplier" error={errors.supplier?.message} {...register('supplier')} placeholder="Enter supplier name (optional)" helperText="TODO: link to Supplier Management module" />
        </div>

        {/* Barcode placeholder */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <HiOutlineQrCode size={16} className="text-slate-400" aria-hidden="true" />
            Barcode
          </p>
          <Input
            label="Barcode / QR Code"
            error={errors.barcode?.message}
            {...register('barcode')}
            placeholder="Scan or enter barcode number (optional)"
            helperText="TODO: integrate Barcode Scanner API"
            rightIcon={<HiOutlineCamera size={16} />}
          />
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <Textarea label="Notes" {...register('notes')} placeholder="Enter any additional notes about this medicine (optional)…" rows={3} />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-4">
          <Link
            to={ROUTES.PHARMACY.INVENTORY}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            Cancel
          </Link>
          <Button type="submit" variant="secondary" loading={isSubmitting}>
            {isEdit ? 'Update Medicine' : 'Save Medicine'}
          </Button>
        </div>
      </form>
    </article>
  )
}

export default MedicineFormPage
