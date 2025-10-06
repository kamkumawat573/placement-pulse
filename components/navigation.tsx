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
  Users,
  FileText,
  GraduationCap,
  ShoppingCart
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
  const [cartCount, setCartCount] = useState<number>(0)

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
  // Sync cart count from localStorage and update on events
  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem('cartCourseIds')
        const ids = raw ? JSON.parse(raw) : []
        setCartCount(Array.isArray(ids) ? ids.length : 0)
      } catch {
        setCartCount(0)
      }
    }
    read()
    const onStorage = () => read()
    const onFocus = () => read()
    const onCartUpdated = () => read()
    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', onFocus)
    window.addEventListener('cartUpdated', onCartUpdated as any)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('cartUpdated', onCartUpdated as any)
    }
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
    `${withIcon ? "flex items-center gap-1.5 " : ""}` +
    `${isActive(href) ? "text-white font-semibold bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg shadow-md shadow-purple-500/25" : "text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-600 hover:shadow-md hover:shadow-purple-500/20"} ` +
    "relative transition-all duration-200 hover:scale-105 transform px-3 py-1.5 rounded-lg text-sm"

  const mobileNavLinkClass = (href: string, withIcon = false) =>
    `${withIcon ? "flex items-center gap-2 " : ""}` +
    `${isActive(href) ? "text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg mx-2 shadow-md shadow-purple-500/25" : "text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-600 hover:translate-x-1 hover:scale-105 rounded-lg mx-2 font-medium"} ` +
    "block px-4 py-2.5 transition-all duration-150 relative overflow-hidden group text-sm"

  return (
    <>
      {/* Floating Navbar */}
      <nav className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 ease-out ${
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border border-border/30 shadow-2xl shadow-primary/5 scale-[0.98]'
          : 'bg-background/40 backdrop-blur-xl border border-border/20 shadow-xl shadow-black/10'
      } rounded-2xl`}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 lg:h-16">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center hover:scale-105 transition-transform duration-300 flex-shrink-0"
            >
              <div className="relative">
                <Image
                  src="/placement-pulse-logo.png"
                  alt="Placement Pulse"
                  width={600}
                  height={180}
                  className="h-16 sm:h-20 lg:h-24 w-auto"
                  priority
                  unoptimized={false}
                  loading="eager"
                  onError={(e) => {
                    console.log('Logo image failed to load, falling back to text');
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary hidden">
                  Placement Pulse
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Center */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              <Link href="/" className={navLinkClass("/", true)}>
                <Home className="h-4 w-4" />
                <span className="hidden xl:inline">Home</span>
              </Link>
              <Link href="/courses" className={navLinkClass("/courses", true)}>
                <GraduationCap className="h-4 w-4" />
                <span className="hidden xl:inline">Courses</span>
              </Link>
              <Link href="/blogs" className={navLinkClass("/blogs", true)}>
                <FileText className="h-4 w-4" />
                <span className="hidden xl:inline">Blogs</span>
              </Link>
              <Link href="/features" className={navLinkClass("/features", true)}>
                <Users className="h-4 w-4" />
                <span className="hidden xl:inline">GD Topics</span>
              </Link>
              <Link href="/about" className={navLinkClass("/about", true)}>
                <Info className="h-4 w-4" />
                <span className="hidden xl:inline">About Us</span>
              </Link>
              <Link href="/testimonials" className={navLinkClass("/testimonials", true)}>
                <MessageSquare className="h-4 w-4" />
                <span className="hidden xl:inline">Testimonials</span>
              </Link>
              <Link href="/contact" className={navLinkClass("/contact", true)}>
                <Phone className="h-4 w-4" />
                <span className="hidden xl:inline">Contact Us</span>
              </Link>
            </div>

            {/* Desktop Auth Section - Right */}
            <div className="hidden lg:block mr-2">
              <Link href="/checkout" aria-label={`Open cart with ${cartCount} item${cartCount===1?"":"s"}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative hover:bg-primary/10 transition-all duration-200"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
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
                      <span className="hidden xl:inline">Admin Panel</span>
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
                        <span className="hidden md:block max-w-24 truncate">{admin.name}</span>
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
                        <span className="hidden xl:inline">Dashboard</span>
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
                        <span className="hidden md:block max-w-24 truncate">{user.name}</span>
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
                          <Link href="/courses" className="flex items-center gap-2">
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
                      <span className="hidden sm:inline">Sign In</span>
                      <span className="sm:hidden">Login</span>
                    </Button>
                  </Link>
                  <Link href="/auth?mode=signup">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-primary to-primary/80 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-primary/25"
                    >
                      <span className="hidden sm:inline">Enroll Now</span>
                      <span className="sm:hidden">Enroll</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile actions (Cart + Menu) */}
            <div className="lg:hidden flex items-center gap-1 flex-shrink-0">
              <Link href="/checkout" aria-label={`Open cart with ${cartCount} item${cartCount===1?"":"s"}`}>
                <Button variant="ghost" size="sm" className="relative hover:bg-primary/10 transition-all duration-200 p-2">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="hover:bg-primary/10 transition-all duration-200 p-2"
                aria-label="Toggle mobile menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5 transition-transform duration-200" />
                ) : (
                  <Menu className="h-5 w-5 transition-transform duration-200" />
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
          <div className="border-t border-border/20 bg-background/60 backdrop-blur-xl rounded-b-2xl">
            <div className="py-4 space-y-1">

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
                  <Users className="h-5 w-5" />
                  GD Topics
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
              <div className="pt-4 px-4 border-t border-border/50">
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
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{admin.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{admin.email}</p>
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
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{user.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
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
                        <Link href="/courses" onClick={() => setMobileMenuOpen(false)}>
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
                    <Link href="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)}>
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