"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MobileHeader } from "@/components/mobile-header"
import {
  FileText,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Phone,
  Mail,
  MoreVertical,
  Building,
  Plus,
  Download,
  Ligature as Signature,
  CreditCard,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Trash2,
  Share2,
  Edit,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreateContractForm } from "@/components/create-contract-form"
import type { UserRole } from "@/types/user"

interface Contract {
  id: string
  propertyAddress: string
  tenantName: string
  tenantCompany: string
  leaseStart: string
  leaseEnd: string
  monthlyRent: string
  status: "active" | "expiring" | "expired"
  tenantContact: {
    phone: string
    email: string
  }
  leaseDetails: {
    term: string
    deposit: string
    renewalOption: boolean
  }
  contractSigned: boolean
  rentPaid: boolean
  lastPaymentDate?: string
  nextPaymentDue?: string
}

interface ContractManagementProps {
  onBack: () => void
  userRole: UserRole
  newContractData?: any
}

const mockLandlordContracts: Contract[] = [
  {
    id: "1",
    propertyAddress: "123 Main Street, Downtown, Springfield, IL",
    tenantName: "Global Innovations Inc.",
    tenantCompany: "Tech Solutions Corp",
    leaseStart: "2024-01-15",
    leaseEnd: "2026-01-14",
    monthlyRent: "₱5,000/month",
    status: "active",
    tenantContact: {
      phone: "+1 (555) 123-4567",
      email: "contact@globalinnovations.com",
    },
    leaseDetails: {
      term: "24 months (2024-2026)",
      deposit: "₱10,000/month",
      renewalOption: true,
    },
    contractSigned: true,
    rentPaid: true,
    lastPaymentDate: "2024-10-01",
    nextPaymentDue: "2024-11-01",
  },
  {
    id: "2",
    propertyAddress: "789 Retail Plaza, City Center, Gotham, NJ",
    tenantName: "Fashion Forward Boutique",
    tenantCompany: "Harmony Holdings",
    leaseStart: "2023-06-01",
    leaseEnd: "2025-05-31",
    monthlyRent: "₱4,600/month",
    status: "expiring",
    tenantContact: {
      phone: "+1 (555) 987-6543",
      email: "info@fashionforward.com",
    },
    leaseDetails: {
      term: "24 months (2023-2025)",
      deposit: "₱9,200/month",
      renewalOption: false,
    },
    contractSigned: true,
    rentPaid: true,
    lastPaymentDate: "2024-10-01",
    nextPaymentDue: "2024-11-01",
  },
]

const mockTenantContracts: Contract[] = [
  {
    id: "1",
    propertyAddress: "456 Business Ave, Downtown District",
    tenantName: "My Business LLC",
    tenantCompany: "My Business LLC",
    leaseStart: "2024-03-01",
    leaseEnd: "2026-02-28",
    monthlyRent: "₱8,500/month",
    status: "active",
    tenantContact: {
      phone: "+1 (555) 555-0123",
      email: "contact@mybusiness.com",
    },
    leaseDetails: {
      term: "24 months (2024-2026)",
      deposit: "₱17,000",
      renewalOption: true,
    },
    contractSigned: false,
    rentPaid: false,
    nextPaymentDue: "2024-11-01",
  },
]

export function ContractManagement({ onBack, userRole, newContractData }: ContractManagementProps) {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [showSignDialog, setShowSignDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showRenewalDialog, setShowRenewalDialog] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [contractSigned, setContractSigned] = useState(false)
  const [paymentProcessed, setPaymentProcessed] = useState(false)
  const [editFormData, setEditFormData] = useState<Contract | null>(null)

  const [contracts, setContracts] = useState<Contract[]>(() => {
    if (newContractData && userRole === "tenant") {
      const newContract: Contract = {
        id: Date.now().toString(),
        propertyAddress: newContractData.property?.title || "New Property",
        tenantName: newContractData.formData?.businessName || "New Tenant",
        tenantCompany: newContractData.formData?.businessName || "New Company",
        leaseStart: newContractData.formData?.startDate || new Date().toISOString().split("T")[0],
        leaseEnd: new Date(
          new Date().setMonth(
            new Date().getMonth() + Number.parseInt(newContractData.formData?.leaseTermMonths || "12"),
          ),
        )
          .toISOString()
          .split("T")[0],
        monthlyRent: newContractData.property?.price || "₱0/month",
        status: "active",
        tenantContact: {
          phone: newContractData.formData?.phone || "",
          email: newContractData.formData?.email || "",
        },
        leaseDetails: {
          term: `${newContractData.formData?.leaseTermMonths || "12"} months`,
          deposit: `₱${(Number.parseInt(newContractData.property?.price?.replace(/[^0-9]/g, "") || "0") * 2).toLocaleString()}`,
          renewalOption: true,
        },
        contractSigned: false,
        rentPaid: false,
        nextPaymentDue: newContractData.formData?.startDate || new Date().toISOString().split("T")[0],
      }
      return [newContract, ...mockTenantContracts]
    }
    return userRole === "landlord" ? mockLandlordContracts : mockTenantContracts
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 hover:bg-green-100"
      case "expiring":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
      case "expired":
        return "bg-red-100 text-red-700 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "expiring":
        return "Expiring Soon"
      case "expired":
        return "Expired"
      default:
        return "Unknown"
    }
  }

  const handleSignContract = () => {
    if (selectedContract) {
      setContracts(contracts.map((c) => (c.id === selectedContract.id ? { ...c, contractSigned: true } : c)))
      setSelectedContract({ ...selectedContract, contractSigned: true })
      setContractSigned(true)
      setShowSignDialog(false)
    }
  }

  const handlePayRent = () => {
    if (selectedContract) {
      const nextMonth = new Date(selectedContract.nextPaymentDue || new Date())
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      setContracts(
        contracts.map((c) =>
          c.id === selectedContract.id
            ? {
                ...c,
                rentPaid: true,
                lastPaymentDate: new Date().toISOString().split("T")[0],
                nextPaymentDue: nextMonth.toISOString().split("T")[0],
              }
            : c,
        ),
      )
      setSelectedContract({
        ...selectedContract,
        rentPaid: true,
        lastPaymentDate: new Date().toISOString().split("T")[0],
        nextPaymentDue: nextMonth.toISOString().split("T")[0],
      })
      setPaymentProcessed(true)
      setShowPaymentDialog(false)
    }
  }

  const handleRenewContract = () => {
    if (selectedContract) {
      const newEndDate = new Date(selectedContract.leaseEnd)
      newEndDate.setFullYear(newEndDate.getFullYear() + 1)
      setContracts(
        contracts.map((c) =>
          c.id === selectedContract.id
            ? {
                ...c,
                leaseEnd: newEndDate.toISOString().split("T")[0],
                status: "active",
              }
            : c,
        ),
      )
      setSelectedContract({
        ...selectedContract,
        leaseEnd: newEndDate.toISOString().split("T")[0],
        status: "active",
      })
      setShowRenewalDialog(false)
    }
  }

  const handleContractAction = (action: string, contract: Contract) => {
    switch (action) {
      case "download":
        console.log("Downloading contract:", contract.id)
        break
      case "share":
        console.log("Sharing contract:", contract.id)
        break
      case "delete":
        setContracts(contracts.filter((c) => c.id !== contract.id))
        setSelectedContract(null)
        break
      case "send-reminder":
        console.log("Sending reminder for contract:", contract.id)
        break
    }
  }

  const handleCreateContract = (contractData: any) => {
    const newContract: Contract = {
      id: Date.now().toString(),
      propertyAddress: contractData.propertyAddress,
      tenantName: contractData.tenantName,
      tenantCompany: contractData.tenantCompany,
      leaseStart: contractData.leaseStart,
      leaseEnd: contractData.leaseEnd,
      monthlyRent: contractData.monthlyRent,
      status: "active",
      tenantContact: contractData.tenantContact,
      leaseDetails: contractData.leaseDetails,
      contractSigned: false,
      rentPaid: false,
      nextPaymentDue: contractData.leaseStart,
    }
    setContracts([newContract, ...contracts])
    setShowCreateDialog(false)
  }

  const handleEditContract = () => {
    if (editFormData && selectedContract) {
      setContracts(contracts.map((c) => (c.id === selectedContract.id ? editFormData : c)))
      setSelectedContract(editFormData)
      setEditFormData(null)
      setShowEditDialog(false)
    }
  }

  const openEditDialog = () => {
    if (selectedContract) {
      setEditFormData({ ...selectedContract })
      setShowEditDialog(true)
    }
  }

  if (selectedContract) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader title="Contract Details" showBack onBack={() => setSelectedContract(null)} />

        <div className="mobile-content">
          {/* Contract Header */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h2 className="font-semibold mb-1">{selectedContract.propertyAddress}</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>Commercial Property</span>
                  </div>
                  <Badge className={getStatusColor(selectedContract.status)}>
                    {getStatusText(selectedContract.status)}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {userRole === "landlord" && (
                      <DropdownMenuItem onClick={openEditDialog}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Contract
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleContractAction("download", selectedContract)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleContractAction("share", selectedContract)}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Contract
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleContractAction("send-reminder", selectedContract)}>
                      Send Reminder
                    </DropdownMenuItem>
                    {userRole === "landlord" && (
                      <DropdownMenuItem
                        onClick={() => handleContractAction("delete", selectedContract)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Contract
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>

          {userRole === "landlord" ? (
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Tenant Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">{selectedContract.tenantName}</p>
                    <p className="text-sm text-muted-foreground">{selectedContract.tenantCompany}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedContract.tenantContact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedContract.tenantContact.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  Property Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Commercial Office Space</p>
                    <p className="text-sm text-muted-foreground">2,500 sq ft • Downtown District</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedContract.propertyAddress}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lease Details */}
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Lease Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Lease Term</p>
                    <p className="font-medium">{selectedContract.leaseDetails.term}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Rent</p>
                    <p className="font-medium">{selectedContract.monthlyRent}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Security Deposit</p>
                    <p className="font-medium">{selectedContract.leaseDetails.deposit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Renewal Option</p>
                    <p className="font-medium">
                      {selectedContract.leaseDetails.renewalOption ? "Available" : "Not Available"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Property Location Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDOkacc-eNabe9UcLc2dkYUORsAyVf-9rE&q=${encodeURIComponent(selectedContract.propertyAddress)}`}
                ></iframe>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Contract Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Signature className="h-4 w-4 text-primary" />
                    <span className="text-sm">Contract Signed</span>
                  </div>
                  {selectedContract.contractSigned ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  )}
                </div>
                {userRole === "tenant" && selectedContract.nextPaymentDue && (
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <div>
                        <span className="text-sm">Next Payment Due</span>
                        <p className="text-xs text-muted-foreground">{selectedContract.nextPaymentDue}</p>
                      </div>
                    </div>
                    {selectedContract.rentPaid ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {userRole === "tenant" && !selectedContract.contractSigned && (
              <Dialog open={showSignDialog} onOpenChange={setShowSignDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <Signature className="h-4 w-4 mr-2" />
                    Sign Contract
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Sign Contract</DialogTitle>
                    <DialogDescription>
                      By signing this contract, you agree to all terms and conditions outlined in the lease agreement.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2">Contract Summary:</p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>Property: {selectedContract.propertyAddress}</li>
                        <li>Monthly Rent: {selectedContract.monthlyRent}</li>
                        <li>Lease Term: {selectedContract.leaseDetails.term}</li>
                      </ul>
                    </div>
                    <Button onClick={handleSignContract} className="w-full bg-green-600 hover:bg-green-700">
                      Confirm & Sign
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {contractSigned && (
              <div className="p-3 bg-green-100 rounded-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-700">Contract signed successfully!</span>
              </div>
            )}

            {userRole === "tenant" && selectedContract.contractSigned && (
              <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-accent hover:bg-accent/90">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Rent
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Pay Rent</DialogTitle>
                    <DialogDescription>Process your monthly rent payment</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2">Payment Details:</p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>Amount: {selectedContract.monthlyRent}</li>
                        <li>Due Date: {selectedContract.nextPaymentDue}</li>
                        <li>Property: {selectedContract.propertyAddress}</li>
                      </ul>
                    </div>
                    <Button onClick={handlePayRent} className="w-full bg-green-600 hover:bg-green-700">
                      Confirm Payment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {paymentProcessed && (
              <div className="p-3 bg-green-100 rounded-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-700">Payment processed successfully!</span>
              </div>
            )}

            {selectedContract.leaseDetails.renewalOption && (
              <Dialog open={showRenewalDialog} onOpenChange={setShowRenewalDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full bg-transparent">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Renew Contract
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Renew Contract</DialogTitle>
                    <DialogDescription>Extend your lease agreement for another year</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2">Renewal Details:</p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>Current End Date: {selectedContract.leaseEnd}</li>
                        <li>
                          New End Date:{" "}
                          {
                            new Date(
                              new Date(selectedContract.leaseEnd).setFullYear(
                                new Date(selectedContract.leaseEnd).getFullYear() + 1,
                              ),
                            )
                              .toISOString()
                              .split("T")[0]
                          }
                        </li>
                        <li>Monthly Rent: {selectedContract.monthlyRent}</li>
                      </ul>
                    </div>
                    <Button onClick={handleRenewContract} className="w-full bg-blue-600 hover:bg-blue-700">
                      Confirm Renewal
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Contract</DialogTitle>
                <DialogDescription>Update contract details and terms</DialogDescription>
              </DialogHeader>
              {editFormData && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="property-address">Property Address</Label>
                    <Input
                      id="property-address"
                      value={editFormData.propertyAddress}
                      onChange={(e) => setEditFormData({ ...editFormData, propertyAddress: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tenant-name">Tenant Name</Label>
                    <Input
                      id="tenant-name"
                      value={editFormData.tenantName}
                      onChange={(e) => setEditFormData({ ...editFormData, tenantName: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tenant-company">Tenant Company</Label>
                    <Input
                      id="tenant-company"
                      value={editFormData.tenantCompany}
                      onChange={(e) => setEditFormData({ ...editFormData, tenantCompany: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tenant-phone">Phone</Label>
                    <Input
                      id="tenant-phone"
                      value={editFormData.tenantContact.phone}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          tenantContact: { ...editFormData.tenantContact, phone: e.target.value },
                        })
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tenant-email">Email</Label>
                    <Input
                      id="tenant-email"
                      type="email"
                      value={editFormData.tenantContact.email}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          tenantContact: { ...editFormData.tenantContact, email: e.target.value },
                        })
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="lease-start">Lease Start Date</Label>
                    <Input
                      id="lease-start"
                      type="date"
                      value={editFormData.leaseStart}
                      onChange={(e) => setEditFormData({ ...editFormData, leaseStart: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="lease-end">Lease End Date</Label>
                    <Input
                      id="lease-end"
                      type="date"
                      value={editFormData.leaseEnd}
                      onChange={(e) => setEditFormData({ ...editFormData, leaseEnd: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="monthly-rent">Monthly Rent</Label>
                    <Input
                      id="monthly-rent"
                      value={editFormData.monthlyRent}
                      onChange={(e) => setEditFormData({ ...editFormData, monthlyRent: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="security-deposit">Security Deposit</Label>
                    <Input
                      id="security-deposit"
                      value={editFormData.leaseDetails.deposit}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          leaseDetails: { ...editFormData.leaseDetails, deposit: e.target.value },
                        })
                      }
                      className="mt-1"
                    />
                  </div>

                  <Button onClick={handleEditContract} className="w-full bg-primary hover:bg-primary/90">
                    Save Changes
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    )
  }

  const activeContracts = contracts.filter((c) => c.status === "active").length
  const expiringContracts = contracts.filter((c) => c.status === "expiring").length
  const expiredContracts = contracts.filter((c) => c.status === "expired").length

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title={userRole === "landlord" ? "Contract Management" : "My Contracts"} showBack onBack={onBack} />

      <div className="mobile-content">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="stat-card">
            <CardContent className="p-3">
              <div className="text-center">
                <div className={`text-xl font-bold ${userRole === "landlord" ? "text-accent" : "text-primary"}`}>
                  {activeContracts}
                </div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card">
            <CardContent className="p-3">
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-600">{expiringContracts}</div>
                <div className="text-xs text-muted-foreground">Expiring</div>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card">
            <CardContent className="p-3">
              <div className="text-center">
                <div className="text-xl font-bold text-red-600">{expiredContracts}</div>
                <div className="text-xs text-muted-foreground">Expired</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {userRole === "landlord" && (
          <Button
            className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3 mb-6"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Contract
          </Button>
        )}

        {/* Contracts List */}
        <div className="space-y-3">
          {contracts.map((contract) => (
            <Card
              key={contract.id}
              className="property-card cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedContract(contract)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1">{contract.propertyAddress}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <User className="h-3 w-3" />
                        <span>{userRole === "landlord" ? contract.tenantName : "My Business"}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(contract.status)}>{getStatusText(contract.status)}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {new Date(contract.leaseStart).toLocaleDateString()} -{" "}
                        {new Date(contract.leaseEnd).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{contract.monthlyRent}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedContract(contract)
                      }}
                    >
                      View Contract
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <CreateContractForm open={showCreateDialog} onOpenChange={setShowCreateDialog} onSubmit={handleCreateContract} />
    </div>
  )
}
