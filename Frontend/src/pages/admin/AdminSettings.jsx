/**
 * Component: AdminSettings — Expanded Platform Settings
 *
 * Sections:
 *   Platform Configuration — language, theme, branding
 *   Notification Rules     — system alerts, email, push
 *   Security Rules         — 2FA, session timeout, IP whitelist
 *   Password Policy        — min length, complexity, expiry
 *   AI & Recommendations   — model toggles
 *   Maintenance            — maintenance mode toggle
 *
 * Backend readiness: TODO: GET/PUT /api/v1/admin/settings
 */

import { useState } from 'react'
import {
  HiOutlineCog6Tooth, HiOutlineShieldCheck, HiOutlineGlobeAlt,
  HiOutlineBell, HiOutlineWrenchScrewdriver, HiOutlineCpuChip,
  HiOutlinePaintBrush, HiOutlineLockClosed, HiOutlineKey,
} from 'react-icons/hi2'
import Toggle from '../../components/forms/Toggle'
import Select from '../../components/forms/Select'
import Input  from '../../components/forms/Input'
import Badge  from '../../components/ui/Badge'

// ─── Sub-components ───────────────────────────────────────────────────────────
function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-slate-50 last:border-0">
      <div>
        <p className="text-xs font-semibold text-slate-800">{label}</p>
        {description && <p className="text-[11px] text-slate-400 mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function SettingCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <p className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
        <Icon size={15} className="text-primary-600" aria-hidden="true" />
        {title}
      </p>
      {children}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
function AdminSettings() {
  // Platform
  const [language, setLanguage]     = useState('en')
  const [theme,    setTheme]        = useState('light')

  // Notifications
  const [sysNotifs,  setSysNotifs]  = useState(true)
  const [emailNotifs,setEmailNotifs]= useState(false)
  const [pushNotifs, setPushNotifs] = useState(true)
  const [lowStock,   setLowStock]   = useState(true)
  const [regAlerts,  setRegAlerts]  = useState(true)

  // Security
  const [twoFa,      setTwoFa]      = useState(false)
  const [ipWhitelist,setIpWhitelist]= useState(false)

  // AI
  const [aiRec,  setAiRec]      = useState(true)
  const [aiOcr,  setAiOcr]      = useState(false)
  const [aiVoice,setAiVoice]    = useState(false)

  // Maintenance
  const [maint,  setMaint]      = useState(false)
  const [disaReg,setDisaReg]    = useState(false)

  return (
    <article aria-label="Platform Settings" className="flex flex-col gap-5 max-w-3xl">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <HiOutlineCog6Tooth size={22} className="text-slate-600" aria-hidden="true" />
          Platform Settings
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">TODO: GET/PUT /api/v1/admin/settings</p>
      </div>

      {/* Platform Configuration */}
      <SettingCard title="Platform Configuration" icon={HiOutlineGlobeAlt}>
        <SettingRow label="Language" description="Platform default language for all users">
          <Select
            value={language} onChange={e => setLanguage(e.target.value)}
            options={[{value:'en',label:'English (IN)'},{value:'hi',label:'Hindi'},{value:'mr',label:'Marathi'}]}
          />
        </SettingRow>
        <SettingRow label="Theme" description="Admin portal interface theme">
          <Select
            value={theme} onChange={e => setTheme(e.target.value)}
            options={[{value:'light',label:'Light'},{value:'dark',label:'Dark'}]}
          />
        </SettingRow>
        <SettingRow label="Timezone" description="Platform timezone for logs and reports (placeholder)">
          <Badge variant="neutral" size="sm">Asia/Kolkata (IST)</Badge>
        </SettingRow>
      </SettingCard>

      {/* Platform Branding */}
      <SettingCard title="Platform Branding" icon={HiOutlinePaintBrush}>
        <SettingRow label="Platform Name" description="Displayed in emails, notifications, and UI">
          <Input placeholder="Smart Medicine System" className="w-48" aria-label="Platform name" />
        </SettingRow>
        <SettingRow label="Support Email" description="Displayed to users for support queries (placeholder)">
          <Input placeholder="support@smartmedicine.in" className="w-48" aria-label="Support email" />
        </SettingRow>
        <SettingRow label="Logo Upload" description="Platform logo (PNG, SVG — placeholder)">
          <Badge variant="neutral" size="sm">Coming Soon</Badge>
        </SettingRow>
        <SettingRow label="Favicon" description="Browser tab icon (placeholder)">
          <Badge variant="neutral" size="sm">Coming Soon</Badge>
        </SettingRow>
      </SettingCard>

      {/* Notification Rules */}
      <SettingCard title="Notification Rules" icon={HiOutlineBell}>
        <SettingRow label="System Notifications" description="Low stock, expiry, user activity alerts">
          <Toggle checked={sysNotifs}   onChange={setSysNotifs}   size="sm" aria-label="System notifications" />
        </SettingRow>
        <SettingRow label="Email Notifications" description="Send alerts via email (placeholder — requires SMTP config)">
          <Toggle checked={emailNotifs} onChange={setEmailNotifs} size="sm" aria-label="Email notifications" />
        </SettingRow>
        <SettingRow label="Push Notifications" description="Browser push to registered users (placeholder)">
          <Toggle checked={pushNotifs}  onChange={setPushNotifs}  size="sm" aria-label="Push notifications" />
        </SettingRow>
        <SettingRow label="Low Stock Alerts" description="Notify pharmacists when stock is critical">
          <Toggle checked={lowStock}    onChange={setLowStock}    size="sm" aria-label="Low stock alerts" />
        </SettingRow>
        <SettingRow label="Registration Alerts" description="Notify admin on new pharmacy registrations">
          <Toggle checked={regAlerts}   onChange={setRegAlerts}   size="sm" aria-label="Registration alerts" />
        </SettingRow>
      </SettingCard>

      {/* Security Rules */}
      <SettingCard title="Security Rules" icon={HiOutlineShieldCheck}>
        <SettingRow label="Two-Factor Authentication" description="Require 2FA for all administrator accounts (placeholder)">
          <Toggle checked={twoFa} onChange={setTwoFa} size="sm" aria-label="Two-factor authentication" />
        </SettingRow>
        <SettingRow label="Session Timeout" description="Auto-logout administrators after inactivity">
          <Select options={[{value:'30',label:'30 minutes'},{value:'60',label:'1 hour'},{value:'120',label:'2 hours'},{value:'240',label:'4 hours'}]} />
        </SettingRow>
        <SettingRow label="IP Whitelist" description="Restrict admin login to specific IP ranges (placeholder)">
          <Toggle checked={ipWhitelist} onChange={setIpWhitelist} size="sm" aria-label="IP whitelist" />
        </SettingRow>
        <SettingRow label="Max Login Attempts" description="Lock account after N failed attempts (placeholder)">
          <Select options={[{value:'3',label:'3 attempts'},{value:'5',label:'5 attempts'},{value:'10',label:'10 attempts'}]} />
        </SettingRow>
      </SettingCard>

      {/* Password Policy */}
      <SettingCard title="Password Policy" icon={HiOutlineKey}>
        <SettingRow label="Minimum Password Length" description="Minimum characters required (placeholder)">
          <Select options={[{value:'8',label:'8 characters'},{value:'10',label:'10 characters'},{value:'12',label:'12 characters'}]} />
        </SettingRow>
        <SettingRow label="Require Uppercase" description="Password must contain uppercase letter (placeholder)">
          <Badge variant="success" size="sm">Enabled</Badge>
        </SettingRow>
        <SettingRow label="Require Number" description="Password must contain at least one digit (placeholder)">
          <Badge variant="success" size="sm">Enabled</Badge>
        </SettingRow>
        <SettingRow label="Require Special Character" description="Password must include !@#$ etc. (placeholder)">
          <Badge variant="neutral" size="sm">Coming Soon</Badge>
        </SettingRow>
        <SettingRow label="Password Expiry" description="Force password reset after N days (placeholder)">
          <Select options={[{value:'never',label:'Never'},{value:'90',label:'90 days'},{value:'180',label:'180 days'},{value:'365',label:'1 year'}]} />
        </SettingRow>
      </SettingCard>

      {/* AI & Recommendations */}
      <SettingCard title="AI & Recommendations" icon={HiOutlineCpuChip}>
        <SettingRow label="Generic Recommendation Engine" description="Enable AI-based brand-to-generic matching">
          <Toggle checked={aiRec}   onChange={setAiRec}   size="sm" aria-label="Generic recommendation engine" />
        </SettingRow>
        <SettingRow label="OCR Prescription Scanner" description="Enable prescription image scanning (placeholder — next phase)">
          <Toggle checked={aiOcr}   onChange={setAiOcr}   size="sm" aria-label="OCR prescription scanner" />
        </SettingRow>
        <SettingRow label="Voice Search" description="Enable speech-to-text medicine search (placeholder — next phase)">
          <Toggle checked={aiVoice} onChange={setAiVoice} size="sm" aria-label="Voice search" />
        </SettingRow>
        <SettingRow label="Model Accuracy Threshold" description="Minimum confidence for generic suggestions (placeholder)">
          <Select options={[{value:'80',label:'80%'},{value:'85',label:'85%'},{value:'90',label:'90%'},{value:'95',label:'95%'}]} />
        </SettingRow>
      </SettingCard>

      {/* Maintenance */}
      <SettingCard title="Maintenance & Access Control" icon={HiOutlineWrenchScrewdriver}>
        <SettingRow label="Maintenance Mode" description="Take the platform offline for maintenance (placeholder)">
          <Toggle checked={maint}   onChange={setMaint}   size="sm" aria-label="Maintenance mode" />
        </SettingRow>
        {maint && (
          <p className="text-xs text-warning-700 bg-warning-50 rounded-lg px-3 py-2 mb-2">
            ⚠ Maintenance mode is ON — users cannot access the platform (placeholder only)
          </p>
        )}
        <SettingRow label="Disable New Registrations" description="Block new user registrations (placeholder)">
          <Toggle checked={disaReg} onChange={setDisaReg} size="sm" aria-label="Disable registrations" />
        </SettingRow>
      </SettingCard>

    </article>
  )
}

export default AdminSettings
