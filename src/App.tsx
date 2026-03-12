import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  LogOut, 
  Stethoscope, 
  Building2, 
  Calendar,
  Edit2,
  Trash2,
  X,
  ChevronDown,
  LayoutDashboard,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from './api';
import { Staff, User, DEPARTMENTS, ROLES } from './types';

//Components
const Login = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/login', { 
        username: username.trim(), 
        password: password.trim() 
      });
      if (res.data.token) {
        localStorage.setItem('medistaff_token', res.data.token);
      }
      onLogin(res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-black/5"
      >
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Stethoscope className="text-white w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">MediStaff Pro</h2>
          <p className="text-center text-gray-500 mb-8">Hospital Management System</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="admin"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
         
        </div>
      </motion.div>
    </div>
  );
};

const StaffForm = ({ 
  staff, 
  onClose, 
  onSave 
}: { 
  staff?: Staff | null, 
  onClose: () => void, 
  onSave: () => void 
}) => {
  const [formData, setFormData] = useState({
    name: staff?.name || '',
    email: staff?.email || '',
    role: staff?.role || ROLES[0],
    department: staff?.department || DEPARTMENTS[0],
    hire_date: staff?.hire_date || new Date().toISOString().split('T')[0],
    phone: staff?.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (staff) {
        await api.put(`/staff/${staff.id}`, formData);
      } else {
        await api.post('/staff', formData);
      }
      onSave();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save staff');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="px-6 py-4 border-bottom border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">
            {staff ? 'Edit Staff Member' : 'Register New Staff'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Hire Date</label>
              <input
                type="date"
                value={formData.hire_date}
                onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Member'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    console.log('[App] Initializing Auth Check');
    checkAuth();

    // Add interceptor for 401 errors
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.warn('[App] 401 Unauthorized detected at:', error.config.url);
          // Only clear user if it's not a login attempt
          if (!error.config.url.includes('/login')) {
            localStorage.removeItem('medistaff_token');
            setUser(null);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, []);

  useEffect(() => {
    console.log('[App] User State Changed:', user);
    if (user) {
      fetchStaff();
    }
  }, [user]);

  const checkAuth = async () => {
    try {
      const res = await api.get('/me');
      console.log('[App] Auth Check Success:', res.data.user);
      setUser(res.data.user);
    } catch (err) {
      console.log('[App] Auth Check Failed (Normal if not logged in)');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    setFetchError(null);
    try {
      const res = await api.get('/staff');
      setStaff(res.data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.details || err.response?.data?.error || 'Failed to fetch staff';
      setFetchError(errorMsg);
      console.error('Fetch staff error:', errorMsg);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error('Logout failed');
    } finally {
      localStorage.removeItem('medistaff_token');
      setUser(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await api.delete(`/staff/${id}`);
        fetchStaff();
      } catch (err) {
        console.error('Delete failed');
      }
    }
  };

  const filteredStaff = staff.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' || s.department === deptFilter;
    const matchesRole = roleFilter === 'All' || s.role === roleFilter;
    
    let matchesDate = true;
    if (startDate && endDate) {
      matchesDate = s.hire_date >= startDate && s.hire_date <= endDate;
    } else if (startDate) {
      matchesDate = s.hire_date >= startDate;
    } else if (endDate) {
      matchesDate = s.hire_date <= endDate;
    }

    return matchesSearch && matchesDept && matchesRole && matchesDate;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden lg:flex">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Stethoscope className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-xl text-gray-900">MediStaff</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <Users className="w-5 h-5" />
            Staff Directory
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <Building2 className="w-5 h-5" />
            Departments
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Logged in as</p>
            <p className="font-bold text-gray-900">{user.username}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500 rounded-xl outline-none transition-all w-64"
              />
            </div>
            <button 
              onClick={() => {
                setEditingStaff(null);
                setIsFormOpen(true);
              }}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors shadow-lg shadow-emerald-600/20"
            >
              <UserPlus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Staff</span>
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all lg:hidden"
              title="Sign Out"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {fetchError && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <X className="w-5 h-5" />
                <p className="font-medium">Error: {fetchError}</p>
              </div>
              <button 
                onClick={fetchStaff}
                className="bg-red-100 hover:bg-red-200 px-4 py-1.5 rounded-xl text-sm font-bold transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-1">Total Staff</p>
              <h3 className="text-3xl font-bold text-gray-900">{staff.length}</h3>
              <div className="mt-2 text-emerald-600 text-xs font-bold flex items-center gap-1">
                Active Members
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-1">Departments</p>
              <h3 className="text-3xl font-bold text-gray-900">{DEPARTMENTS.length}</h3>
              <div className="mt-2 text-blue-600 text-xs font-bold">Specialized Units</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-1">Roles</p>
              <h3 className="text-3xl font-bold text-gray-900">{ROLES.length}</h3>
              <div className="mt-2 text-purple-600 text-xs font-bold">Professional Staff</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-1">Recent Hires</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {staff.filter(s => new Date(s.hire_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
              </h3>
              <div className="mt-2 text-orange-600 text-xs font-bold">Last 30 Days</div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-gray-500 font-medium mr-2">
              <Filter className="w-4 h-4" />
              Filters:
            </div>
            
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">Department</span>
              <select 
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="bg-gray-50 border-none rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Departments</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">Role</span>
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-gray-50 border-none rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Roles</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">Hired From</span>
              <input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-gray-50 border-none rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">Hired To</span>
              <input 
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-gray-50 border-none rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button 
              onClick={() => {
                setDeptFilter('All');
                setRoleFilter('All');
                setStartDate('');
                setEndDate('');
                setSearchTerm('');
              }}
              className="mt-auto px-4 py-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Staff Member</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Role & Dept</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Hire Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence mode="popLayout">
                  {filteredStaff.map((s) => (
                    <motion.tr 
                      key={s.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{s.name}</p>
                            <p className="text-xs text-gray-500">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-700">{s.role}</span>
                          <span className="text-xs text-gray-400">{s.department}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(s.hire_date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{s.phone || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setEditingStaff(s);
                              setIsFormOpen(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(s.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredStaff.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="w-12 h-12 text-gray-200" />
                        <p className="font-medium">No staff members found matching your filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {isFormOpen && (
          <StaffForm 
            staff={editingStaff}
            onClose={() => {
              setIsFormOpen(false);
              setEditingStaff(null);
            }}
            onSave={fetchStaff}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
