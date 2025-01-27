"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Link, Scissors, Copy, CheckCircle } from "lucide-react"

export default function URLShortener() {
  const [longUrl, setLongUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [urlHistory, setUrlHistory] = useState<{ longUrl: string; shortenedUrl: string }[]>([])
  const [copying, setCopying] = useState<string | null>(null)

  const generateShortUrl = async () => {
    try {
      const response = await fetch("/api/url/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          longUrl,
          userId: "12345", // This should be dynamically set in a real application
          metadata: {
            title: "URL Shortener",
            description: "Shortened URL from our awesome service",
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to shorten URL")
      }

      const data = await response.json()
      setShortUrl(data.shortenedUrl)
      setUrlHistory([{ longUrl, shortenedUrl: data.shortenedUrl }, ...urlHistory])
      setLongUrl("")
      toast.success("Short URL generated successfully!")
    } catch (error) {
      console.error("Error:", error)
      toast.error("Failed to generate short URL")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopying(text)
    setTimeout(() => setCopying(null), 2000)
    toast.info("Copied to clipboard!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-8">
          <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 1, ease: "easeInOut" }}>
            <Scissors className="mx-auto h-12 w-12 text-primary" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl"
          >
            URL Shortener
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-2 text-lg text-gray-600"
          >
            Shorten your long URLs with ease and professionalism.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8 overflow-hidden">
            <CardHeader>
              <CardTitle>Create Short URL</CardTitle>
              <CardDescription>Enter a long URL to generate a shortened version.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  type="url"
                  placeholder="Enter long URL"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  className="flex-grow"
                />
                <Button onClick={generateShortUrl} disabled={!longUrl}>
                  Shorten
                </Button>
              </div>
              <AnimatePresence>
                {shortUrl && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 p-4 bg-gray-50 rounded-md flex items-center justify-between overflow-hidden"
                  >
                    <span className="font-medium text-primary">{shortUrl}</span>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(shortUrl)}>
                      Copy
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {urlHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Your Shortened URLs</CardTitle>
                  <CardDescription>A history of your recently shortened URLs.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y divide-gray-200">
                    {urlHistory.map((item, index) => (
                      <motion.li
                        key={item.shortenedUrl}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="py-4 flex justify-between items-center"
                      >
                        <div className="flex items-center space-x-4">
                          <Link className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate" style={{ maxWidth: "300px" }}>
                              {item.longUrl}
                            </p>
                            <p className="text-sm text-primary truncate">{item.shortenedUrl}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(item.shortenedUrl)}
                          className="relative"
                        >
                          <AnimatePresence>
                            {copying === item.shortenedUrl ? (
                              <motion.span
                                key="check"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </motion.span>
                            ) : (
                              <motion.span
                                key="copy"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Copy className="h-4 w-4" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </Button>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  )
}

