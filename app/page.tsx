"use client";

import { useState, useEffect } from "react";
import { 
  Link2, 
  QrCode, 
  Copy, 
  Check, 
  Trash2, 
  History, 
  Sparkles, 
  ExternalLink, 
  MessageSquare, 
  Zap, 
  Globe, 
  RefreshCw, 
  Download, 
  Search,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

interface HistoryItem {
  id: string;
  type: "whatsapp" | "redirect" | "utm";
  title: string;
  originalUrl: string;
  generatedUrl: string;
  createdAt: string;
}

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [origin, setOrigin] = useState("http://localhost:3000");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State for WhatsApp Generator
  const [waPhone, setWaPhone] = useState("");
  const [waText, setWaText] = useState("");
  
  // State for Smart Redirect Linker
  const [redirectTarget, setRedirectTarget] = useState("");
  const [redirectType, setRedirectType] = useState<"clean" | "secure">("secure");
  
  // State for UTM Builder
  const [utmTarget, setUtmTarget] = useState("");
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [utmTerm, setUtmTerm] = useState("");
  const [utmContent, setUtmContent] = useState("");
  
  // Active Generated Link
  const [activeLink, setActiveLink] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      document.title = "GAUR LINKS – Dynamic Redirector & Smart Link Generator";
      setOrigin(window.location.origin);
      // Load History
      const savedHistory = localStorage.getItem("gaur_link_history");
      if (savedHistory) {
        try {
          setHistory(JSON.parse(savedHistory));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Save history helper
  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem("gaur_link_history", JSON.stringify(newHistory));
  };

  // Copy helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Generate WhatsApp Link
  const handleGenerateWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waPhone) {
      toast.error("Please enter a phone number");
      return;
    }
    
    // Clean phone number (keep numbers only)
    const cleanedPhone = waPhone.replace(/\D/g, "");
    if (cleanedPhone.length < 7) {
      toast.error("Please enter a valid phone number with country code");
      return;
    }

    let url = `${origin}/${cleanedPhone}`;
    if (waText) {
      url += `?text=${encodeURIComponent(waText)}`;
    }

    setActiveLink(url);
    
    // Add to history
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      type: "whatsapp",
      title: `WhatsApp: +${cleanedPhone}`,
      originalUrl: `https://wa.me/${cleanedPhone}${waText ? `?text=${encodeURIComponent(waText)}` : ""}`,
      generatedUrl: url,
      createdAt: new Date().toLocaleString(),
    };
    saveHistory([newItem, ...history]);
    toast.success("WhatsApp Link Generated!");
  };

  // Generate Smart Redirect Link
  const handleGenerateRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!redirectTarget) {
      toast.error("Please enter a destination URL");
      return;
    }

    let targetUrl = redirectTarget.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = "https://" + targetUrl;
    }

    try {
      new URL(targetUrl);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    let generatedUrl = "";
    if (redirectType === "clean") {
      generatedUrl = `${origin}/link/${encodeURIComponent(targetUrl)}`;
    } else {
      // Base64 encoding
      const encoded = btoa(unescape(encodeURIComponent(targetUrl)));
      generatedUrl = `${origin}/r/${encoded}`;
    }

    setActiveLink(generatedUrl);

    // Add to history
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      type: "redirect",
      title: `Redirect to: ${new URL(targetUrl).hostname}`,
      originalUrl: targetUrl,
      generatedUrl: generatedUrl,
      createdAt: new Date().toLocaleString(),
    };
    saveHistory([newItem, ...history]);
    toast.success("Redirect Link Generated!");
  };

  // Generate UTM Link
  const handleGenerateUtm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utmTarget) {
      toast.error("Please enter a destination URL");
      return;
    }

    let targetUrl = utmTarget.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = "https://" + targetUrl;
    }

    try {
      const urlObj = new URL(targetUrl);
      if (utmSource) urlObj.searchParams.set("utm_source", utmSource);
      if (utmMedium) urlObj.searchParams.set("utm_medium", utmMedium);
      if (utmCampaign) urlObj.searchParams.set("utm_campaign", utmCampaign);
      if (utmTerm) urlObj.searchParams.set("utm_term", utmTerm);
      if (utmContent) urlObj.searchParams.set("utm_content", utmContent);
      
      const finalUrl = urlObj.toString();
      
      // Let's create an obfuscated link redirecting to this UTM link
      const encoded = btoa(unescape(encodeURIComponent(finalUrl)));
      const generatedUrl = `${origin}/r/${encoded}`;
      
      setActiveLink(generatedUrl);

      // Add to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        type: "utm",
        title: `UTM Campaign for: ${urlObj.hostname}`,
        originalUrl: finalUrl,
        generatedUrl: generatedUrl,
        createdAt: new Date().toLocaleString(),
      };
      saveHistory([newItem, ...history]);
      toast.success("UTM Campaign Link Generated!");
    } catch {
      toast.error("Please enter a valid URL");
    }
  };

  const deleteHistoryItem = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    saveHistory(updated);
    toast.success("Deleted from history");
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear all history?")) {
      saveHistory([]);
      toast.success("History cleared");
    }
  };

  // Filter history
  const filteredHistory = history.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.generatedUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Quick helper to download QR code image
  const downloadQrCode = (url: string, filename: string = "qrcode.png") => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(url)}`;
    
    // We open it in a new window or trigger download via canvas fetch
    fetch(qrUrl)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(blobUrl);
        toast.success("Downloading QR Code...");
      })
      .catch(() => {
        // Fallback: Open in new tab
        window.open(qrUrl, "_blank");
      });
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Toaster position="top-right" theme="dark" />
      <Navbar />

      {/* Decorative Blur Backdrops */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 pt-32 pb-16 relative z-10 max-w-6xl">
        {/* Header Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4 animate-pulse">
            <Sparkles className="w-4 h-4" />
            Stateless Link Generation Workspace
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-indigo-400 to-purple-400">
            GAUR DYNAMIC LINKS
          </h1>
          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Generate stateless redirection links, WhatsApp direct chat URLs, and campaign UTM codes instantly with built-in QR code sharing.
          </p>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="bg-neutral-900/60 border-neutral-800 backdrop-blur-xl shadow-2xl overflow-hidden">
              <CardHeader className="border-b border-neutral-800 bg-neutral-900/40 pb-4">
                <CardTitle className="text-xl font-bold flex items-center gap-2 text-indigo-300">
                  <Zap className="w-5 h-5 text-indigo-500" /> Link Builder Workspace
                </CardTitle>
                <CardDescription className="text-neutral-400">
                  Choose a tool below to generate your customized smart link.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="whatsapp" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-neutral-950/60 p-1 border border-neutral-800 rounded-lg mb-6">
                    <TabsTrigger 
                      value="whatsapp" 
                      className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-neutral-400 font-medium py-2 rounded-md transition-all duration-300"
                    >
                      <MessageSquare className="w-4 h-4 mr-2 inline" />
                      WhatsApp
                    </TabsTrigger>
                    <TabsTrigger 
                      value="redirect"
                      className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-neutral-400 font-medium py-2 rounded-md transition-all duration-300"
                    >
                      <Link2 className="w-4 h-4 mr-2 inline" />
                      Smart Redirect
                    </TabsTrigger>
                    <TabsTrigger 
                      value="utm"
                      className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-neutral-400 font-medium py-2 rounded-md transition-all duration-300"
                    >
                      <Globe className="w-4 h-4 mr-2 inline" />
                      UTM Builder
                    </TabsTrigger>
                  </TabsList>

                  {/* WhatsApp Form */}
                  <TabsContent value="whatsapp" className="mt-0">
                    <form onSubmit={handleGenerateWhatsApp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="wa-phone" className="text-sm font-semibold text-neutral-300">Phone Number (with Country Code)</Label>
                        <div className="relative">
                          <Input 
                            id="wa-phone"
                            placeholder="e.g. 919999999999 (India code 91)"
                            value={waPhone}
                            onChange={(e) => setWaPhone(e.target.value)}
                            className="bg-neutral-950/80 border-neutral-800 text-white placeholder-neutral-500 py-6 pl-4 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                          />
                        </div>
                        <p className="text-xs text-neutral-500">Do not include +, spaces, or dashes. Format: [Country Code][Number]</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="wa-text" className="text-sm font-semibold text-neutral-300">Default Chat Message (Optional)</Label>
                        <Textarea 
                          id="wa-text"
                          rows={4}
                          placeholder="Type the message you want visitors to automatically send you..."
                          value={waText}
                          onChange={(e) => setWaText(e.target.value)}
                          className="bg-neutral-950/80 border-neutral-800 text-white placeholder-neutral-500 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg p-4"
                        />
                      </div>

                      <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-6 rounded-lg font-bold transition-all duration-300 shadow-lg shadow-indigo-600/20">
                        Generate WhatsApp Link
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Smart Redirect Form */}
                  <TabsContent value="redirect" className="mt-0">
                    <form onSubmit={handleGenerateRedirect} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="redirect-target" className="text-sm font-semibold text-neutral-300">Destination URL</Label>
                        <Input 
                          id="redirect-target"
                          placeholder="e.g. https://www.yourdomain.com/landing-page"
                          value={redirectTarget}
                          onChange={(e) => setRedirectTarget(e.target.value)}
                          className="bg-neutral-950/80 border-neutral-800 text-white placeholder-neutral-500 py-6 pl-4 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                        />
                        <p className="text-xs text-neutral-500">Visitors will instantly be forwarded here when clicking your generated link.</p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-neutral-300 block mb-2">Obfuscation Mode</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div 
                            onClick={() => setRedirectType("secure")}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                              redirectType === "secure" 
                                ? "border-indigo-500 bg-indigo-500/10" 
                                : "border-neutral-800 bg-neutral-950/50 hover:border-neutral-700"
                            }`}
                          >
                            <span className="font-bold text-sm text-neutral-200">Secured Redirection</span>
                            <span className="text-xs text-neutral-400 mt-1">Obfuscates the destination URL using Base64 coding. Perfect for clean links.</span>
                          </div>
                          <div 
                            onClick={() => setRedirectType("clean")}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                              redirectType === "clean" 
                                ? "border-indigo-500 bg-indigo-500/10" 
                                : "border-neutral-800 bg-neutral-950/50 hover:border-neutral-700"
                            }`}
                          >
                            <span className="font-bold text-sm text-neutral-200">Clean URL Redirect</span>
                            <span className="text-xs text-neutral-400 mt-1">Leaves the target URL readable in the path. Simple and standard.</span>
                          </div>
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-6 rounded-lg font-bold transition-all duration-300 shadow-lg shadow-indigo-600/20">
                        Generate Redirection Link
                      </Button>
                    </form>
                  </TabsContent>

                  {/* UTM Builder Form */}
                  <TabsContent value="utm" className="mt-0">
                    <form onSubmit={handleGenerateUtm} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="utm-target" className="text-sm font-semibold text-neutral-300">Website URL</Label>
                        <Input 
                          id="utm-target"
                          placeholder="e.g. https://mywebsite.com"
                          value={utmTarget}
                          onChange={(e) => setUtmTarget(e.target.value)}
                          className="bg-neutral-950/80 border-neutral-800 text-white placeholder-neutral-500 py-6 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="utm-source" className="text-xs font-semibold text-neutral-400">Campaign Source (e.g. google, facebook)</Label>
                          <Input 
                            id="utm-source"
                            placeholder="google"
                            value={utmSource}
                            onChange={(e) => setUtmSource(e.target.value)}
                            className="bg-neutral-950/80 border-neutral-800 text-white placeholder-neutral-600 rounded-lg"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="utm-medium" className="text-xs font-semibold text-neutral-400">Campaign Medium (e.g. cpc, email, post)</Label>
                          <Input 
                            id="utm-medium"
                            placeholder="cpc"
                            value={utmMedium}
                            onChange={(e) => setUtmMedium(e.target.value)}
                            className="bg-neutral-950/80 border-neutral-800 text-white placeholder-neutral-600 rounded-lg"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="utm-campaign" className="text-xs font-semibold text-neutral-400">Campaign Name (e.g. summer_sale)</Label>
                          <Input 
                            id="utm-campaign"
                            placeholder="summer_sale"
                            value={utmCampaign}
                            onChange={(e) => setUtmCampaign(e.target.value)}
                            className="bg-neutral-950/80 border-neutral-800 text-white placeholder-neutral-600 rounded-lg"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="utm-content" className="text-xs font-semibold text-neutral-400">Campaign Content (e.g. logolink, textad)</Label>
                          <Input 
                            id="utm-content"
                            placeholder="banner_ad"
                            value={utmContent}
                            onChange={(e) => setUtmContent(e.target.value)}
                            className="bg-neutral-950/80 border-neutral-800 text-white placeholder-neutral-600 rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="utm-term" className="text-xs font-semibold text-neutral-400">Campaign Term (Optional - keywords)</Label>
                        <Input 
                          id="utm-term"
                          placeholder="marketing+strategy"
                          value={utmTerm}
                          onChange={(e) => setUtmTerm(e.target.value)}
                          className="bg-neutral-950/80 border-neutral-800 text-white placeholder-neutral-600 rounded-lg"
                        />
                      </div>

                      <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-6 rounded-lg font-bold transition-all duration-300 shadow-lg shadow-indigo-600/20">
                        Generate Obfuscated UTM Link
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Output / QR Code Side */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="bg-neutral-900/60 border-neutral-800 backdrop-blur-xl shadow-2xl h-full flex flex-col justify-between overflow-hidden">
              <CardHeader className="border-b border-neutral-800 bg-neutral-900/40 pb-4">
                <CardTitle className="text-xl font-bold flex items-center gap-2 text-indigo-300">
                  <QrCode className="w-5 h-5 text-indigo-500" /> Result & Sharing
                </CardTitle>
                <CardDescription className="text-neutral-400">
                  Copy your link, scan the QR code, or test the output.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8 flex-grow flex flex-col justify-center items-center">
                {activeLink ? (
                  <div className="w-full space-y-6 flex flex-col items-center">
                    {/* QR Code Container */}
                    <div className="p-4 bg-white rounded-2xl shadow-xl flex items-center justify-center transform hover:scale-[1.02] transition-transform duration-300 relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(activeLink)}`} 
                        alt="Generated Link QR Code"
                        className="w-48 h-48 md:w-56 md:h-56"
                      />
                    </div>

                    <div className="w-full space-y-3">
                      <Label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Generated Link URL</Label>
                      <div className="flex gap-2">
                        <Input 
                          readOnly
                          value={activeLink}
                          className="bg-neutral-950 border-neutral-800 text-indigo-300 font-mono text-sm py-5 rounded-lg select-all"
                        />
                        <Button 
                          onClick={() => copyToClipboard(activeLink)}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 h-auto rounded-lg"
                        >
                          {copiedLink ? <Check className="w-5 h-5 text-green-300" /> : <Copy className="w-5 h-5" />}
                        </Button>
                      </div>
                    </div>

                    {/* Action Row */}
                    <div className="grid grid-cols-2 gap-3 w-full">
                      <Button 
                        onClick={() => window.open(activeLink, "_blank")} 
                        variant="outline" 
                        className="border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white py-5 rounded-lg font-medium flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" /> Test Link
                      </Button>
                      <Button 
                        onClick={() => downloadQrCode(activeLink, "gaur_link_qr.png")}
                        variant="outline"
                        className="border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white py-5 rounded-lg font-medium flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" /> Download QR
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-600">
                      <Link2 className="w-8 h-8" />
                    </div>
                    <div className="max-w-xs mx-auto">
                      <h4 className="font-bold text-neutral-300 mb-1">No Active Link</h4>
                      <p className="text-neutral-500 text-sm">Fill in the workspace details on the left and submit to generate a redirect URL.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* History Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-neutral-200">
              <History className="w-6 h-6 text-indigo-500" /> Recently Generated Links
            </h2>
            {history.length > 0 && (
              <Button 
                onClick={clearHistory} 
                variant="ghost" 
                className="text-neutral-500 hover:text-red-400 flex items-center gap-1.5 p-0 bg-transparent hover:bg-transparent"
              >
                <Trash2 className="w-4 h-4" /> Clear All History
              </Button>
            )}
          </div>

          <Card className="bg-neutral-900/60 border-neutral-800 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-6 space-y-4">
              {/* Search and Filters */}
              {history.length > 0 && (
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <Input 
                    placeholder="Search your generated links history..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-neutral-950 border-neutral-800 text-white pl-10 py-5 rounded-lg placeholder-neutral-500 focus:ring-indigo-500"
                  />
                </div>
              )}

              {filteredHistory.length > 0 ? (
                <div className="divide-y divide-neutral-800/80">
                  {filteredHistory.map((item) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group">
                      <div className="space-y-1.5 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            item.type === "whatsapp" 
                              ? "bg-green-500/10 text-green-400" 
                              : item.type === "utm" 
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-purple-500/10 text-purple-400"
                          }`}>
                            {item.type.toUpperCase()}
                          </span>
                          <span className="text-neutral-500 text-xs">{item.createdAt}</span>
                        </div>
                        <h4 className="font-bold text-neutral-200 text-sm md:text-base truncate">{item.title}</h4>
                        <div className="flex flex-col gap-1">
                          <p className="text-neutral-400 text-xs font-mono truncate max-w-lg">
                            <span className="text-neutral-500 font-sans">Destination:</span> {item.originalUrl}
                          </p>
                          <p className="text-indigo-400 text-xs font-mono truncate max-w-lg">
                            <span className="text-neutral-500 font-sans">Redirect Link:</span> {item.generatedUrl}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                        <Button 
                          onClick={() => copyToClipboard(item.generatedUrl)}
                          variant="outline" 
                          size="sm"
                          className="border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800"
                        >
                          <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy
                        </Button>
                        <Button 
                          onClick={() => window.open(item.generatedUrl, "_blank")}
                          variant="outline" 
                          size="sm"
                          className="border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800"
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Visit
                        </Button>
                        <Button 
                          onClick={() => downloadQrCode(item.generatedUrl, "qr_code.png")}
                          variant="outline" 
                          size="sm"
                          className="border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800"
                          title="Download QR Code"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </Button>
                        <Button 
                          onClick={() => deleteHistoryItem(item.id)}
                          variant="ghost" 
                          size="sm"
                          className="text-neutral-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-600">
                    <History className="w-6 h-6" />
                  </div>
                  <div className="max-w-xs mx-auto">
                    <h4 className="font-bold text-neutral-400 mb-1">No Links Found</h4>
                    <p className="text-neutral-500 text-sm">
                      {searchQuery ? "No history matches your search filter." : "Generated links will appear in your history list automatically."}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
