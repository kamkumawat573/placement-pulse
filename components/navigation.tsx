"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useLogo } from "@/hooks/useLogo"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { 
  User, 
  LogOut, 
  BookOpen, 
  Home, 
  Info, 
  MessageSquare, 
  Phone, 
  Menu, 
  X,
  ChevronDown,
  Settings,
  Zap,
  FileText,
  GraduationCap
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function Navigation() {
  const { user, logout, loading } = useAuth()
  const { logo, loading: logoLoading } = useLogo()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [admin, setAdmin] = useState<AdminUser | null>(null)

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check admin authentication with caching
  useEffect(() => {
    const checkAdminAuth = async () => {
      // First check localStorage for instant UI
      const cachedAdmin = localStorage.getItem("admin")
      if (cachedAdmin) {
        try {
          const parsedAdmin = JSON.parse(cachedAdmin)
          setAdmin(parsedAdmin)
        } catch {
          localStorage.removeItem("admin")
        }
      }

      // Then verify with server in background
      try {
        const response = await fetch('/api/admin/me', {
          cache: "no-store",
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        if (response.ok) {
          const data = await response.json()
          setAdmin(data.admin)
          localStorage.setItem("admin", JSON.stringify(data.admin))
        } else {
          setAdmin(null)
          localStorage.removeItem("admin")
        }
      } catch (error) {
        // If server call fails, keep cached admin if available
        console.warn("Admin auth verification failed:", error)
        if (!cachedAdmin) {
          setAdmin(null)
        }
      }
    }
    checkAdminAuth()
  }, [])

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      setAdmin(null)
      localStorage.removeItem("admin")
      window.location.href = '/'
    } catch (error) {
      console.error('Admin logout failed:', error)
      // Clear local storage even if server call fails
      setAdmin(null)
      localStorage.removeItem("admin")
    }
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname?.startsWith(href)
  }

  const navLinkClass = (href: string, withIcon = false) =>
    `${withIcon ? "flex items-center gap-2 " : ""}` +
    `${isActive(href) ? "text-primary font-semibold after:w-full" : "text-muted-foreground hover:text-foreground"} ` +
    "relative transition-all duration-200 hover:scale-105 transform " +
    "after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:h-0.5 " +
    "after:bg-primary after:transition-all after:duration-200 " +
    `${isActive(href) ? "after:w-full" : "after:w-0 hover:after:w-full"}`

  const mobileNavLinkClass = (href: string, withIcon = false) =>
    `${withIcon ? "flex items-center gap-3 " : ""}` +
    `${isActive(href) ? "text-primary bg-primary/10 border-l-4 border-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"} ` +
    "block px-6 py-4 transition-all duration-150 hover:translate-x-1"

  return (
    <>
      {/* Floating Navbar */}
      <nav className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 ease-out ${
        scrolled 
          ? 'bg-background/50 backdrop-blur-xl border border-border/30 shadow-2xl shadow-primary/5 scale-[0.98]' 
          : 'bg-background/30 backdrop-blur-xl border border-border/10 shadow-xl shadow-black/10'
      } rounded-2xl`}>
        <div className="container mx-auto px-3 lg:px-4">
          <div className="flex items-center justify-between h-12 lg:h-14">
            
            {/* Logo */}
        <Link
          href="/"
          className="flex items-center hover:scale-105 transition-transform duration-300"
        >
          {logo && !logoLoading ? (
            <Image
              src={logo}
              alt="Placement Pulse"
              width={300}
              height={100}
              className="h-16 lg:h-24 w-auto"
              priority
            />
          ) : (
            <span className="text-xl lg:text-2xl font-bold text-primary">
              Placement Pulse
            </span>
          )}
        </Link>

            {/* Desktop Navigation - Center */}
            <div className="hidden lg:flex items-center space-x-6">
              <Link href="/" className={navLinkClass("/", true)}>
            <Home className="h-4 w-4" />
            Home
          </Link>
              <Link href="/courses" className={navLinkClass("/courses", true)}>
            <GraduationCap className="h-4 w-4" />
            Courses
          </Link>
              <Link href="/blogs" className={navLinkClass("/blogs", true)}>
            <FileText className="h-4 w-4" />
            Blogs
          </Link>
              <Link href="/features" className={navLinkClass("/features", true)}>
            <Zap className="h-4 w-4" />
            Features
          </Link>
              <Link href="/about" className={navLinkClass("/about", true)}>
            <Info className="h-4 w-4" />
            About Us
          </Link>
              <Link href="/testimonials" className={navLinkClass("/testimonials", true)}>
            <MessageSquare className="h-4 w-4" />
            Testimonials
          </Link>
              <Link href="/contact" className={navLinkClass("/contact", true)}>
            <Phone className="h-4 w-4" />
            Contact Us
          </Link>
        </div>

            {/* Desktop Auth Section - Right */}
            <div className="hidden lg:flex items-center gap-2">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-muted animate-pulse rounded-full"></div>
                  <div className="w-20 h-4 bg-muted animate-pulse rounded"></div>
                </div>
              ) : admin ? (
                <div className="flex items-center gap-2">
                  {/* Admin Dashboard Button */}
                  <Link href="/admin">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2 hover:bg-primary/10 hover:border-primary transition-all duration-200"
                    >
                      <Settings className="h-4 w-4" />
                      Admin Panel
                    </Button>
                  </Link>

                  {/* Admin Profile Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-2 hover:bg-primary/10 transition-all duration-200"
                      >
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="hidden md:block">{admin.name}</span>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 animate-in slide-in-from-top-1">
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        {admin.email}
                      </div>
                      <div className="px-2 py-1.5 text-xs text-primary font-medium">
                        {admin.role.toUpperCase()}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={handleAdminLogout} 
                        className="flex items-center gap-2 text-red-600 focus:text-red-600"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : user ? (
                <div className="flex items-center gap-2">
                  {/* Dashboard Button */}
              {user.enrolledCourse && (
                <Link href="/dashboard">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-2 hover:bg-primary/10 hover:border-primary transition-all duration-200"
                      >
                    <BookOpen className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              )}

                  {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-2 hover:bg-primary/10 transition-all duration-200"
                      >
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                        </div>
                        <span className="hidden md:block">{user.name}</span>
                        <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 animate-in slide-in-from-top-1">
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        {user.email}
                      </div>
                      <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Profile Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/images" className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Manage Images
                    </Link>
                  </DropdownMenuItem>
                  {!user.enrolledCourse && (
                    <DropdownMenuItem asChild>
                      <Link href="/enroll" className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Enroll in Course
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={logout} 
                        className="flex items-center gap-2 text-red-600 focus:text-red-600"
                      >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="hover:bg-primary/10 hover:border-primary transition-all duration-200"
                    >
                  Sign In
                </Button>
              </Link>
              <Link href="/enroll">
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-primary to-primary/80 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-primary/25"
                    >
                      Enroll Now
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile/Tablet Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="hover:bg-primary/10 transition-all duration-200"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 transition-transform duration-200" />
                ) : (
                  <Menu className="h-6 w-6 transition-transform duration-200" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen 
            ? 'max-h-screen opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="border-t border-border/20 bg-background/40 backdrop-blur-xl rounded-b-2xl">
            <div className="py-6 space-y-1">
              
              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                <Link 
                  href="/" 
                  className={mobileNavLinkClass("/", true)} 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  Home
                </Link>
                <Link 
                  href="/courses" 
                  className={mobileNavLinkClass("/courses", true)} 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <GraduationCap className="h-5 w-5" />
                  Courses
                </Link>
                <Link 
                  href="/blogs" 
                  className={mobileNavLinkClass("/blogs", true)} 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileText className="h-5 w-5" />
                  Blogs
                </Link>
                <Link 
                  href="/features" 
                  className={mobileNavLinkClass("/features", true)} 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Zap className="h-5 w-5" />
                  Features
                </Link>
                <Link 
                  href="/about" 
                  className={mobileNavLinkClass("/about", true)} 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Info className="h-5 w-5" />
                  About Us
                </Link>
                <Link 
                  href="/testimonials" 
                  className={mobileNavLinkClass("/testimonials", true)} 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MessageSquare className="h-5 w-5" />
                  Testimonials
                </Link>
                <Link 
                  href="/contact" 
                  className={mobileNavLinkClass("/contact", true)} 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Phone className="h-5 w-5" />
                  Contact Us
                </Link>
              </div>

              {/* Mobile Auth Section */}
              <div className="pt-6 px-6 border-t border-border/50">
                {loading ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-10 h-10 bg-muted animate-pulse rounded-full"></div>
                      <div className="space-y-2">
                        <div className="w-24 h-4 bg-muted animate-pulse rounded"></div>
                        <div className="w-32 h-3 bg-muted animate-pulse rounded"></div>
                      </div>
                    </div>
                  </div>
                ) : admin ? (
                  <div className="space-y-4">
                    {/* Admin Info */}
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{admin.name}</p>
                        <p className="text-sm text-muted-foreground">{admin.email}</p>
                        <p className="text-xs text-primary font-medium">{admin.role.toUpperCase()}</p>
                      </div>
                    </div>

                    {/* Admin Action Buttons */}
                    <div className="space-y-2">
                      <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start gap-3 h-12"
                        >
                          <Settings className="h-5 w-5" />
                          Admin Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          handleAdminLogout()
                          setMobileMenuOpen(false)
                        }}
                        className="w-full justify-start gap-3 h-12 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                ) : user ? (
                  <div className="space-y-4">
                    {/* User Info */}
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {user.enrolledCourse && (
                        <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full justify-start gap-3 h-12"
                          >
                            <BookOpen className="h-5 w-5" />
                            Dashboard
                          </Button>
                        </Link>
                      )}
                      <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start gap-3 h-12"
                        >
                          <Settings className="h-5 w-5" />
                          Profile Settings
                        </Button>
                      </Link>
                      {!user.enrolledCourse && (
                        <Link href="/enroll" onClick={() => setMobileMenuOpen(false)}>
                          <Button 
                            size="sm" 
                            className="w-full justify-start gap-3 h-12 bg-gradient-to-r from-primary to-primary/80"
                          >
                            <BookOpen className="h-5 w-5" />
                            Enroll in Course
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          logout()
                          setMobileMenuOpen(false)
                        }}
                        className="w-full justify-start gap-3 h-12 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full h-12 hover:bg-primary/10"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/enroll" onClick={() => setMobileMenuOpen(false)}>
                      <Button 
                        size="lg" 
                        className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 shadow-lg"
                      >
                  Enroll Now
                </Button>
              </Link>
            </div>
          )}
              </div>
            </div>
        </div>
      </div>
    </nav>

    </>
  )
}

export default Navigation