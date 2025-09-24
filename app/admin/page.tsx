'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  GraduationCap, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  LogOut,
  Eye,
  Edit,
  Trash2,
  Plus,
  BookOpen,
  Megaphone,
  BarChart3,
  UserCheck,
  Clock,
  Star,
  MessageSquare,
  FileText,
  PlayCircle,
  Calendar,
  FileEdit,
  Image,
  Tag,
  User,
  Key,
  X
} from 'lucide-react';
import { ChangePasswordForm } from '@/components/admin/change-password-form';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  enrolledCourse: boolean;
  createdAt: string;
  transactionId?: string;
  bypassPayment?: boolean;
}

interface Stats {
  totalStudents: number;
  enrolledStudents: number;
  totalRevenue: number;
  recentEnrollments: number;
}


interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: string;
  priority: string;
  targetAudience: string;
  isActive: boolean;
  createdAt: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice: number;
  discount: string;
  duration: string;
  level: string;
  students: string;
  rating: number;
  reviews: string;
  category: string;
  instructor: string;
  image: string;
  features: string[];
  modules: any[];
  testimonials: any[];
  isActive: boolean;
  isFeatured: boolean;
  slug: string;
  createdAt: string;
}

interface Blog {
  _id: string;
  blogId?: string;
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
  coverImage?: string;
  author?: string;
  isVisible?: boolean;
  // Legacy fields
  caption?: string;
  imageUrl?: string;
  highlightedText?: string;
  highlightType?: string;
  createdAt: string;
}

interface Video {
  _id: string;
  videoId: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  views: number;
  createdAt: string;
}

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  adminNotes?: string;
  repliedAt?: string;
  closedAt?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [showCreateBlog, setShowCreateBlog] = useState(false);
  const [showCreateVideo, setShowCreateVideo] = useState(false);
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'general',
    priority: 'medium',
    targetAudience: 'all',
    expiresAt: '',
    specificStudents: [] as string[]
  });
  const [creatingAnnouncement, setCreatingAnnouncement] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [showEditAnnouncement, setShowEditAnnouncement] = useState(false);
  const [deletingAnnouncement, setDeletingAnnouncement] = useState<string | null>(null);
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showEditCourse, setShowEditCourse] = useState(false);
  const [updatingCourse, setUpdatingCourse] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    duration: '',
    category: 'preview',
    isActive: true,
    isFeatured: false,
    order: 0
  });
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    coverImage: '',
    author: 'Admin'
  });
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    discount: '50% OFF',
    duration: '',
    level: 'Beginner',
    category: '',
    instructor: '',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
    features: [''],
    modules: [{ week: '', title: '', lessons: '', duration: '' }],
    testimonials: [{ name: '', role: '', content: '', rating: 5, avatar: '' }],
    isActive: true,
    isFeatured: false
  });
  const [creatingBlog, setCreatingBlog] = useState(false);
  const [editingBlog, setEditingBlog] = useState<string | null>(null);
  const [creatingCourse, setCreatingCourse] = useState(false);
  const [editBlog, setEditBlog] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    coverImage: '',
    author: 'Admin',
    isVisible: true
  });
  const [updatingBlog, setUpdatingBlog] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    enrolledStudents: 0,
    totalRevenue: 0,
    recentEnrollments: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("students");
  const [settings, setSettings] = useState<any[]>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resettingRevenue, setResettingRevenue] = useState(false);
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [updatingSettings, setUpdatingSettings] = useState(false);
  const [updatingLogo, setUpdatingLogo] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [showCreateStudent, setShowCreateStudent] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  });
  const [creatingStudent, setCreatingStudent] = useState(false);
  const [editingPrice, setEditingPrice] = useState<Course | null>(null);
  const [priceForm, setPriceForm] = useState({
    price: '',
    originalPrice: '',
    discount: '',
    changeReason: ''
  });
  const [updatingPrice, setUpdatingPrice] = useState(false);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [loadingPriceHistory, setLoadingPriceHistory] = useState(false);
  const [showStudentView, setShowStudentView] = useState(false);
  const [showStudentEdit, setShowStudentEdit] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [loadingStudentDetails, setLoadingStudentDetails] = useState(false);
  const [editingStudent, setEditingStudent] = useState({
    name: '',
    email: '',
    mobile: '',
    enrolledCourse: false,
    bypassPayment: false
  });
  const [updatingStudent, setUpdatingStudent] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showMessageView, setShowMessageView] = useState(false);
  const [messageFilter, setMessageFilter] = useState<'all' | 'new' | 'read' | 'replied' | 'closed'>('all');
  const [messagePriority, setMessagePriority] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all');
  const [updatingMessage, setUpdatingMessage] = useState(false);
  const [messageNotes, setMessageNotes] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAdminAuth();
    fetchStudents();
    fetchCourses();
    fetchStats();
    fetchAnnouncements();
    fetchBlogs();
    fetchVideos();
    fetchSettings();
    fetchMessages();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const response = await fetch('/api/admin/me');
      if (response.ok) {
        const data = await response.json();
        setAdmin(data.admin);
      } else {
        router.push('/auth');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/admin/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data.students);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/admin/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const resetRevenue = async () => {
    setResettingRevenue(true);
    try {
      const response = await fetch('/api/admin/reset-revenue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confirm: true }),
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`Revenue reset successfully! Deleted ${data.deletedCount} payment records.`);
        fetchStats(); // Refresh stats
        setShowResetConfirm(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to reset revenue');
      }
    } catch (error) {
      console.error('Failed to reset revenue:', error);
      alert('Failed to reset revenue');
    } finally {
      setResettingRevenue(false);
    }
  };


  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/admin/announcements');
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.announcements);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const params = new URLSearchParams();
      if (messageFilter !== 'all') params.append('status', messageFilter);
      if (messagePriority !== 'all') params.append('priority', messagePriority);
      
      const response = await fetch(`/api/admin/messages?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setShowEditAnnouncement(true);
  };

  const handleUpdateAnnouncement = async () => {
    if (!editingAnnouncement) return;

    setCreatingAnnouncement(true);
    try {
      const response = await fetch(`/api/admin/announcements/${editingAnnouncement._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingAnnouncement.title,
          content: editingAnnouncement.content,
          type: editingAnnouncement.type,
          priority: editingAnnouncement.priority,
          targetAudience: editingAnnouncement.targetAudience,
          isActive: editingAnnouncement.isActive
        })
      });

      if (response.ok) {
        alert('Announcement updated successfully!');
        setShowEditAnnouncement(false);
        setEditingAnnouncement(null);
        fetchAnnouncements();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update announcement');
      }
    } catch (error) {
      console.error('Error updating announcement:', error);
      alert('Failed to update announcement');
    } finally {
      setCreatingAnnouncement(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    setDeletingAnnouncement(id);
    try {
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Announcement deleted successfully!');
        fetchAnnouncements();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete announcement');
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Failed to delete announcement');
    } finally {
      setDeletingAnnouncement(null);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/admin/blogs');
      if (response.ok) {
        const data = await response.json();
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/admin/videos');
      if (response.ok) {
        const data = await response.json();
        setVideos(data.videos);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
        
        // Find hero image setting
        const heroImageSetting = data.settings.find((s: any) => s.key === 'hero_image_url');
        if (heroImageSetting) {
          setHeroImageUrl(heroImageSetting.value);
        }
        
        // Find logo setting
        const logoSetting = data.settings.find((s: any) => s.key === 'logo_url');
        if (logoSetting) {
          setLogoUrl(logoSetting.value);
        } else {
          setLogoUrl('/placement-pulse-logo.png');
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const updateSettings = async () => {
    setUpdatingSettings(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'hero_image_url',
          value: heroImageUrl,
          type: 'string',
          description: 'Hero section image URL',
          category: 'appearance',
          isPublic: true
        })
      });

      if (response.ok) {
        alert('Settings updated successfully!');
        fetchSettings();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings');
    } finally {
      setUpdatingSettings(false);
    }
  };

  const updateLogo = async () => {
    setUpdatingLogo(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'logo_url',
          value: logoUrl,
          type: 'string',
          description: 'Website logo URL',
          category: 'appearance',
          isPublic: true
        })
      });

      if (response.ok) {
        alert('Logo updated successfully!');
        fetchSettings();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update logo');
      }
    } catch (error) {
      console.error('Error updating logo:', error);
      alert('Failed to update logo');
    } finally {
      setUpdatingLogo(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setLogoUrl(data.url);
        alert('File uploaded successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    } finally {
      setUploadingFile(false);
    }
  };

  const createStudent = async () => {
    if (!newStudent.name || !newStudent.email || !newStudent.password) {
      alert('Please fill in all required fields');
      return;
    }

    setCreatingStudent(true);
    try {
      const response = await fetch('/api/admin/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newStudent,
          enrolledCourse: true, // Auto-enroll the student
          transactionId: 'ADMIN_ENROLLED', // Mark as admin enrolled
          bypassPayment: true
        }),
      });

      if (response.ok) {
        alert('Student created and enrolled successfully!');
        setNewStudent({ name: '', email: '', mobile: '', password: '' });
        setShowCreateStudent(false);
        fetchStudents(); // Refresh the students list
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create student');
      }
    } catch (error) {
      console.error('Error creating student:', error);
      alert('Error creating student');
    } finally {
      setCreatingStudent(false);
    }
  };

  const createCourse = async () => {
    if (!newCourse.title || !newCourse.description || !newCourse.price || !newCourse.category || !newCourse.instructor) {
      alert('Please fill in all required fields');
      return;
    }

    setCreatingCourse(true);
    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newCourse,
          price: parseFloat(newCourse.price),
          originalPrice: parseFloat(newCourse.originalPrice),
          features: newCourse.features.filter(f => f.trim() !== ''),
          modules: newCourse.modules.filter(m => m.title.trim() !== ''),
          testimonials: newCourse.testimonials.filter(t => t.name.trim() !== '')
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Course created successfully:', data);
        setCourses([data.course, ...courses]);
        setNewCourse({
          title: '',
          description: '',
          shortDescription: '',
          price: '',
          originalPrice: '',
          discount: '50% OFF',
          duration: '',
          level: 'Beginner',
          category: '',
          instructor: '',
          image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
          features: [''],
          modules: [{ week: '', title: '', lessons: '', duration: '' }],
          testimonials: [{ name: '', role: '', content: '', rating: 5, avatar: '' }],
          isActive: true,
          isFeatured: false
        });
        setShowCreateCourse(false);
        alert('Course created successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error creating course:', errorData);
        alert(`Error creating course: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Error creating course. Please try again.');
    } finally {
      setCreatingCourse(false);
    }
  };

  const editCoursePrice = (course: Course) => {
    setEditingPrice(course);
    setPriceForm({
      price: course.price.toString(),
      originalPrice: course.originalPrice.toString(),
      discount: course.discount || '',
      changeReason: ''
    });
    fetchPriceHistory(course._id);
  };

  const fetchPriceHistory = async (courseId: string) => {
    setLoadingPriceHistory(true);
    try {
      const response = await fetch(`/api/admin/courses/${courseId}/price-history`);
      if (response.ok) {
        const data = await response.json();
        setPriceHistory(data.priceHistory || []);
      }
    } catch (error) {
      console.error('Error fetching price history:', error);
    } finally {
      setLoadingPriceHistory(false);
    }
  };

  const updateCoursePrice = async () => {
    if (!editingPrice || !priceForm.price) {
      alert('Please enter a valid price');
      return;
    }

    setUpdatingPrice(true);
    try {
      const response = await fetch(`/api/admin/courses/${editingPrice._id}/price`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: parseFloat(priceForm.price),
          originalPrice: priceForm.originalPrice ? parseFloat(priceForm.originalPrice) : undefined,
          discount: priceForm.discount || undefined,
          changeReason: priceForm.changeReason || undefined
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Price updated successfully:', data);
        
        // Update the course in the courses array
        setCourses(courses.map(course => 
          course._id === editingPrice._id 
            ? { ...course, price: data.course.price, originalPrice: data.course.originalPrice, discount: data.course.discount }
            : course
        ));
        
        setEditingPrice(null);
        setPriceForm({ price: '', originalPrice: '', discount: '', changeReason: '' });
        setPriceHistory([]);
        alert('Course price updated successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error updating price:', errorData);
        alert(`Error updating price: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating price:', error);
      alert('Error updating price. Please try again.');
    } finally {
      setUpdatingPrice(false);
    }
  };

  const cancelPriceEdit = () => {
    setEditingPrice(null);
    setPriceForm({ price: '', originalPrice: '', discount: '', changeReason: '' });
    setPriceHistory([]);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowEditCourse(true);
  };

  const updateCourse = async () => {
    if (!editingCourse) return;

    setUpdatingCourse(true);
    try {
      const response = await fetch(`/api/admin/courses/${editingCourse._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingCourse.title,
          description: editingCourse.description,
          shortDescription: editingCourse.shortDescription,
          price: editingCourse.price,
          originalPrice: editingCourse.originalPrice,
          discount: editingCourse.discount,
          duration: editingCourse.duration,
          level: editingCourse.level,
          category: editingCourse.category,
          instructor: editingCourse.instructor,
          image: editingCourse.image,
          features: editingCourse.features,
          modules: editingCourse.modules,
          testimonials: editingCourse.testimonials,
          isActive: editingCourse.isActive,
          isFeatured: editingCourse.isFeatured
        })
      });

      if (response.ok) {
        alert('Course updated successfully!');
        setShowEditCourse(false);
        setEditingCourse(null);
        fetchCourses();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update course');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course');
    } finally {
      setUpdatingCourse(false);
    }
  };

  const createVideo = async () => {
    if (!newVideo.title.trim()) {
      alert('Title is required');
      return;
    }

    if (!newVideo.videoUrl.trim()) {
      alert('Video URL is required');
      return;
    }

    setCreatingBlog(true);
    try {
      const response = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVideo),
      });

      if (response.ok) {
        const data = await response.json();
        setVideos([...videos, data.video]);
        setNewVideo({
          title: '',
          description: '',
          videoUrl: '',
          thumbnailUrl: '',
          duration: '',
          category: 'preview',
          isActive: true,
          isFeatured: false,
          order: 0
        });
        setShowCreateVideo(false);
        alert('Video created successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create video');
      }
    } catch (error) {
      console.error('Error creating video:', error);
      alert('Failed to create video');
    } finally {
      setCreatingBlog(false);
    }
  };

  const editVideo = (video: Video) => {
    setEditingVideo(video);
    setNewVideo({
      title: video.title,
      description: video.description || '',
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl || '',
      duration: video.duration || '',
      category: video.category,
      isActive: video.isActive,
      isFeatured: video.isFeatured,
      order: video.order
    });
    setShowCreateVideo(true);
  };

  const updateVideo = async () => {
    if (!editingVideo) return;
    
    if (!newVideo.title.trim()) {
      alert('Title is required');
      return;
    }

    if (!newVideo.videoUrl.trim()) {
      alert('Video URL is required');
      return;
    }

    setCreatingBlog(true);
    try {
      const response = await fetch(`/api/admin/videos/${editingVideo.videoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVideo),
      });

      if (response.ok) {
        const data = await response.json();
        setVideos(videos.map(v => v.videoId === editingVideo.videoId ? data.video : v));
        setEditingVideo(null);
        setNewVideo({
          title: '',
          description: '',
          videoUrl: '',
          thumbnailUrl: '',
          duration: '',
          category: 'preview',
          isActive: true,
          isFeatured: false,
          order: 0
        });
        setShowCreateVideo(false);
        alert('Video updated successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update video');
      }
    } catch (error) {
      console.error('Error updating video:', error);
      alert('Failed to update video');
    } finally {
      setCreatingBlog(false);
    }
  };

  const deleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/videos/${videoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setVideos(videos.filter(v => v.videoId !== videoId));
        alert('Video deleted successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete video');
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Failed to delete video');
    }
  };

  const cancelEdit = () => {
    setEditingVideo(null);
    setNewVideo({
      title: '',
      description: '',
      videoUrl: '',
      thumbnailUrl: '',
      duration: '',
      category: 'preview',
      isActive: true,
      isFeatured: false,
      order: 0
    });
    setShowCreateVideo(false);
  };

  const setAsHomepageVideo = async (videoId: string) => {
    try {
      // First, unfeature all other videos
      const updatePromises = videos
        .filter(v => v.videoId !== videoId)
        .map(v => 
          fetch(`/api/admin/videos/${v.videoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...v, isFeatured: false })
          })
        );
      
      await Promise.all(updatePromises);

      // Then feature the selected video
      const response = await fetch(`/api/admin/videos/${videoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: true })
      });

      if (response.ok) {
        // Update local state
        setVideos(videos.map(v => ({
          ...v,
          isFeatured: v.videoId === videoId
        })));
        alert('Video set as homepage video successfully!');
      } else {
        alert('Failed to set video as homepage video');
      }
    } catch (error) {
      console.error('Error setting homepage video:', error);
      alert('Failed to set video as homepage video');
    }
  };

  const createBlog = async () => {
    if (!newBlog.title.trim()) {
      alert('Title is required');
      return;
    }

    if (!newBlog.content.trim()) {
      alert('Content is required');
      return;
    }

    if (newBlog.content.trim().length < 50) {
      alert('Content too short. Please provide at least 50 characters.');
      return;
    }

    setCreatingBlog(true);
    try {
      const response = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBlog),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || 'Blog created successfully!');
        setNewBlog({
          title: '',
          content: '',
          category: '',
          tags: '',
          coverImage: '',
          author: 'Admin'
        });
        setShowCreateBlog(false);
        fetchBlogs(); // Refresh the blog list
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to create blog post');
      }
    } catch (error) {
      console.error('Failed to create blog:', error);
      alert('Failed to create blog post');
    } finally {
      setCreatingBlog(false);
    }
  };

  const editBlogPost = async (blogId: string) => {
    try {
      const response = await fetch(`/api/admin/blogs/${blogId}`);
      if (response.ok) {
        const data = await response.json();
        const blog = data.blog;
        setEditBlog({
          title: blog.title || '',
          content: blog.content || '',
          category: blog.category || '',
          tags: blog.tags ? blog.tags.join(', ') : '',
          coverImage: blog.coverImage || '',
          author: blog.author || 'Admin',
          isVisible: blog.isVisible !== undefined ? blog.isVisible : true
        });
        setEditingBlog(blogId);
        setShowCreateBlog(false);
      }
    } catch (error) {
      console.error('Failed to fetch blog for editing:', error);
      alert('Failed to load blog for editing');
    }
  };

  const updateBlog = async () => {
    if (!editingBlog) return;

    if (!editBlog.title.trim()) {
      alert('Title is required');
      return;
    }

    if (!editBlog.content.trim()) {
      alert('Content is required');
      return;
    }

    if (editBlog.content.trim().length < 50) {
      alert('Content too short. Please provide at least 50 characters.');
      return;
    }

    setUpdatingBlog(true);
    try {
      const response = await fetch(`/api/admin/blogs/${editingBlog}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editBlog),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || 'Blog updated successfully!');
        setEditingBlog(null);
        setEditBlog({
          title: '',
          content: '',
          category: '',
          tags: '',
          coverImage: '',
          author: 'Admin',
          isVisible: true
        });
        fetchBlogs(); // Refresh the blog list
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update blog post');
      }
    } catch (error) {
      console.error('Failed to update blog:', error);
      alert('Failed to update blog post');
    } finally {
      setUpdatingBlog(false);
    }
  };

  const deleteBlog = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blogs/${blogId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Blog deleted successfully!');
        fetchBlogs(); // Refresh the blog list
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to delete blog post');
      }
    } catch (error) {
      console.error('Failed to delete blog:', error);
      alert('Failed to delete blog post');
    }
  };

  const toggleBlogVisibility = async (blogId: string, currentVisibility: boolean) => {
    try {
      const response = await fetch(`/api/admin/blogs/${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isVisible: !currentVisibility }),
      });

      if (response.ok) {
        alert(`Blog ${!currentVisibility ? 'published' : 'hidden'} successfully!`);
        fetchBlogs(); // Refresh the blog list
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update blog visibility');
      }
    } catch (error) {
      console.error('Failed to toggle blog visibility:', error);
      alert('Failed to update blog visibility');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const deleteStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
      const response = await fetch(`/api/admin/students/${studentId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setStudents(students.filter(s => s._id !== studentId));
        fetchStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Failed to delete student:', error);
    }
  };


  const viewStudent = async (student: Student) => {
    setSelectedStudent(student);
    setLoadingStudentDetails(true);
    setShowStudentView(true);
    
    try {
      const response = await fetch(`/api/admin/students/${student._id}`);
      if (response.ok) {
        const data = await response.json();
        setStudentDetails(data.student);
      } else {
        console.error('Failed to fetch student details');
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
    } finally {
      setLoadingStudentDetails(false);
    }
  };

  const editStudent = (student: Student) => {
    setSelectedStudent(student);
    setEditingStudent({
      name: student.name,
      email: student.email,
      mobile: student.mobile,
      enrolledCourse: student.enrolledCourse,
      bypassPayment: student.bypassPayment || false
    });
    setShowStudentEdit(true);
  };

  const updateStudent = async () => {
    if (!selectedStudent) return;
    
    setUpdatingStudent(true);
    try {
      const response = await fetch(`/api/admin/students/${selectedStudent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingStudent),
      });
      
      if (response.ok) {
        // Update local state
        setStudents(students.map(s => 
          s._id === selectedStudent._id 
            ? { ...s, ...editingStudent }
            : s
        ));
        setShowStudentEdit(false);
        setSelectedStudent(null);
        fetchStats(); // Refresh stats
        alert('Student updated successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update student');
      }
    } catch (error) {
      console.error('Failed to update student:', error);
      alert('Failed to update student');
    } finally {
      setUpdatingStudent(false);
    }
  };

  const viewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setMessageNotes(message.adminNotes || '');
    setShowMessageView(true);
    
    // Mark as read if it's new
    if (message.status === 'new') {
      updateMessageStatus(message._id, 'read');
    }
  };

  const updateMessageStatus = async (messageId: string, status: string, priority?: string, notes?: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status, 
          priority: priority || undefined, 
          adminNotes: notes || undefined 
        }),
      });
      
      if (response.ok) {
        fetchMessages(); // Refresh messages
      }
    } catch (error) {
      console.error('Failed to update message:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setMessages(messages.filter(m => m._id !== messageId));
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const saveMessageNotes = async () => {
    if (!selectedMessage) return;
    
    setUpdatingMessage(true);
    try {
      await updateMessageStatus(selectedMessage._id, selectedMessage.status, selectedMessage.priority, messageNotes);
      setShowMessageView(false);
      setSelectedMessage(null);
      setMessageNotes('');
    } catch (error) {
      console.error('Failed to save message notes:', error);
    } finally {
      setUpdatingMessage(false);
    }
  };

  const createAnnouncement = async () => {
    try {
      setCreatingAnnouncement(true);
      
      const response = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newAnnouncement.title,
          content: newAnnouncement.content,
          type: newAnnouncement.type,
          priority: newAnnouncement.priority,
          targetAudience: newAnnouncement.targetAudience,
          expiresAt: newAnnouncement.expiresAt || null,
          specificStudents: newAnnouncement.targetAudience === 'specific' ? selectedStudents : []
        }),
      });
      
      if (response.ok) {
        fetchAnnouncements(); // Refresh announcements
        setNewAnnouncement({
          title: '',
          content: '',
          type: 'general',
          priority: 'medium',
          targetAudience: 'all',
          expiresAt: '',
          specificStudents: []
        });
        setSelectedStudents([]);
        setShowCreateAnnouncement(false);
      }
    } catch (error) {
      console.error('Failed to create announcement:', error);
    } finally {
      setCreatingAnnouncement(false);
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 sm:py-4 gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">Admin Dashboard</h1>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 truncate">Welcome back, {admin.name}</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 w-full sm:w-auto">
              <Badge variant="outline" className="capitalize text-xs sm:text-sm px-2 py-1">
                {admin.role}
              </Badge>
              <Button onClick={handleLogout} variant="outline" size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm px-3 py-2">
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Exit</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium truncate">Total Students</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold">{stats.totalStudents}</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium truncate">Enrolled Students</CardTitle>
              <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold">{stats.enrolledStudents}</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium truncate">Total Revenue</CardTitle>
              <div className="flex items-center gap-2">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResetConfirm(true)}
                  className="h-6 px-2 text-xs"
                >
                  Reset
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium truncate">Recent Enrollments</CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold">{stats.recentEnrollments}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3 sm:space-y-4 lg:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 h-auto min-w-max">
              <TabsTrigger value="students" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Students</span>
                <span className="sm:hidden">Students</span>
              </TabsTrigger>
              <TabsTrigger value="courses" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
                <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Courses</span>
                <span className="sm:hidden">Courses</span>
              </TabsTrigger>
              <TabsTrigger value="announcements" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
                <Megaphone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Announcements</span>
                <span className="sm:hidden">News</span>
              </TabsTrigger>
              <TabsTrigger value="blogs" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Blogs</span>
                <span className="sm:hidden">Blogs</span>
              </TabsTrigger>
              <TabsTrigger value="videos" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
                <PlayCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Videos</span>
                <span className="sm:hidden">Videos</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Messages</span>
                <span className="sm:hidden">Messages</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Analytics</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
                <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Settings</span>
                <span className="sm:hidden">Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="students" className="space-y-3 sm:space-y-4 lg:space-y-6">
            <Card>
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base sm:text-lg lg:text-xl">Student Management</CardTitle>
                    <CardDescription className="text-xs sm:text-sm lg:text-base">
                      Manage all students and their enrollment status
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => setShowCreateStudent(!showCreateStudent)}
                    className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm px-3 py-2"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Create Student</span>
                    <span className="sm:hidden">Add Student</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6">
                {showCreateStudent && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Create New Student</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="studentName" className="text-xs sm:text-sm">Full Name *</Label>
                        <Input
                          id="studentName"
                          value={newStudent.name}
                          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                          placeholder="Enter student's full name"
                          className="mt-1 text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="studentEmail" className="text-xs sm:text-sm">Email *</Label>
                        <Input
                          id="studentEmail"
                          type="email"
                          value={newStudent.email}
                          onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                          placeholder="Enter student's email"
                          className="mt-1 text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="studentMobile" className="text-xs sm:text-sm">Mobile</Label>
                        <Input
                          id="studentMobile"
                          value={newStudent.mobile}
                          onChange={(e) => setNewStudent({ ...newStudent, mobile: e.target.value })}
                          placeholder="Enter student's mobile number"
                          className="mt-1 text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="studentPassword" className="text-xs sm:text-sm">Password *</Label>
                        <Input
                          id="studentPassword"
                          type="password"
                          value={newStudent.password}
                          onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                          placeholder="Enter temporary password"
                          className="mt-1 text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
                      <Button 
                        onClick={createStudent}
                        disabled={creatingStudent}
                        className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm px-3 py-2"
                      >
                        <UserCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                        {creatingStudent ? 'Creating...' : 'Create & Enroll Student'}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setShowCreateStudent(false);
                          setNewStudent({ name: '', email: '', mobile: '', password: '' });
                        }}
                        className="w-full sm:w-auto text-xs sm:text-sm px-3 py-2"
                      >
                        Cancel
                      </Button>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2">
                      <strong>Note:</strong> The student will be automatically enrolled in the course without payment.
                    </p>
                  </div>
                )}
                <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                  {students.map((student) => (
                    <div key={student._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 lg:p-4 border rounded-lg gap-2 sm:gap-3 hover:shadow-sm transition-shadow">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col gap-1 sm:gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm sm:text-base truncate">{student.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">{student.email}</p>
                            {student.mobile && (
                              <p className="text-xs sm:text-sm text-gray-500 truncate">{student.mobile}</p>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {student.enrolledCourse ? (
                              <Badge variant="default" className="text-xs">Enrolled</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Not Enrolled</Badge>
                            )}
                            {student.transactionId && student.transactionId === 'ADMIN_ENROLLED' ? (
                              <Badge variant="destructive" className="text-xs">Admin Enrolled</Badge>
                            ) : student.transactionId ? (
                              <Badge variant="outline" className="text-xs">Paid</Badge>
                            ) : null}
                            {student.bypassPayment && (
                              <Badge variant="secondary" className="text-xs">No Payment Required</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 sm:gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => viewStudent(student)}
                          className="flex-1 sm:flex-none text-xs px-2 py-1"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline ml-1">View</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => editStudent(student)}
                          className="flex-1 sm:flex-none text-xs px-2 py-1"
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline ml-1">Edit</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteStudent(student._id)}
                          className="text-red-600 hover:text-red-700 flex-1 sm:flex-none text-xs px-2 py-1"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline ml-1">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-3 sm:space-y-4 lg:space-y-6">
            <Card>
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                      <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                      <span className="truncate">Course Management</span>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm lg:text-base">
                      Create and manage course content and modules
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => setShowCreateCourse(!showCreateCourse)}
                    className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm px-3 py-2"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Create Course</span>
                    <span className="sm:hidden">Add Course</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                  {courses.map((course) => (
                    <div key={course._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 lg:p-4 border rounded-lg gap-2 sm:gap-3 hover:shadow-sm transition-shadow">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col gap-1 sm:gap-2">
                          <div>
                            <h3 className="font-medium text-sm sm:text-base truncate">{course.title}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{course.description}</p>
                            <div className="flex flex-wrap gap-1 sm:gap-2 mt-1">
                              <Badge variant="outline" className="text-xs px-2 py-1">{course.level}</Badge>
                              <Badge variant="outline" className="text-xs px-2 py-1">{course.duration}</Badge>
                              <Badge variant="outline" className="text-xs px-2 py-1">₹{course.price}</Badge>
                              {course.isActive ? (
                                <Badge variant="default" className="text-xs px-2 py-1">Active</Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs px-2 py-1">Inactive</Badge>
                              )}
                              {course.isFeatured && (
                                <Badge variant="secondary" className="text-xs px-2 py-1">Featured</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs sm:text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="truncate">{course.instructor}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 sm:gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditCourse(course)}
                          title="Edit Course"
                          className="flex-1 sm:flex-none text-xs px-2 py-1"
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline ml-1">Edit</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => editCoursePrice(course)}
                          title="Edit Price"
                          className="text-green-600 hover:text-green-700 flex-1 sm:flex-none text-xs px-2 py-1"
                        >
                          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline ml-1">Price</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs px-2 py-1">
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline ml-1">View</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs px-2 py-1">
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline ml-1">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                  {courses.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No courses found. Create your first course!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Create Course Form */}
            {showCreateCourse && (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Course</CardTitle>
                  <CardDescription>
                    Fill in the details to create a new course
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="course-title">Course Title</Label>
                      <Input
                        id="course-title"
                        value={newCourse.title}
                        onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                        placeholder="Enter course title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="course-category">Category</Label>
                      <Input
                        id="course-category"
                        value={newCourse.category}
                        onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                        placeholder="e.g., Web Development"
                      />
                    </div>
                    <div>
                      <Label htmlFor="course-instructor">Instructor</Label>
                      <Input
                        id="course-instructor"
                        value={newCourse.instructor}
                        onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})}
                        placeholder="Instructor name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="course-duration">Duration</Label>
                      <Input
                        id="course-duration"
                        value={newCourse.duration}
                        onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                        placeholder="e.g., 12 weeks"
                      />
                    </div>
                    <div>
                      <Label htmlFor="course-level">Level</Label>
                      <select
                        id="course-level"
                        value={newCourse.level}
                        onChange={(e) => setNewCourse({...newCourse, level: e.target.value})}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Beginner to Advanced">Beginner to Advanced</option>
                        <option value="Intermediate to Advanced">Intermediate to Advanced</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="course-image">Image URL</Label>
                      <Input
                        id="course-image"
                        value={newCourse.image}
                        onChange={(e) => setNewCourse({...newCourse, image: e.target.value})}
                        placeholder="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop"
                      />
                      <div className="mt-1 text-xs text-gray-500 space-y-1">
                        <div>Try these sample URLs:</div>
                        <div>• https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop</div>
                        <div>• https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop</div>
                        <div>• https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop</div>
                      </div>
                      {newCourse.image && (
                        <div className="mt-2">
                          <Label className="text-sm text-gray-600">Image Preview:</Label>
                          <div className="mt-1 border rounded-lg overflow-hidden">
                            <img
                              src={newCourse.image}
                              alt="Course preview"
                              className="w-full h-32 object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            <div className="hidden p-4 text-center text-gray-500 bg-gray-100">
                              Image failed to load
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="course-price">Price (₹)</Label>
                      <Input
                        id="course-price"
                        type="number"
                        value={newCourse.price}
                        onChange={(e) => setNewCourse({...newCourse, price: e.target.value})}
                        placeholder="299"
                      />
                    </div>
                    <div>
                      <Label htmlFor="course-original-price">Original Price (₹)</Label>
                      <Input
                        id="course-original-price"
                        type="number"
                        value={newCourse.originalPrice}
                        onChange={(e) => setNewCourse({...newCourse, originalPrice: e.target.value})}
                        placeholder="599"
                      />
                    </div>
                    <div>
                      <Label htmlFor="course-discount">Discount</Label>
                      <Input
                        id="course-discount"
                        value={newCourse.discount}
                        onChange={(e) => setNewCourse({...newCourse, discount: e.target.value})}
                        placeholder="50% OFF"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="course-short-description">Short Description</Label>
                    <Input
                      id="course-short-description"
                      value={newCourse.shortDescription}
                      onChange={(e) => setNewCourse({...newCourse, shortDescription: e.target.value})}
                      placeholder="Brief course description"
                    />
                  </div>

                  <div>
                    <Label htmlFor="course-description">Full Description</Label>
                    <Textarea
                      id="course-description"
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                      placeholder="Detailed course description"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label>Course Features</Label>
                    <div className="space-y-2">
                      {newCourse.features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={feature}
                            onChange={(e) => {
                              const newFeatures = [...newCourse.features];
                              newFeatures[index] = e.target.value;
                              setNewCourse({...newCourse, features: newFeatures});
                            }}
                            placeholder="Course feature"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newFeatures = newCourse.features.filter((_, i) => i !== index);
                              setNewCourse({...newCourse, features: newFeatures});
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setNewCourse({...newCourse, features: [...newCourse.features, '']})}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Feature
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="course-active"
                        checked={newCourse.isActive}
                        onChange={(e) => setNewCourse({...newCourse, isActive: e.target.checked})}
                      />
                      <Label htmlFor="course-active">Active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="course-featured"
                        checked={newCourse.isFeatured}
                        onChange={(e) => setNewCourse({...newCourse, isFeatured: e.target.checked})}
                      />
                      <Label htmlFor="course-featured">Featured</Label>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={createCourse}
                      disabled={creatingCourse}
                      className="flex items-center gap-2"
                    >
                      {creatingCourse ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Create Course
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateCourse(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Edit Course Modal */}
            {showEditCourse && editingCourse && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-medium mb-4">Edit Course</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="edit-course-title" className="text-xs sm:text-sm">Course Title *</Label>
                          <Input
                            id="edit-course-title"
                            value={editingCourse.title}
                            onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                            placeholder="Enter course title"
                            className="mt-1 text-xs sm:text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-course-category" className="text-xs sm:text-sm">Category *</Label>
                          <Input
                            id="edit-course-category"
                            value={editingCourse.category}
                            onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                            placeholder="e.g., Web Development"
                            className="mt-1 text-xs sm:text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-course-instructor" className="text-xs sm:text-sm">Instructor *</Label>
                          <Input
                            id="edit-course-instructor"
                            value={editingCourse.instructor}
                            onChange={(e) => setEditingCourse({ ...editingCourse, instructor: e.target.value })}
                            placeholder="Instructor name"
                            className="mt-1 text-xs sm:text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-course-duration" className="text-xs sm:text-sm">Duration *</Label>
                          <Input
                            id="edit-course-duration"
                            value={editingCourse.duration}
                            onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                            placeholder="e.g., 12 weeks"
                            className="mt-1 text-xs sm:text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-course-level" className="text-xs sm:text-sm">Level *</Label>
                          <select
                            id="edit-course-level"
                            value={editingCourse.level}
                            onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="edit-course-price" className="text-xs sm:text-sm">Price *</Label>
                          <Input
                            id="edit-course-price"
                            type="number"
                            value={editingCourse.price}
                            onChange={(e) => setEditingCourse({ ...editingCourse, price: Number(e.target.value) })}
                            placeholder="Course price"
                            className="mt-1 text-xs sm:text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-course-original-price" className="text-xs sm:text-sm">Original Price</Label>
                          <Input
                            id="edit-course-original-price"
                            type="number"
                            value={editingCourse.originalPrice}
                            onChange={(e) => setEditingCourse({ ...editingCourse, originalPrice: Number(e.target.value) })}
                            placeholder="Original price"
                            className="mt-1 text-xs sm:text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-course-discount" className="text-xs sm:text-sm">Discount</Label>
                          <Input
                            id="edit-course-discount"
                            value={editingCourse.discount}
                            onChange={(e) => setEditingCourse({ ...editingCourse, discount: e.target.value })}
                            placeholder="e.g., 50% OFF"
                            className="mt-1 text-xs sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="edit-course-short-description" className="text-xs sm:text-sm">Short Description *</Label>
                        <Input
                          id="edit-course-short-description"
                          value={editingCourse.shortDescription}
                          onChange={(e) => setEditingCourse({ ...editingCourse, shortDescription: e.target.value })}
                          placeholder="Brief course description"
                          className="mt-1 text-xs sm:text-sm"
                        />
                      </div>

                      <div>
                        <Label htmlFor="edit-course-description" className="text-xs sm:text-sm">Description *</Label>
                        <Textarea
                          id="edit-course-description"
                          value={editingCourse.description}
                          onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                          placeholder="Detailed course description"
                          className="mt-1 min-h-[100px] text-xs sm:text-sm"
                        />
                      </div>

                      <div>
                        <Label htmlFor="edit-course-image" className="text-xs sm:text-sm">Image URL</Label>
                        <Input
                          id="edit-course-image"
                          value={editingCourse.image}
                          onChange={(e) => setEditingCourse({ ...editingCourse, image: e.target.value })}
                          placeholder="Course image URL"
                          className="mt-1 text-xs sm:text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="edit-course-active"
                            checked={editingCourse.isActive}
                            onChange={(e) => setEditingCourse({ ...editingCourse, isActive: e.target.checked })}
                            className="rounded"
                          />
                          <Label htmlFor="edit-course-active" className="text-xs sm:text-sm">Active</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="edit-course-featured"
                            checked={editingCourse.isFeatured}
                            onChange={(e) => setEditingCourse({ ...editingCourse, isFeatured: e.target.checked })}
                            className="rounded"
                          />
                          <Label htmlFor="edit-course-featured" className="text-xs sm:text-sm">Featured</Label>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <Button
                          onClick={updateCourse}
                          disabled={updatingCourse || !editingCourse.title || !editingCourse.description}
                          className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm px-3 py-2"
                        >
                          {updatingCourse ? (
                            <>
                              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                              Update Course
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowEditCourse(false);
                            setEditingCourse(null);
                          }}
                          className="w-full sm:w-auto text-xs sm:text-sm px-3 py-2"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Price Editing Form */}
            {editingPrice && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Edit Course Price
                  </CardTitle>
                  <CardDescription>
                    Update pricing for "{editingPrice.title}"
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="edit-price">Current Price (₹)</Label>
                      <Input
                        id="edit-price"
                        type="number"
                        value={priceForm.price}
                        onChange={(e) => setPriceForm({...priceForm, price: e.target.value})}
                        placeholder="299"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-original-price">Original Price (₹)</Label>
                      <Input
                        id="edit-original-price"
                        type="number"
                        value={priceForm.originalPrice}
                        onChange={(e) => setPriceForm({...priceForm, originalPrice: e.target.value})}
                        placeholder="599"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-discount">Discount</Label>
                      <Input
                        id="edit-discount"
                        value={priceForm.discount}
                        onChange={(e) => setPriceForm({...priceForm, discount: e.target.value})}
                        placeholder="50% OFF"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="change-reason">Reason for Change (Optional)</Label>
                    <Input
                      id="change-reason"
                      value={priceForm.changeReason}
                      onChange={(e) => setPriceForm({...priceForm, changeReason: e.target.value})}
                      placeholder="e.g., Seasonal discount, promotional offer"
                    />
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Price Preview</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-blue-600">₹{priceForm.price || '0'}</span>
                      {priceForm.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">₹{priceForm.originalPrice}</span>
                      )}
                      {priceForm.discount && (
                        <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                          {priceForm.discount}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={updateCoursePrice}
                      disabled={updatingPrice}
                      className="flex items-center gap-2"
                    >
                      {updatingPrice ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <DollarSign className="h-4 w-4" />
                          Update Price
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={cancelPriceEdit}
                    >
                      Cancel
                    </Button>
                  </div>

                  {/* Price History Section */}
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Price Change History</h4>
                    {loadingPriceHistory ? (
                      <div className="text-center py-4">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-sm text-gray-500 mt-2">Loading price history...</p>
                      </div>
                    ) : priceHistory.length > 0 ? (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {priceHistory.map((change, index) => (
                          <div key={change.id || index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  ₹{Number(change.oldPrice) / 100} → ₹{Number(change.newPrice) / 100}
                                </span>
                                {change.oldOriginalPrice && change.newOriginalPrice && (
                                  <span className="text-xs text-gray-500">
                                    (Original: ₹{Number(change.oldOriginalPrice) / 100} → ₹{Number(change.newOriginalPrice) / 100})
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(change.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            {change.changeReason && (
                              <p className="text-xs text-gray-600 mb-1">Reason: {change.changeReason}</p>
                            )}
                            {change.changedBy && (
                              <p className="text-xs text-gray-500">Changed by: {change.changedBy.name || 'Admin'}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <p className="text-sm">No price changes recorded yet.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="announcements" className="space-y-3 sm:space-y-4 lg:space-y-6">
            <Card>
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                      <Megaphone className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                      <span className="truncate">Announcements</span>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm lg:text-base">
                      Create and manage platform announcements
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => setShowCreateAnnouncement(!showCreateAnnouncement)}
                    className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm px-3 py-2"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Send Announcement</span>
                    <span className="sm:hidden">Send</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6">
                {/* Create Announcement Form */}
                {showCreateAnnouncement && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 lg:p-6 border rounded-lg bg-gray-50">
                    <h3 className="text-sm sm:text-base lg:text-lg font-medium mb-3 sm:mb-4">Create New Announcement</h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <Label htmlFor="announcement-title" className="text-xs sm:text-sm">Title *</Label>
                          <Input
                            id="announcement-title"
                            placeholder="Enter announcement title..."
                            value={newAnnouncement.title}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                            className="mt-1 text-xs sm:text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="announcement-type" className="text-xs sm:text-sm">Type</Label>
                          <select
                            id="announcement-type"
                            value={newAnnouncement.type}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="general">General</option>
                            <option value="course">Course</option>
                            <option value="payment">Payment</option>
                            <option value="system">System</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="announcement-content" className="text-xs sm:text-sm">Content *</Label>
                        <Textarea
                          id="announcement-content"
                          placeholder="Write your announcement content here..."
                          value={newAnnouncement.content}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                          className="mt-1 min-h-[80px] sm:min-h-[100px] text-xs sm:text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="announcement-priority" className="text-sm">Priority</Label>
                          <select
                            id="announcement-priority"
                            value={newAnnouncement.priority}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="announcement-audience" className="text-sm">Target Audience</Label>
                          <select
                            id="announcement-audience"
                            value={newAnnouncement.targetAudience}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, targetAudience: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="all">All Students</option>
                            <option value="enrolled">Enrolled Students Only</option>
                            <option value="unenrolled">Unenrolled Students Only</option>
                            <option value="specific">Specific Students</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-1">
                          <Label htmlFor="announcement-expires" className="text-sm">Expires At (Optional)</Label>
                          <Input
                            id="announcement-expires"
                            type="datetime-local"
                            value={newAnnouncement.expiresAt}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, expiresAt: e.target.value })}
                            className="mt-1 text-sm"
                          />
                        </div>
                      </div>

                      {/* Specific Students Selection */}
                      {newAnnouncement.targetAudience === 'specific' && (
                        <div>
                          <Label className="text-sm">Select Specific Students</Label>
                          <div className="mt-2 max-h-40 overflow-y-auto border rounded-md p-2">
                            {students.map((student) => (
                              <label key={student._id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                                <input
                                  type="checkbox"
                                  checked={selectedStudents.includes(student._id)}
                                  onChange={() => toggleStudentSelection(student._id)}
                                  className="rounded"
                                />
                                <span className="text-xs sm:text-sm truncate">
                                  {student.name} ({student.email})
                                </span>
                              </label>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Selected {selectedStudents.length} student(s)
                          </p>
                        </div>
                      )}

                      {/* Preview */}
                      <div className="bg-white p-3 sm:p-4 border rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Preview</h4>
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-medium text-sm sm:text-base truncate">{newAnnouncement.title || 'Announcement Title'}</h3>
                            <Badge variant={newAnnouncement.priority === 'urgent' ? 'destructive' : 'outline'} className="text-xs">
                              {newAnnouncement.priority.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs">{newAnnouncement.type.toUpperCase()}</Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {newAnnouncement.content || 'Announcement content will appear here...'}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
                            <span>Target: {newAnnouncement.targetAudience}</span>
                            {newAnnouncement.expiresAt && (
                              <span>Expires: {new Date(newAnnouncement.expiresAt).toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <Button
                          onClick={createAnnouncement}
                          disabled={creatingAnnouncement || !newAnnouncement.title || !newAnnouncement.content}
                          className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm px-3 py-2"
                        >
                          {creatingAnnouncement ? (
                            <>
                              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Megaphone className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="hidden sm:inline">Send Announcement</span>
                              <span className="sm:hidden">Send</span>
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowCreateAnnouncement(false);
                            setNewAnnouncement({
                              title: '',
                              content: '',
                              type: 'general',
                              priority: 'medium',
                              targetAudience: 'all',
                              expiresAt: '',
                              specificStudents: []
                            });
                            setSelectedStudents([]);
                          }}
                          className="w-full sm:w-auto text-xs sm:text-sm px-3 py-2"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Edit Announcement Modal */}
                {showEditAnnouncement && editingAnnouncement && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                      <div className="p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-medium mb-4">Edit Announcement</h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit-announcement-title">Title *</Label>
                              <Input
                                id="edit-announcement-title"
                                placeholder="Enter announcement title..."
                                value={editingAnnouncement.title}
                                onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-announcement-type">Type</Label>
                              <select
                                id="edit-announcement-type"
                                value={editingAnnouncement.type}
                                onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, type: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="general">General</option>
                                <option value="course">Course</option>
                                <option value="payment">Payment</option>
                                <option value="system">System</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="edit-announcement-content">Content *</Label>
                            <Textarea
                              id="edit-announcement-content"
                              placeholder="Write your announcement content here..."
                              value={editingAnnouncement.content}
                              onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value })}
                              className="mt-1 min-h-[100px]"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="edit-announcement-priority" className="text-sm">Priority</Label>
                              <select
                                id="edit-announcement-priority"
                                value={editingAnnouncement.priority}
                                onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, priority: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                              </select>
                            </div>
                            <div>
                              <Label htmlFor="edit-announcement-audience" className="text-sm">Target Audience</Label>
                              <select
                                id="edit-announcement-audience"
                                value={editingAnnouncement.targetAudience}
                                onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, targetAudience: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="all">All Students</option>
                                <option value="enrolled">Enrolled Students Only</option>
                                <option value="unenrolled">Unenrolled Students Only</option>
                                <option value="specific">Specific Students</option>
                              </select>
                            </div>
                            <div>
                              <Label className="text-sm">Status</Label>
                              <select
                                value={editingAnnouncement.isActive ? 'active' : 'inactive'}
                                onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, isActive: e.target.value === 'active' })}
                                className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            </div>
                          </div>

                          {/* Preview */}
                          <div className="bg-gray-50 p-3 sm:p-4 border rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Preview</h4>
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-medium text-sm sm:text-base truncate">{editingAnnouncement.title || 'Announcement Title'}</h3>
                                <Badge variant={editingAnnouncement.priority === 'urgent' ? 'destructive' : 'outline'} className="text-xs">
                                  {editingAnnouncement.priority.toUpperCase()}
                                </Badge>
                                <Badge variant="outline" className="text-xs">{editingAnnouncement.type.toUpperCase()}</Badge>
                                <Badge variant={editingAnnouncement.isActive ? 'default' : 'secondary'} className="text-xs">
                                  {editingAnnouncement.isActive ? 'ACTIVE' : 'INACTIVE'}
                                </Badge>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-600">
                                {editingAnnouncement.content || 'Announcement content will appear here...'}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
                                <span>Target: {editingAnnouncement.targetAudience}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              onClick={handleUpdateAnnouncement}
                              disabled={creatingAnnouncement || !editingAnnouncement.title || !editingAnnouncement.content}
                              className="flex items-center gap-2 w-full sm:w-auto"
                            >
                              {creatingAnnouncement ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Updating...
                                </>
                              ) : (
                                <>
                                  <Edit className="h-4 w-4" />
                                  Update Announcement
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowEditAnnouncement(false);
                                setEditingAnnouncement(null);
                              }}
                              className="w-full sm:w-auto"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Existing Announcements */}
                <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement._id} className="p-2 sm:p-3 lg:p-4 border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                            <h3 className="font-medium text-sm sm:text-base truncate">{announcement.title}</h3>
                            <Badge variant={announcement.priority === 'urgent' ? 'destructive' : 'outline'} className="text-xs px-2 py-1">
                              {announcement.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs px-2 py-1">{announcement.type}</Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 line-clamp-2">{announcement.content}</p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                              {new Date(announcement.createdAt).toLocaleDateString()}
                            </span>
                            <span>Target: {announcement.targetAudience}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 sm:gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 sm:flex-none text-xs px-2 py-1"
                            onClick={() => handleEditAnnouncement(announcement)}
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline ml-1">Edit</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 sm:flex-none text-xs px-2 py-1"
                            onClick={() => handleDeleteAnnouncement(announcement._id)}
                            disabled={deletingAnnouncement === announcement._id}
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline ml-1">
                              {deletingAnnouncement === announcement._id ? 'Deleting...' : 'Delete'}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {announcements.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No announcements found. Create your first announcement!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blogs" className="space-y-3 sm:space-y-4 lg:space-y-6">
            <Card>
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                      <FileEdit className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                      <span className="truncate">Blog Management</span>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm lg:text-base">
                      Create and manage blog posts
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => setShowCreateBlog(!showCreateBlog)}
                    className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm px-3 py-2"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Create Blog</span>
                    <span className="sm:hidden">Add Blog</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Create Blog Form */}
                {showCreateBlog && (
                  <div className="mb-4 sm:mb-6 p-4 sm:p-6 border rounded-lg bg-gray-50">
                    <h3 className="text-base sm:text-lg font-medium mb-4">Create New Blog Post</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          placeholder="Enter blog title..."
                          value={newBlog.title}
                          onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="content">Content *</Label>
                        <Textarea
                          id="content"
                          placeholder="Write your blog content here..."
                          value={newBlog.content}
                          onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                          className="mt-1"
                          rows={8}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Minimum 50 characters. Current: {newBlog.content.length}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Input
                            id="category"
                            placeholder="e.g., Technology, Education"
                            value={newBlog.category}
                            onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="tags">Tags</Label>
                          <Input
                            id="tags"
                            placeholder="tag1, tag2, tag3"
                            value={newBlog.tags}
                            onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })}
                            className="mt-1"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Separate tags with commas
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="coverImage">Cover Image URL</Label>
                          <Input
                            id="coverImage"
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={newBlog.coverImage}
                            onChange={(e) => setNewBlog({ ...newBlog, coverImage: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="author">Author</Label>
                          <Input
                            id="author"
                            placeholder="Author name"
                            value={newBlog.author}
                            onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={createBlog}
                          disabled={creatingBlog}
                          className="flex items-center gap-2"
                        >
                          {creatingBlog ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Creating...
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4" />
                              Create Blog Post
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setShowCreateBlog(false);
                            setNewBlog({
                              title: '',
                              content: '',
                              category: '',
                              tags: '',
                              coverImage: '',
                              author: 'Admin'
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Edit Blog Form */}
                {editingBlog && (
                  <div className="mb-6 p-6 border rounded-lg bg-blue-50">
                    <h3 className="text-lg font-medium mb-4">Edit Blog Post</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="edit-title">Title *</Label>
                        <Input
                          id="edit-title"
                          placeholder="Enter blog title..."
                          value={editBlog.title}
                          onChange={(e) => setEditBlog({ ...editBlog, title: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-content">Content *</Label>
                        <Textarea
                          id="edit-content"
                          placeholder="Write your blog content here..."
                          value={editBlog.content}
                          onChange={(e) => setEditBlog({ ...editBlog, content: e.target.value })}
                          className="mt-1"
                          rows={8}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Minimum 50 characters. Current: {editBlog.content.length}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="edit-category">Category</Label>
                          <Input
                            id="edit-category"
                            placeholder="e.g., Technology, Education"
                            value={editBlog.category}
                            onChange={(e) => setEditBlog({ ...editBlog, category: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-tags">Tags</Label>
                          <Input
                            id="edit-tags"
                            placeholder="tag1, tag2, tag3"
                            value={editBlog.tags}
                            onChange={(e) => setEditBlog({ ...editBlog, tags: e.target.value })}
                            className="mt-1"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Separate tags with commas
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="edit-coverImage">Cover Image URL</Label>
                          <Input
                            id="edit-coverImage"
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={editBlog.coverImage}
                            onChange={(e) => setEditBlog({ ...editBlog, coverImage: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-author">Author</Label>
                          <Input
                            id="edit-author"
                            placeholder="Author name"
                            value={editBlog.author}
                            onChange={(e) => setEditBlog({ ...editBlog, author: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="edit-visible"
                            checked={editBlog.isVisible}
                            onChange={(e) => setEditBlog({ ...editBlog, isVisible: e.target.checked })}
                            className="rounded"
                          />
                          <Label htmlFor="edit-visible">Visible to public</Label>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={updateBlog}
                          disabled={updatingBlog}
                          className="flex items-center gap-2"
                        >
                          {updatingBlog ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Updating...
                            </>
                          ) : (
                            <>
                              <Edit className="h-4 w-4" />
                              Update Blog Post
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setEditingBlog(null);
                            setEditBlog({
                              title: '',
                              content: '',
                              category: '',
                              tags: '',
                              coverImage: '',
                              author: 'Admin',
                              isVisible: true
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3 sm:space-y-4">
                  {blogs.map((blog) => (
                    <div key={blog._id} className="flex flex-col sm:flex-row sm:items-start justify-between p-3 sm:p-4 border rounded-lg gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                          {blog.coverImage && (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <img 
                                src={blog.coverImage} 
                                alt={blog.title || blog.caption}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm sm:text-lg truncate">
                              {blog.title || blog.caption}
                            </h3>
                            {blog.content && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {blog.content.substring(0, 150)}...
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500 mt-2">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {blog.author || 'Admin'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(blog.createdAt).toLocaleDateString()}
                              </span>
                              {blog.category && (
                                <span className="flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  {blog.category}
                                </span>
                              )}
                              {blog.tags && blog.tags.length > 0 && (
                                <span className="flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  {blog.tags.slice(0, 2).join(', ')}
                                  {blog.tags.length > 2 && ` +${blog.tags.length - 2} more`}
                                </span>
                              )}
                              {blog.isVisible !== undefined && (
                                <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                                  blog.isVisible 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {blog.isVisible ? 'Visible' : 'Hidden'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => editBlogPost(blog._id)}
                          title="Edit Blog"
                          className="flex-1 sm:flex-none"
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline ml-1">Edit</span>
                        </Button>
                        {blog.isVisible !== undefined && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleBlogVisibility(blog._id, blog.isVisible ?? true)}
                            title={blog.isVisible ? 'Hide Blog' : 'Show Blog'}
                            className={`flex-1 sm:flex-none ${blog.isVisible ? 'text-yellow-600 hover:text-yellow-700' : 'text-green-600 hover:text-green-700'}`}
                          >
                            <span className="text-xs sm:text-sm">{blog.isVisible ? '👁️' : '👁️‍🗨️'}</span>
                            <span className="hidden sm:inline ml-1">{blog.isVisible ? 'Hide' : 'Show'}</span>
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => deleteBlog(blog._id)}
                          className="text-red-600 hover:text-red-700 flex-1 sm:flex-none"
                          title="Delete Blog"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline ml-1">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                  {blogs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No blog posts found. Create your first blog post!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos" className="space-y-3 sm:space-y-4 lg:space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <PlayCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      Video Management
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Create and manage video content for the homepage. The featured video will be displayed on the homepage.
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => setShowCreateVideo(!showCreateVideo)}
                    className="flex items-center gap-2 w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Video</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Create/Edit Video Form */}
                {showCreateVideo && (
                  <div className="mb-4 sm:mb-6 p-4 sm:p-6 border rounded-lg bg-gray-50">
                    <h3 className="text-base sm:text-lg font-medium mb-4">
                      {editingVideo ? 'Edit Video' : 'Add New Video'}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="videoTitle">Title *</Label>
                        <Input
                          id="videoTitle"
                          placeholder="Enter video title..."
                          value={newVideo.title}
                          onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="videoDescription">Description</Label>
                        <Textarea
                          id="videoDescription"
                          placeholder="Enter video description..."
                          value={newVideo.description}
                          onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="videoUrl">Video URL *</Label>
                        <Input
                          id="videoUrl"
                          placeholder="https://example.com/video.mp4 or https://youtube.com/watch?v=..."
                          value={newVideo.videoUrl}
                          onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Supports direct video files (.mp4, .webm, etc.) and YouTube URLs
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                        <Input
                          id="thumbnailUrl"
                          placeholder="https://example.com/thumbnail.jpg"
                          value={newVideo.thumbnailUrl}
                          onChange={(e) => setNewVideo({ ...newVideo, thumbnailUrl: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          For YouTube videos, you can use: https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="duration">Duration</Label>
                          <Input
                            id="duration"
                            placeholder="5:30"
                            value={newVideo.duration}
                            onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Input
                            id="category"
                            placeholder="preview"
                            value={newVideo.category}
                            onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={newVideo.isActive}
                            onChange={(e) => setNewVideo({ ...newVideo, isActive: e.target.checked })}
                          />
                          <span className="text-sm">Active</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={newVideo.isFeatured}
                            onChange={(e) => setNewVideo({ ...newVideo, isFeatured: e.target.checked })}
                          />
                          <span className="text-sm">Featured (shows on homepage)</span>
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={editingVideo ? updateVideo : createVideo} 
                          disabled={creatingBlog}
                        >
                          {creatingBlog 
                            ? (editingVideo ? 'Updating...' : 'Creating...') 
                            : (editingVideo ? 'Update Video' : 'Create Video')
                          }
                        </Button>
                        <Button variant="outline" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Current Homepage Video */}
                {videos.find(v => v.isFeatured) && (
                  <div className="mb-6 p-4 border rounded-lg bg-green-50 border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">Current Homepage Video</h4>
                    <div className="flex items-center gap-2">
                      <PlayCircle className="h-4 w-4 text-green-600" />
                      <span className="text-green-700">
                        {videos.find(v => v.isFeatured)?.title}
                      </span>
                    </div>
                  </div>
                )}

                {/* Videos List */}
                <div className="space-y-3 sm:space-y-4">
                  {videos.map((video) => (
                    <div key={video._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm sm:text-base truncate">{video.title}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{video.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {video.category} • {video.duration} • {video.views} views
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={video.isActive ? "default" : "secondary"} className="text-xs">
                          {video.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {video.isFeatured && (
                          <Badge variant="outline" className="text-xs">Featured</Badge>
                        )}
                        <Button 
                          size="sm" 
                          variant={video.isFeatured ? "default" : "outline"}
                          onClick={() => setAsHomepageVideo(video.videoId)}
                          className="text-xs"
                        >
                          <span className="hidden sm:inline">{video.isFeatured ? "Homepage Video" : "Set as Homepage"}</span>
                          <span className="sm:hidden">{video.isFeatured ? "Homepage" : "Set"}</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => editVideo(video)}
                          className="flex-1 sm:flex-none"
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline ml-1">Edit</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteVideo(video.videoId)}
                          className="flex-1 sm:flex-none"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline ml-1">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-3 sm:space-y-4 lg:space-y-6">
            <Card>
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                      <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                      <span className="truncate">Contact Messages</span>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm lg:text-base">
                      Manage contact form submissions and customer inquiries
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <select
                      value={messageFilter}
                      onChange={(e) => {
                        setMessageFilter(e.target.value as any);
                        fetchMessages();
                      }}
                      className="text-xs sm:text-sm px-2 py-1 border rounded"
                    >
                      <option value="all">All Messages</option>
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="closed">Closed</option>
                    </select>
                    <select
                      value={messagePriority}
                      onChange={(e) => {
                        setMessagePriority(e.target.value as any);
                        fetchMessages();
                      }}
                      className="text-xs sm:text-sm px-2 py-1 border rounded"
                    >
                      <option value="all">All Priorities</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No messages found</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 lg:p-4 border rounded-lg gap-2 sm:gap-3 hover:shadow-sm transition-shadow">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col gap-1 sm:gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm sm:text-base truncate">{message.name}</h3>
                              <p className="text-xs sm:text-sm text-gray-600 truncate">{message.email}</p>
                              {message.company && (
                                <p className="text-xs sm:text-sm text-gray-500 truncate">{message.company}</p>
                              )}
                              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1">{message.message}</p>
                            </div>
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              <Badge 
                                variant={
                                  message.status === 'new' ? 'default' : 
                                  message.status === 'read' ? 'secondary' :
                                  message.status === 'replied' ? 'outline' : 'destructive'
                                } 
                                className="text-xs"
                              >
                                {message.status}
                              </Badge>
                              <Badge 
                                variant={
                                  message.priority === 'urgent' ? 'destructive' :
                                  message.priority === 'high' ? 'default' :
                                  message.priority === 'medium' ? 'secondary' : 'outline'
                                } 
                                className="text-xs"
                              >
                                {message.priority}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(message.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 sm:gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => viewMessage(message)}
                            className="flex-1 sm:flex-none text-xs px-2 py-1"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline ml-1">View</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteMessage(message._id)}
                            className="text-red-600 hover:text-red-700 flex-1 sm:flex-none text-xs px-2 py-1"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline ml-1">Delete</span>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-3 sm:space-y-4 lg:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                  Analytics
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Platform performance and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm sm:text-base">Student Engagement</h3>
                    <div className="space-y-3">
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm sm:text-base">Course Performance</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-600">Total Courses</span>
                        <span className="font-medium text-sm sm:text-base">{courses.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-600">Active Courses</span>
                        <span className="font-medium text-sm sm:text-base">{courses.filter(c => c.isActive).length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-600">Featured Courses</span>
                        <span className="font-medium text-sm sm:text-base">{courses.filter(c => c.isFeatured).length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-3 sm:space-y-4 lg:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Site Settings
                </CardTitle>
                <CardDescription>
                  Manage site appearance and configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Hero Section Settings */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">Hero Section</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="hero-image-url">Hero Image URL</Label>
                      <Input
                        id="hero-image-url"
                        type="url"
                        placeholder="https://example.com/hero-image.jpg"
                        value={heroImageUrl}
                        onChange={(e) => setHeroImageUrl(e.target.value)}
                        className="mt-1"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Enter the URL of the image you want to display in the hero section
                      </p>
                    </div>
                    
                    {heroImageUrl && (
                      <div className="space-y-2">
                        <Label>Preview</Label>
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <img 
                            src={heroImageUrl} 
                            alt="Hero image preview" 
                            className="max-w-full h-48 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <div className="hidden text-center text-gray-500 py-8">
                            <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>Image failed to load. Please check the URL.</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      onClick={updateSettings}
                      disabled={updatingSettings}
                      className="w-full sm:w-auto"
                    >
                      {updatingSettings ? 'Updating...' : 'Update Hero Image'}
                    </Button>
                  </div>
                </div>
                
                {/* Logo Settings */}
                <div className="border-t pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Image className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">Logo Settings</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {/* File Upload */}
                    <div>
                      <Label htmlFor="logo-upload">Upload Logo File</Label>
                      <div className="mt-1 flex items-center gap-4">
                        <Input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={uploadingFile}
                          className="flex-1"
                        />
                        {uploadingFile && (
                          <div className="text-sm text-blue-600">Uploading...</div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Upload a logo image file (PNG, JPG, GIF, WebP, SVG) - Max 5MB
                      </p>
                    </div>

                    {/* URL Input */}
                    <div>
                      <Label htmlFor="logo-url">Or Enter Logo URL</Label>
                      <Input
                        id="logo-url"
                        type="url"
                        placeholder="https://example.com/logo.png"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        className="mt-1"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Enter the URL of the logo image you want to display in the navigation
                      </p>
                    </div>
                    
                    {logoUrl && (
                      <div className="space-y-2">
                        <Label>Preview</Label>
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <img 
                            src={logoUrl} 
                            alt="Logo preview" 
                            className="max-w-xs h-16 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <div className="hidden text-center text-gray-500 py-4">
                            <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>Logo failed to load. Please check the URL.</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      onClick={updateLogo}
                      disabled={updatingLogo}
                      className="w-full sm:w-auto"
                    >
                      {updatingLogo ? 'Updating...' : 'Update Logo'}
                    </Button>
                  </div>
                </div>
                
                {/* Account Settings */}
                <div className="border-t pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Key className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">Account Settings</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Change Password</h4>
                        <p className="text-sm text-gray-500">Update your admin account password</p>
                      </div>
                      <Button 
                        onClick={() => setShowChangePassword(true)}
                        variant="outline"
                        size="sm"
                      >
                        Change Password
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <ChangePasswordForm 
              onSuccess={() => setShowChangePassword(false)}
              onCancel={() => setShowChangePassword(false)}
            />
          </div>
        </div>
      )}

      {/* Student View Modal */}
      {showStudentView && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Student Details</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowStudentView(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {loadingStudentDetails ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : studentDetails ? (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Full Name</Label>
                        <p className="text-lg">{studentDetails.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Email</Label>
                        <p className="text-lg">{studentDetails.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Mobile</Label>
                        <p className="text-lg">{studentDetails.mobile || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Registration Date</Label>
                        <p className="text-lg">{new Date(studentDetails.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Course Status</h3>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium text-gray-600">Enrollment Status:</Label>
                        <Badge variant={studentDetails.enrolledCourse ? "default" : "secondary"}>
                          {studentDetails.enrolledCourse ? "Enrolled" : "Not Enrolled"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium text-gray-600">Payment Status:</Label>
                        {studentDetails.transactionId === 'ADMIN_ENROLLED' ? (
                          <Badge variant="destructive">Admin Enrolled</Badge>
                        ) : studentDetails.transactionId ? (
                          <Badge variant="outline">Paid</Badge>
                        ) : (
                          <Badge variant="secondary">No Payment</Badge>
                        )}
                      </div>
                      {studentDetails.bypassPayment && (
                        <Badge variant="secondary">No Payment Required</Badge>
                      )}
                    </div>
                  </div>

                  {/* Transaction Details */}
                  {studentDetails.paymentDetails && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Transaction Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Payment ID</Label>
                          <p className="text-sm font-mono">{studentDetails.paymentDetails.paymentId}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Order ID</Label>
                          <p className="text-sm font-mono">{studentDetails.paymentDetails.orderId}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Amount</Label>
                          <p className="text-sm">₹{(studentDetails.paymentDetails.amount / 100).toFixed(2)}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Currency</Label>
                          <p className="text-sm">{studentDetails.paymentDetails.currency}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Status</Label>
                          <Badge variant={studentDetails.paymentDetails.status === 'captured' ? 'default' : 'secondary'}>
                            {studentDetails.paymentDetails.status}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Payment Method</Label>
                          <p className="text-sm">{studentDetails.paymentDetails.method || 'N/A'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Transaction Date</Label>
                          <p className="text-sm">{new Date(studentDetails.paymentDetails.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={() => {
                        setShowStudentView(false);
                        editStudent(selectedStudent);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Student
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowStudentView(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Failed to load student details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Student Edit Modal */}
      {showStudentEdit && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Edit Student</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowStudentEdit(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Full Name *</Label>
                  <Input
                    id="edit-name"
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingStudent.email}
                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-mobile">Mobile</Label>
                  <Input
                    id="edit-mobile"
                    value={editingStudent.mobile}
                    onChange={(e) => setEditingStudent({ ...editingStudent, mobile: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-enrolled"
                    checked={editingStudent.enrolledCourse}
                    onChange={(e) => setEditingStudent({ ...editingStudent, enrolledCourse: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="edit-enrolled">Enrolled in Course</Label>
                </div>


                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-bypass"
                    checked={editingStudent.bypassPayment}
                    onChange={(e) => setEditingStudent({ ...editingStudent, bypassPayment: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="edit-bypass">Bypass Payment Requirement</Label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={updateStudent}
                    disabled={updatingStudent}
                    className="flex items-center gap-2"
                  >
                    {updatingStudent ? 'Updating...' : 'Update Student'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowStudentEdit(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message View Modal */}
      {showMessageView && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Message Details</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowMessageView(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Message Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Name</Label>
                      <p className="text-lg">{selectedMessage.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Email</Label>
                      <p className="text-lg">{selectedMessage.email}</p>
                    </div>
                    {selectedMessage.company && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Company</Label>
                        <p className="text-lg">{selectedMessage.company}</p>
                      </div>
                    )}
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Date</Label>
                      <p className="text-lg">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Status & Priority</h3>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium text-gray-600">Status:</Label>
                      <Badge 
                        variant={
                          selectedMessage.status === 'new' ? 'default' : 
                          selectedMessage.status === 'read' ? 'secondary' :
                          selectedMessage.status === 'replied' ? 'outline' : 'destructive'
                        }
                      >
                        {selectedMessage.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium text-gray-600">Priority:</Label>
                      <Badge 
                        variant={
                          selectedMessage.priority === 'urgent' ? 'destructive' :
                          selectedMessage.priority === 'high' ? 'default' :
                          selectedMessage.priority === 'medium' ? 'secondary' : 'outline'
                        }
                      >
                        {selectedMessage.priority}
                      </Badge>
                    </div>
                    {selectedMessage.repliedAt && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Replied At</Label>
                        <p className="text-sm">{new Date(selectedMessage.repliedAt).toLocaleString()}</p>
                      </div>
                    )}
                    {selectedMessage.closedAt && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Closed At</Label>
                        <p className="text-sm">{new Date(selectedMessage.closedAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Content */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Message</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                {/* Admin Notes */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Admin Notes</h3>
                  <Textarea
                    value={messageNotes}
                    onChange={(e) => setMessageNotes(e.target.value)}
                    placeholder="Add notes about this message..."
                    rows={4}
                    className="w-full"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <Button
                    onClick={() => updateMessageStatus(selectedMessage._id, 'replied', selectedMessage.priority, messageNotes)}
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Mark as Replied
                  </Button>
                  <Button
                    onClick={() => updateMessageStatus(selectedMessage._id, 'closed', selectedMessage.priority, messageNotes)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Close Message
                  </Button>
                  <Button
                    onClick={saveMessageNotes}
                    disabled={updatingMessage}
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    {updatingMessage ? 'Saving...' : 'Save Notes'}
                  </Button>
                  <Button
                    onClick={() => setShowMessageView(false)}
                    variant="outline"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Reset Total Revenue</h3>
            <p className="text-gray-600 mb-4">
              This action will permanently delete all payment records and reset the total revenue to ₹0. 
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowResetConfirm(false)}
                disabled={resettingRevenue}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={resetRevenue}
                disabled={resettingRevenue}
              >
                {resettingRevenue ? 'Resetting...' : 'Reset Revenue'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}