"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Send, User, MessageSquare, CheckCircle, X } from "lucide-react"
import { apiConnector } from "../../../utils/apis.js"
import { toast } from "react-toastify"

export default function ContactForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if(!formData.name || !formData.message || !formData.email){
        toast.warning("Name, Email and Feedback cannot be empty");
        return ;
    }
    setIsSubmitting(true)
    const resData = await apiConnector('POST', '/feedback', {
        name : formData.name,
        email : formData.email,
        subject: formData.subject || "feedback",
        message : formData.message
    })
    
    if(resData.success){
      setIsSubmitting(false)
      setIsSubmitted(true)
    }
    else{
      setIsSubmitting(false);
      toast.error("Something went wrong while sending feedback");
    }

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: "", email: "", subject: "", message: "" })
      onClose()
    }, 3000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-modal max-w-2xl w-full rounded-2xl p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full glass-button text-white transition-all duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success State */}
        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Message Sent!</h2>
            <p className="text-[#546373] text-lg mb-2">Thank you for reaching out to us.</p>
            <p className="text-[#ADCCED] text-sm">We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#6D8196] to-[#ADCCED] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Contact Us</h2>
              <p className="text-[#546373] text-sm">Have a question or feedback? We'd love to hear from you.</p>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <Label htmlFor="name" className="text-[#ADCCED] text-sm font-medium flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="glass-input rounded-lg px-4 py-3"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email Field */}
                <div>
                  <Label htmlFor="email" className="text-[#ADCCED] text-sm font-medium flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="glass-input rounded-lg px-4 py-3"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              {/* Subject Field */}
              <div>
                <Label htmlFor="subject" className="text-[#ADCCED] text-sm font-medium flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  Subject
                </Label>
                <Input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  className="glass-input rounded-lg px-4 py-3"
                  placeholder="What's this about?"
                  required
                />
              </div>

              {/* Message Field */}
              <div>
                <Label htmlFor="message" className="text-[#ADCCED] text-sm font-medium flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  Message
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="glass-input rounded-lg px-4 py-3 min-h-[120px] resize-none"
                  placeholder="Tell us more about your query, feedback, or suggestion..."
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 glass-button-primary py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </Button>
                <Button type="button" onClick={onClose} className="px-8 glass-button rounded-xl font-medium">
                  Cancel
                </Button>
              </div>
            </form>

            {/* Contact Info */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center md:text-left">
                <div>
                  <h4 className="text-white font-semibold mb-2">Quick Response</h4>
                  <p className="text-[#546373] text-sm">We typically respond within 24 hours</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Support Email</h4>
                  <p className="text-[#ADCCED] text-sm">notify.codeping@gmail.com</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
