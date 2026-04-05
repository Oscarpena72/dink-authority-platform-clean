"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Plus, Pencil, Trash2, Save, X, Shield, ShieldCheck, ShieldAlert, Eye, EyeOff, Key, UserCheck, UserX } from 'lucide-react';
import { ROLES, ROLE_LABELS, ROLE_LEVEL, type Role } from '@/lib/roles';

interface UserRecord {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-red-100 text-red-700',
  admin: 'bg-purple-100 text-purple-700',
  editor: 'bg-blue-100 text-blue-700',
  contributor: 'bg-amber-100 text-amber-700',
  viewer: 'bg-gray-100 text-gray-600',
};

const ROLE_ICONS: Record<string, React.ReactNode> = {
  super_admin: <ShieldAlert size={14} />,
  admin: <ShieldCheck size={14} />,
  editor: <Shield size={14} />,
  contributor: <Pencil size={14} />,
  viewer: <Eye size={14} />,
};

export default function AdminUsersClient({ serverRole, serverUserId }: { serverRole: string; serverUserId: string }) {
  const myRole = serverRole as Role;
  const myId = serverUserId;
  const isSuperAdmin = myRole === 'super_admin';
  const formRef = useRef<HTMLDivElement>(null);

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /* Form */
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'editor' as string, isActive: true });

  /* Password reset modal */
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetSaving, setResetSaving] = useState(false);

  /* Change own password modal */
  const [showOwnPw, setShowOwnPw] = useState(false);
  const [ownPwForm, setOwnPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [ownPwSaving, setOwnPwSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) setUsers(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const clearForm = () => {
    setForm({ name: '', email: '', password: '', role: 'editor', isActive: true });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const openEdit = (u: UserRecord) => {
    setForm({ name: u.name || '', email: u.email, password: '', role: u.role, isActive: u.isActive });
    setEditingId(u.id);
    setShowForm(true);
    setError('');
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const handleSave = async () => {
    setError(''); setSaving(true); setSuccess('');
    try {
      const url = editingId ? `/api/users/${editingId}` : '/api/users';
      const method = editingId ? 'PUT' : 'POST';
      const payload: any = { name: form.name, email: form.email, role: form.role, isActive: form.isActive };
      if (form.password) payload.password = form.password;
      else if (!editingId) { setError('Password is required for new users'); setSaving(false); return; }
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed'); setSaving(false); return; }
      setSuccess(editingId ? 'User updated successfully' : 'User created successfully');
      clearForm();
      fetchUsers();
    } catch { setError('Failed'); }
    setSaving(false);
  };

  const toggleActive = async (u: UserRecord) => {
    setError(''); setSuccess('');
    const res = await fetch(`/api/users/${u.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !u.isActive }),
    });
    if (res.ok) { setSuccess(`User ${!u.isActive ? 'activated' : 'deactivated'}`); fetchUsers(); }
    else { const d = await res.json(); setError(d.error || 'Failed'); }
  };

  const deleteUser = async (u: UserRecord) => {
    if (!confirm(`Delete user "${u.email}"? This cannot be undone.`)) return;
    setError(''); setSuccess('');
    const res = await fetch(`/api/users/${u.id}`, { method: 'DELETE' });
    if (res.ok) { setSuccess('User deleted'); fetchUsers(); }
    else { const d = await res.json(); setError(d.error || 'Failed'); }
  };

  const handleResetPassword = async () => {
    if (!resetUserId || !newPassword) return;
    if (newPassword.length < 8) { setError('Password must be at least 8 characters'); return; }
    setResetSaving(true); setError(''); setSuccess('');
    const res = await fetch(`/api/users/${resetUserId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPassword }),
    });
    if (res.ok) { setSuccess('Password reset successfully'); setResetUserId(null); setNewPassword(''); }
    else { const d = await res.json(); setError(d.error || 'Failed'); }
    setResetSaving(false);
  };

  const handleOwnPw = async () => {
    setOwnPwSaving(true); setError(''); setSuccess('');
    const res = await fetch('/api/users/me/password', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ownPwForm),
    });
    const data = await res.json();
    if (res.ok) { setSuccess('Your password has been changed'); setShowOwnPw(false); setOwnPwForm({ currentPassword: '', newPassword: '' }); }
    else setError(data.error || 'Failed');
    setOwnPwSaving(false);
  };

  /* Which roles can the current user assign? */
  const assignableRoles = ROLES.filter(r => {
    if (isSuperAdmin) return true;
    return (ROLE_LEVEL[r] ?? 0) < (ROLE_LEVEL[myRole] ?? 0);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users</h1>
          <p className="text-sm text-gray-500 mt-1">Manage CMS users, roles and access</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowOwnPw(true)} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium">
            <Key size={16} /> Change My Password
          </button>
          <button onClick={() => { clearForm(); setShowForm(true); setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100); }} className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 rounded-lg hover:bg-brand-purple-light text-sm font-medium">
            <Plus size={16} /> New User
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>}

      {/* CREATE / EDIT FORM */}
      {showForm && (
        <div ref={formRef} className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">{editingId ? 'Edit User' : 'Create New User'}</h2>
            <button onClick={clearForm} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple" placeholder="user@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password {editingId ? '(leave empty to keep current)' : '*'}</label>
              <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple" placeholder="Min 8 characters" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple">
                {assignableRoles.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-brand-purple focus:ring-brand-purple" />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100 flex gap-3">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-brand-purple text-white px-5 py-2 rounded-lg hover:bg-brand-purple-light text-sm font-medium disabled:opacity-50">
              <Save size={16} /> {saving ? 'Saving...' : editingId ? 'Update User' : 'Create User'}
            </button>
            <button onClick={clearForm} className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* USERS TABLE */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading users...</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Created</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(u => {
                  const isMe = u.id === myId;
                  const canEdit = isSuperAdmin || (ROLE_LEVEL[u.role as Role] ?? 0) < (ROLE_LEVEL[myRole] ?? 0);
                  return (
                    <tr key={u.id} className={`hover:bg-gray-50 ${!u.isActive ? 'opacity-60' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{u.name || '—'}{isMe && <span className="ml-1.5 text-xs text-brand-neon font-bold">(you)</span>}</div>
                        <div className="text-xs text-gray-400">{u.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[u.role] || 'bg-gray-100 text-gray-600'}`}>
                          {ROLE_ICONS[u.role]} {ROLE_LABELS[u.role as Role] || u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {u.isActive
                          ? <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium"><UserCheck size={14} /> Active</span>
                          : <span className="inline-flex items-center gap-1 text-red-500 text-xs font-medium"><UserX size={14} /> Inactive</span>
                        }
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {(canEdit || isMe) && (
                            <button onClick={() => openEdit(u)} title="Edit" className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-brand-purple"><Pencil size={15} /></button>
                          )}
                          {canEdit && !isMe && (
                            <button onClick={() => toggleActive(u)} title={u.isActive ? 'Deactivate' : 'Activate'} className={`p-1.5 rounded hover:bg-gray-100 ${u.isActive ? 'text-gray-500 hover:text-red-500' : 'text-gray-400 hover:text-green-600'}`}>
                              {u.isActive ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                          )}
                          {canEdit && !isMe && (
                            <button onClick={() => { setResetUserId(u.id); setNewPassword(''); setError(''); }} title="Reset Password" className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-amber-600"><Key size={15} /></button>
                          )}
                          {isSuperAdmin && !isMe && (
                            <button onClick={() => deleteUser(u)} title="Delete" className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"><Trash2 size={15} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PASSWORD RESET MODAL */}
      {resetUserId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="font-semibold text-lg mb-1">Reset Password</h3>
            <p className="text-sm text-gray-500 mb-4">Set a new password for: <span className="font-medium">{users.find(u => u.id === resetUserId)?.email}</span></p>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password (min 8 chars)" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4" />
            <div className="flex justify-end gap-2">
              <button onClick={() => { setResetUserId(null); setNewPassword(''); }} className="px-4 py-2 text-gray-500 text-sm">Cancel</button>
              <button onClick={handleResetPassword} disabled={resetSaving || newPassword.length < 8} className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
                <Key size={16} /> {resetSaving ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE OWN PASSWORD MODAL */}
      {showOwnPw && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="font-semibold text-lg mb-1">Change Your Password</h3>
            <p className="text-sm text-gray-500 mb-4">Enter your current password and choose a new one.</p>
            <div className="space-y-3">
              <input type="password" value={ownPwForm.currentPassword} onChange={e => setOwnPwForm(p => ({ ...p, currentPassword: e.target.value }))} placeholder="Current password" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              <input type="password" value={ownPwForm.newPassword} onChange={e => setOwnPwForm(p => ({ ...p, newPassword: e.target.value }))} placeholder="New password (min 8 chars)" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => { setShowOwnPw(false); setOwnPwForm({ currentPassword: '', newPassword: '' }); }} className="px-4 py-2 text-gray-500 text-sm">Cancel</button>
              <button onClick={handleOwnPw} disabled={ownPwSaving || ownPwForm.newPassword.length < 8 || !ownPwForm.currentPassword} className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
                <Save size={16} /> {ownPwSaving ? 'Saving...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ROLE PERMISSIONS REFERENCE */}
      <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Role Permissions Reference</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="border border-red-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2"><ShieldAlert size={16} className="text-red-600" /><span className="font-semibold text-red-700">Super Admin</span></div>
            <p className="text-gray-500">Full control: users, settings, all content, delete users, change any role.</p>
          </div>
          <div className="border border-purple-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2"><ShieldCheck size={16} className="text-purple-600" /><span className="font-semibold text-purple-700">Admin</span></div>
            <p className="text-gray-500">Manage content, magazine, banners, footer, media. Create users (below admin). Cannot modify settings or super admins.</p>
          </div>
          <div className="border border-blue-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2"><Shield size={16} className="text-blue-600" /><span className="font-semibold text-blue-700">Editor</span></div>
            <p className="text-gray-500">Create, edit & publish articles. Upload media. Manage magazine & events.</p>
          </div>
          <div className="border border-amber-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2"><Pencil size={16} className="text-amber-600" /><span className="font-semibold text-amber-700">Contributor</span></div>
            <p className="text-gray-500">Create and edit draft articles only. Cannot publish or modify other settings.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2"><Eye size={16} className="text-gray-500" /><span className="font-semibold text-gray-600">Viewer / Support</span></div>
            <p className="text-gray-500">Read-only access to the dashboard. Cannot edit any content.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
