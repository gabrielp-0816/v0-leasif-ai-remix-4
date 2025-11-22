"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CreateContractFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (contractData: any) => void
}

export function CreateContractForm({ open, onOpenChange, onSubmit }: CreateContractFormProps) {
  const [formData, setFormData] = useState({
    propertyAddress: "",
    tenantName: "",
    tenantCompany: "",
    tenantPhone: "",
    tenantEmail: "",
    leaseStart: "",
    leaseTermMonths: "12",
    monthlyRent: "",
    securityDeposit: "",
    renewalOption: "yes",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.propertyAddress.trim()) newErrors.propertyAddress = "Property address is required"
    if (!formData.tenantName.trim()) newErrors.tenantName = "Tenant name is required"
    if (!formData.tenantCompany.trim()) newErrors.tenantCompany = "Company name is required"
    if (!formData.tenantPhone.trim()) newErrors.tenantPhone = "Phone number is required"
    if (!formData.tenantEmail.trim()) newErrors.tenantEmail = "Email is required"
    if (!formData.leaseStart) newErrors.leaseStart = "Lease start date is required"
    if (!formData.monthlyRent.trim()) newErrors.monthlyRent = "Monthly rent is required"
    if (!formData.securityDeposit.trim()) newErrors.securityDeposit = "Security deposit is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const leaseEnd = new Date(formData.leaseStart)
      leaseEnd.setMonth(leaseEnd.getMonth() + Number.parseInt(formData.leaseTermMonths))

      const contractData = {
        propertyAddress: formData.propertyAddress,
        tenantName: formData.tenantName,
        tenantCompany: formData.tenantCompany,
        tenantContact: {
          phone: formData.tenantPhone,
          email: formData.tenantEmail,
        },
        leaseStart: formData.leaseStart,
        leaseEnd: leaseEnd.toISOString().split("T")[0],
        monthlyRent: `₱${Number.parseInt(formData.monthlyRent).toLocaleString()}/month`,
        leaseDetails: {
          term: `${formData.leaseTermMonths} months`,
          deposit: `₱${Number.parseInt(formData.securityDeposit).toLocaleString()}`,
          renewalOption: formData.renewalOption === "yes",
        },
      }

      onSubmit(contractData)
      setFormData({
        propertyAddress: "",
        tenantName: "",
        tenantCompany: "",
        tenantPhone: "",
        tenantEmail: "",
        leaseStart: "",
        leaseTermMonths: "12",
        monthlyRent: "",
        securityDeposit: "",
        renewalOption: "yes",
      })
      setErrors({})
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Contract</DialogTitle>
          <DialogDescription>Fill in the details to create a new lease contract</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Property Information */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Property Information</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="propertyAddress" className="text-sm">
                  Property Address
                </Label>
                <Input
                  id="propertyAddress"
                  placeholder="Enter property address"
                  value={formData.propertyAddress}
                  onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                  className={errors.propertyAddress ? "border-red-500" : ""}
                />
                {errors.propertyAddress && <p className="text-xs text-red-500 mt-1">{errors.propertyAddress}</p>}
              </div>
            </div>
          </div>

          {/* Tenant Information */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Tenant Information</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="tenantName" className="text-sm">
                  Tenant Name
                </Label>
                <Input
                  id="tenantName"
                  placeholder="Enter tenant name"
                  value={formData.tenantName}
                  onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                  className={errors.tenantName ? "border-red-500" : ""}
                />
                {errors.tenantName && <p className="text-xs text-red-500 mt-1">{errors.tenantName}</p>}
              </div>

              <div>
                <Label htmlFor="tenantCompany" className="text-sm">
                  Company Name
                </Label>
                <Input
                  id="tenantCompany"
                  placeholder="Enter company name"
                  value={formData.tenantCompany}
                  onChange={(e) => setFormData({ ...formData, tenantCompany: e.target.value })}
                  className={errors.tenantCompany ? "border-red-500" : ""}
                />
                {errors.tenantCompany && <p className="text-xs text-red-500 mt-1">{errors.tenantCompany}</p>}
              </div>

              <div>
                <Label htmlFor="tenantPhone" className="text-sm">
                  Phone Number
                </Label>
                <Input
                  id="tenantPhone"
                  placeholder="Enter phone number"
                  value={formData.tenantPhone}
                  onChange={(e) => setFormData({ ...formData, tenantPhone: e.target.value })}
                  className={errors.tenantPhone ? "border-red-500" : ""}
                />
                {errors.tenantPhone && <p className="text-xs text-red-500 mt-1">{errors.tenantPhone}</p>}
              </div>

              <div>
                <Label htmlFor="tenantEmail" className="text-sm">
                  Email Address
                </Label>
                <Input
                  id="tenantEmail"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.tenantEmail}
                  onChange={(e) => setFormData({ ...formData, tenantEmail: e.target.value })}
                  className={errors.tenantEmail ? "border-red-500" : ""}
                />
                {errors.tenantEmail && <p className="text-xs text-red-500 mt-1">{errors.tenantEmail}</p>}
              </div>
            </div>
          </div>

          {/* Lease Details */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Lease Details</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="leaseStart" className="text-sm">
                  Lease Start Date
                </Label>
                <Input
                  id="leaseStart"
                  type="date"
                  value={formData.leaseStart}
                  onChange={(e) => setFormData({ ...formData, leaseStart: e.target.value })}
                  className={errors.leaseStart ? "border-red-500" : ""}
                />
                {errors.leaseStart && <p className="text-xs text-red-500 mt-1">{errors.leaseStart}</p>}
              </div>

              <div>
                <Label htmlFor="leaseTermMonths" className="text-sm">
                  Lease Term (Months)
                </Label>
                <Select
                  value={formData.leaseTermMonths}
                  onValueChange={(value) => setFormData({ ...formData, leaseTermMonths: value })}
                >
                  <SelectTrigger id="leaseTermMonths">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                    <SelectItem value="48">48 months</SelectItem>
                    <SelectItem value="60">60 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="monthlyRent" className="text-sm">
                  Monthly Rent (₱)
                </Label>
                <Input
                  id="monthlyRent"
                  type="number"
                  placeholder="Enter monthly rent amount"
                  value={formData.monthlyRent}
                  onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                  className={errors.monthlyRent ? "border-red-500" : ""}
                />
                {errors.monthlyRent && <p className="text-xs text-red-500 mt-1">{errors.monthlyRent}</p>}
              </div>

              <div>
                <Label htmlFor="securityDeposit" className="text-sm">
                  Security Deposit (₱)
                </Label>
                <Input
                  id="securityDeposit"
                  type="number"
                  placeholder="Enter security deposit amount"
                  value={formData.securityDeposit}
                  onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                  className={errors.securityDeposit ? "border-red-500" : ""}
                />
                {errors.securityDeposit && <p className="text-xs text-red-500 mt-1">{errors.securityDeposit}</p>}
              </div>

              <div>
                <Label htmlFor="renewalOption" className="text-sm">
                  Renewal Option
                </Label>
                <Select
                  value={formData.renewalOption}
                  onValueChange={(value) => setFormData({ ...formData, renewalOption: value })}
                >
                  <SelectTrigger id="renewalOption">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Available</SelectItem>
                    <SelectItem value="no">Not Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1 bg-accent hover:bg-accent/90">
            Create Contract
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
