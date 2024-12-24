import React, { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { appendToSheet } from "@/lib/sheets";
import { generatePDF } from "@/utils/generatePDF";

const billTypes = {
  electricity: {
    name: "Electricity",
    providers: [
      { id: "torrent", name: "Torrent Power" },
      { id: "dgvcl", name: "DGVCL" },
      { id: "other", name: "Other" }
    ]
  },
  gas: {
    name: "Pipe Gas",
    providers: [
      { id: "gujarat", name: "Gujarat Gas Company Limited" },
      { id: "other", name: "Other" }
    ]
  },
  water: {
    name: "SMC - Water Bill",
    providers: []
  },
  vera: {
    name: "SMC - Vera Bill",
    providers: []
  }
};

export default function BillForm({ accessToken }: { accessToken: string }) {
  const [formData, setFormData] = useState({
    consumerNumber: "",
    customerName: "",
    customerMobile: "",
    billType: "",
    provider: "",
    amount: "0",
    status: "Pending"
  });
  
  const generateConsumerNumber = () => {
    return `HK${new Date().getFullYear()}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
  };

  const generateReferenceId = () => {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!formData.consumerNumber) {
      setFormData(prev => ({
        ...prev,
        consumerNumber: generateConsumerNumber()
      }));
    }
  }, [formData.consumerNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const timestamp = new Date().toLocaleString();
    const referenceId = generateReferenceId();
  
    try {
      const billData = {
        receiptId: referenceId,
        timestamp,
        consumerNumber: formData.consumerNumber,
        customerName: formData.customerName,
        customerMobile: formData.customerMobile,
        billType: formData.billType,
        provider: formData.provider,
        amount: formData.amount,
        status: "Success"
      };
  
      await appendToSheet(accessToken, [
        [
          referenceId,
          timestamp,
          formData.consumerNumber,
          formData.customerName,
          formData.customerMobile,
          formData.billType,
          formData.provider,
          formData.amount,
          "Success"
        ]
      ]);
  
      // Generate and print PDF
      await generatePDF(billData);
      
      resetForm();
    } catch (error) {
      console.error("Error saving bill:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      consumerNumber: generateConsumerNumber(),
      customerName: "",
      customerMobile: "",
      billType: "",
      provider: "",
      amount: "0",
      status: "Pending"
    });
  };

  return (
    <Card className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Generate Bill</h2>
        <p className="text-gray-600">Fill in the details below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Consumer Number"
            value={formData.consumerNumber}
            disabled
            className="bg-gray-100"
          />
          <Input
            label="Customer Mobile"
            value={formData.customerMobile}
            onChange={(e) =>
              setFormData({ ...formData, customerMobile: e.target.value })
            }
            required
          />
        </div>

        <Input
          label="Customer Name"
          value={formData.customerName}
          onChange={(e) =>
            setFormData({ ...formData, customerName: e.target.value })
          }
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Bill Type
            </label>
            <select
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-red-500"
              value={formData.billType}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  billType: e.target.value,
                  provider: ""
                });
              }}
              required
            >
              <option value="" className="text-red-500">Select Bill Type</option>
              {Object.entries(billTypes).map(([key, value]) => (
                <option className="text-red-500" key={key} value={key}>
                  {value.name}
                </option>
              ))}
            </select>
          </div>

          {formData.billType && billTypes[formData.billType as keyof typeof billTypes].providers.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Provider
              </label>
              <select
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-red-500"
                value={formData.provider}
                onChange={(e) =>
                  setFormData({ ...formData, provider: e.target.value })
                }
                required
              >
                <option value="" className="text-red-500">Select Provider</option>
                {billTypes[formData.billType as keyof typeof billTypes].providers.map((provider) => (
                  <option key={provider.id} value={provider.id} className="text-red-500">
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <Input
          label="Amount"
          type="number"
          value={formData.amount}
          className="text-red-500"
          onChange={(e) =>
            setFormData({ ...formData, amount: e.target.value })
          }
          required
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={resetForm} className="text-red-500">
            Reset
          </Button>
          <Button type="submit" variant="primary">
            Generate Bill
          </Button>
        </div>
      </form>
    </Card>
  );
}